const router = require('../../router')();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;
const Event = mongoose.model('Event');
const Category = mongoose.model('Category');
const Gallery = mongoose.model('Gallery');
const Video = mongoose.model('Video');

const request = require('request');
const fs = require('fs');
const config = require('getconfig');
const sharp = require('sharp');

const logger = require('../../../utilities/logger');

const populate_Partner = [
  { 
    "path": "performance", 
    "select": "title slug image abouts stats duration tech_arts tech_reqs",
    "model": "Performance", 
    "populate": [
      { 
        "path": "users" , 
        "select": "stagename image abouts addresses social web",
        "model": "User",
        "populate": [
          { 
            "path": "members" , 
            "select": "stagename image abouts web social",
            "model": "User"
          }
        ]
      },{ 
        "path": "categories" , 
        "select": "name slug",
        "model": "Category",
        "populate": [
          { 
            "path": "ancestor" , 
            "select": "name slug",
            "model": "Category"
          }
        ]
      }
    ] 
  },{ 
    "path": "reference", 
    "select": "stagename image name surname addresses email mobile", 
    "model": "User"
  },{ 
    "path": "subscriptions.subscriber_id", 
    "select": "stagename image name surname addresses email mobile", 
    "model": "User"
  }
];

const status = [
  '_id',
  'brand',
  'legalentity',
  'delegate',
  'selecta',
  'satellite',
  'event',
  'country',
  'description',
  'address',
  'type',
  'websites',
  'contacts',
  'partnerships',
  'channels',
  'users',
  'user_id'
];
var populate = [
  {path: "members", select: {stagename:1, name:1, surname:1, email:1, emails:1, phone:1, mobile:1, skype:1, slug:1, social:1, web:1}, model:"UserShow"},
  {path: "partnerships", select: {title:1, slug:1}, model:"EventShow"},
  {path: "partnerships.category", select: {name:1, slug:1}, model:"Category"}
];
router.get('/', (req, res) => {
  const myids = req.user.crews.concat([req.user._id]);
  User.
  find({"_id": {$in:myids}}).
  sort({stagename: 1}).
  select({stagename:1}).
  exec((err, data) => {
    //logger.debug(Object.keys(data[0]));

    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      res.render('admindev/partners/home', {
        title: 'Partners',
        currentUrl: req.originalUrl,
        superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
        data: data,
        script: false
      });
    }
  });
});

router.get('/:id', (req, res) => {
  logger.debug('/partners/'+req.params.id);
  User.
  find({"partner_owner": req.params.id}).
  lean().
  sort({stagename: 1}).
  //select({stagename: 1, createdAt: 1, crews:1}).
  populate(populate).
  exec((err, data) => {
    Event.
    find({"users": req.params.id}).
    select({title: 1}).
    sort({title: 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    exec((err, events) => {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        res.render('admindev/partners/organization_partners', {
          title: 'Partners',
          currentUrl: req.originalUrl,
          superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
          owner: req.params.id,
          events: events,
          user: req.user,
          data: data,
          script: false
        });
      }
    });
  });
});

router.get('/:id/:event', (req, res) => {
  logger.debug('/organizations/'+req.params.event);
  const query = {"partner_owner": req.params.id, "partnerships":req.params.event};
  logger.debug(query);
  User.
  find(query).
  lean().
  sort({stagename: 1}).
  //select({stagename: 1, createdAt: 1, crews:1}).
  populate(populate).
  exec((err, data) => {
    Event.
    find({"users": req.params.id}).
    select({title: 1}).
    sort({title: 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    exec((err, events) => {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        res.render('admindev/partners/organization_partners', {
          title: 'Partners',
          currentUrl: req.originalUrl,
          superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
          owner: req.params.id,
          events: events,
          event: req.params.event,
          user: req.user,
          data: data,
          script: false
        });
      }
    });
  });
});

router.get('/:id/:event/grantsdata', (req, res) => {
  logger.debug('/organizations/'+req.params.event);
  var grantevents = {
    flyer: [{
      "Event Name": "Live Cinema Festival",
      "Event Month": "September (second week)",
      "Event City": "Rome",
      "Event Country": "Italy",
      "Description": "Live Cinema Festival aims to offer the audience an overview of different ways of interpreting Live Cinema, from analogic of projectors 16mm to the last digital experiments."
    },{
      "Event Name": "Fotonica Festival",
      "Event Month": "December",
      "Event City": "Rome",
      "Event Country": "Italy",
      "Description": "Fotonica is an Audio Visual Digital Art Festival that wants to explore the art forms related to the light element in the contemporary context."
    },{
      "Event Name": "LPM Live Performers Meeting",
      "Event Month": "February",
      "Event City": "DECIDED YEARLY BY THE COMMUNITY",
      "Event Country": "",
      "Description": "LPM Live Performers Meeting with 18 editions, is a nomade artists meeting open to the audience that offers the unique opportunity to experience 4 days of audiovisual performances, VJing, workshops, panel discussion, product showcases from over 400 artists from 42 countries with more than 250 show for every edition."
    }],
    telenoika: [{
      "Event Name": "Visual Brasil",
      "Event Month": "September (fourth week)",
      "Event City": "Barcelona",
      "Event Country": "Spain",
      "Description": "The Visual Brasil Festival celebrates together with local and international artists a research meeting in the field of contemporary audiovisual: video art, mapping, audiovisual performances, workshops, installations and VJs. An activity that focuses on the production of video in real time, the culture of free creation and new collaborative formats."
    }],
    photon: [{
      "Event Name": "Patchlab Festival",
      "Event Month": "October (second week)",
      "Event City": "Cracow",
      "Event Country": "Poland",
      "Description": "The International Digital Art Festival Patchlab is an annual event, which combines interdisciplinary digital works created on the border of arts, new technologies and creative programming."
    }],
    lunchmeat: [{
      "Event Name": "Lunchmeat Festival",
      "Event Month": "October (fourth week)",
      "Event City": "Prague",
      "Event Country": "Czech Republic",
      "Description": "Lunchmeat is an annual international festival dedicated to advanced electronic music and new media art based in Prague, Czech Republic. It brings carefully selected creators from different art spheres together on one stage, creating a truly synesthetic experience."
    }],
    simultan: [{
      "Event Name": "Simultan Festival",
      "Event Month": "November (second week)",
      "Event City": "Bucharest",
      "Event Country": "Romania",
      "Description": ""
    }],
    qvrtv: [{
      "Event Name": "Thetaversal",
      "Event Month": "November (fourth week)",
      "Event City": "Galway",
      "Event Country": "Ireland",
      "Description": "ThetaVersal Audiovisual Festival will be a brand new event in Ireland with the aim to be a new platform for AV, VJs, Video and sound artists."
    }],
    jetztkultur: [{
      "Event Name": "B-Seite Festival",
      "Event Month": "March",
      "Event City": "Mannheim",
      "Event Country": "Germany",
      "Description": "B-side Festival covers the entire spectrum audiovisual feeling of happiness from: Video Performance encounters musical delicacies, surprise interventions in public space and meet international artists in Mannheim scene icons."
    }],
    elasticeye: [{
      "Event Name": "Splice Festival",
      "Event Month": "April",
      "Event City": "London",
      "Event Country": "United Kingdom",
      "Description": "Splice Festival, born in 2016 within AVnode 2015 > 2018 project, explores the overlapping fields of audio-visual art and culture through a collection of live performances, talks and workshops focused around live cinema, AV remixing, VJing, video art and projection mapping."
    }],
    multitrab: [{
      "Event Name": "Athens Digital Art Festival",
      "Event Month": "May",
      "Event City": "Athens",
      "Event Country": "Greece",
      "Description": "Interactive works, audiovisual installations, video art, web art, digital image, creative workshops for adults and kids, artists’ talks, presentations of international festivals, AV performances and music events, highlighting the developments in new technologies and artistic practices."
    }],
    avmov: [{
      "Event Name": "Amorphous Festival",
      "Event Month": "June",
      "Event City": "Caldas da Rainha",
      "Event Country": "Portugal",
      "Description": "Amorphous Festival wants to create an international AV event in Portugal, gathering national artists, both established and emerging ones, local students, programmers and teachers, at an event dedicated to audiovisual performance in Caldas da Rainha with workshops, Lectures, AV installations, micromapping, AV performances, vj/dj sets and live video mapping."
    }],
    avnode: [{
      "Event Name": "AVnode Meeting",
      "Event Month": "July (first week)",
      "Event City": "Amsterdam",
      "Event Country": "Netherlands",
      "Description": "Annual meeting of the partners of the project in Amsterdam. 3 Days of full immersion on project development and report during the day and a selection of artists from every partner will follow in the evening."
    }],
    "debreceni-campus": [{
      "Event Name": "Campus fesztival",
      "Event Month": "July (third week)",
      "Event City": "Debrecen",
      "Event Country": "Hungary",
      "Description": "The Campus Festival is a light music event in Debrecen, held every July. Officially known as Campus Festival, it first appeared in 2007, before that it was Lake Vekeri Festival between 2002 and 2006. In 2007, Debrecen won the right to organize the EFOTT Festival, so they wanted to organize this event at Lake Vekeri, and then moved the Lake Vekeri Festival to the Great Forest of Debrecen, giving it a new name, the Campus Festival. Accompanying the festival is the Campus Olympia, where three sports - mini-football, basketball and beach volleyball - are organized.\n\nIn 2014, the event had over seventy thousand participants, which set a record in festival history. Eighty-five thousand in 2015 and in ninety-eight thousand in 2016.\n\nEach year the festival offers a number of celebrities from abroad, including Rasmus, Madcon, Apocalyptica, DJ Antoine, Clean Bandit, Jess Glynne, Irish Therapy? and Kensington in the Netherlands.\n\nIn 2017, EFFE (Europe for Festivals, Festivals for Europe) awarded the event the highest rating."
    }]};


  const query = {"partner_owner": req.params.id, "partnerships":req.params.event};
  logger.debug(query);
  User.
  find(query).
  lean().
  sort({"organizationData.legal_name": 1}).
  //select({stagename: 1, createdAt: 1, crews:1}).
  populate(populate).
  exec((err, data) => {
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      res.render('admindev/partners/grantsdata', {
        title: 'Partners',
        currentUrl: req.originalUrl,
        superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
        owner: req.params.id,
        event: req.params.event,
        grantevents: grantevents,
        user: req.user,
        printable: true,
        data: data,
        script: false
      });
    }
  });
});


router.get('/:id/:event/mandates', (req, res) => {
  logger.debug('/organizations/'+req.params.event);
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1}).
  exec((err, event) => {
    const query = {"partner_owner": req.params.id, "partnerships":req.params.event};
    const mandate = "";
    logger.debug(query);
    User.
    find(query).
    lean().
    sort({"organizationData.legal_name": 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    populate(populate).
    exec((err, data) => {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        res.render('admindev/partners/mandates', {
          title: 'Partners',
          currentUrl: req.originalUrl,
          superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
          owner: req.params.id,
          event: req.params.event,
          event_title: event.title,
          mandate: mandate,
          user: req.user,
          printable: true,
          data: data,
          script: false
        });
      }
    });
  });
});

router.get('/:id/:event/manage', (req, res) => {
  logger.debug('/organizations/'+req.params.event);
  Category.
  find({ancestor: "5be8708afc396100000001eb"}).
  lean().
  exec((err, categories) => {
    const query = {"partner_owner": req.params.id};
    User.
    find(query).
    lean().
    sort({stagename: 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    populate(populate).
    exec((err, data) => {
      var populate = [
        {path: "partners.users", select: {stagename:1}, model:"UserShow"},
        {path: "partners.category", select: {name:1, slug:1}, model:"Category"}
      ];

      Event.
      //find({"users": req.params.id}).
      findOne({_id: req.params.event}).
      populate(populate).
      select({title: 1, partners:1}).
      //sort({title: 1}).
      //select({stagename: 1, createdAt: 1, crews:1}).
      //exec((err, events) => {
      exec((err, event) => {
        var partnerships = event.partners.slice(0);
        logger.debug(existingCat);
        var notassigned = [];
        var notassignedID = [];
        var partnersID = [];

        for (var item=0; item<partnerships.length; item++) partnersID = partnersID.concat(partnerships[item].users.map(item => {return item._id.toString()}));
        for (var item in data) {
          if (partnersID.indexOf(data[item]._id.toString())===-1) {
            if (notassignedID.indexOf(data[item]._id.toString())===-1) {
              notassignedID.push(data[item]._id.toString());
              notassigned.push(data[item]);
            }
          }
        }
        var existingCat = partnerships.map(item => {return item.category._id.toString()});
        for (var item in categories) {
          if (existingCat.indexOf(categories[item]._id.toString())===-1) partnerships.push({category:categories[item], users:[]});
        }
        if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
          res.json(data);
        } else {
          res.render('admindev/partners/partners_manager', {
            title: 'Partners',
            currentUrl: req.originalUrl,
            superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
            owner: req.params.id,
            //events: events,
            notassigned: notassigned,
  
            event: req.params.event,
            partnerships: partnerships,
            script: false
          });
        }
      });
    });
  });
});

router.post('/contacts/add/', (req, res) => {
  logger.debug('/contacts/add/');
  logger.debug(req.body);
  /*Category.
  find({ancestor: "5be8708afc396100000001eb"}).
  lean().
  exec((err, categories) => {
    const query = {"partner_owner": req.params.id};
    User.
    find(query).
    lean().
    sort({stagename: 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    populate(populate).
    exec((err, data) => {
      var populate = [
        {path: "partners.users", select: {stagename:1}, model:"UserShow"},
        {path: "partners.category", select: {name:1, slug:1}, model:"Category"}
      ];

      Event.
      //find({"users": req.params.id}).
      findOne({_id: req.params.event}).
      populate(populate).
      select({title: 1, partners:1}).
      //sort({title: 1}).
      //select({stagename: 1, createdAt: 1, crews:1}).
      //exec((err, events) => {
      exec((err, event) => {
        var partnerships = event.partners.slice(0);
        logger.debug(existingCat);
        var notassigned = [];
        var notassignedID = [];
        var partnersID = [];

        for (var item=0; item<partnerships.length; item++) partnersID = partnersID.concat(partnerships[item].users.map(item => {return item._id.toString()}));
        for (var item in data) {
          if (partnersID.indexOf(data[item]._id.toString())===-1) {
            if (notassignedID.indexOf(data[item]._id.toString())===-1) {
              notassignedID.push(data[item]._id.toString());
              notassigned.push(data[item]);
            }
          }
        }
        var existingCat = partnerships.map(item => {return item.category._id.toString()});
        for (var item in categories) {
          if (existingCat.indexOf(categories[item]._id.toString())===-1) partnerships.push({category:categories[item], users:[]});
        }
        if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
          res.json(data);
        } else {
          res.render('admindev/partners/partners_manager', {
            title: 'Partners',
            currentUrl: req.originalUrl,
            superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
            owner: req.params.id,
            //events: events,
            notassigned: notassigned,
  
            event: req.params.event,
            partnerships: partnerships,
            script: false
          });
        }
      });
    });
  });*/
});



/*
router.get('/:event/acts', (req, res) => {
  logger.debug('/organizations/'+req.params.event+'/acts');
  logger.debug(req.query)
  let data = {};
  User.
  findOne({"_id": req.params.event}).
  select({title: 1, schedule: 1, organizationsettings: 1}).
  //populate(populate_event).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      data.event = event;
      data.status = status;
      let query = {"event": req.params.event};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['schedule.categories'] && req.query['schedule.categories']!='0') query['schedule.categories'] = req.query['schedule.categories'];
      logger.debug(query);
      Program.
      find(query).
      //select({title: 1, organizationsettings: 1}).
      populate(populate_program).
      exec((err, program) => {
        logger.debug(program);
        if (err) {
          res.json(err);
        } else {
          data.program = program;
          let admittedO = {};
          for(let a=0;a<event.organizationsettings.call.calls.length;a++) for(let b=0; b<event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (event.organizationsettings.call.calls[a].admitted[b]);
          data.admitted = [];
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);
          data.rooms = [];
          for(let a=0;a<event.schedule.length;a++)  if (event.schedule[a].venue && event.schedule[a].venue.room) data.rooms.push(event.schedule[a].venue.room);
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            res.render('admindev/organizations/acts', {
              title: 'Events',
              data: data,
              currentUrl: req.originalUrl,
              get: req.query
            });
          }
        }
      });
    }
  });
});

router.get('/:event/peoples', (req, res) => {
  logger.debug('/organizations/'+req.params.event+'/peoples');
  logger.debug(req.query)
  let data = {};
  User.
  findOne({"_id": req.params.event}).
  select({title: 1, schedule: 1, organizationsettings: 1}).
  //populate(populate_event).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      data.event = event;
      data.status = status;
      let query = {"event": req.params.event};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['schedule.categories'] && req.query['schedule.categories']!='0') query['schedule.categories'] = req.query['schedule.categories'];
      logger.debug(query);
      Program.
      find(query).
      //select({title: 1, organizationsettings: 1}).
      populate(populate_program).
      exec((err, program) => {

        logger.debug(program);
        if (err) {
          res.json(err);
        } else {
          data.program = program;
          let days = [];
          for(let a=0;a<program.length;a++) {
            for(let b=0; b<program[a].subscriptions.length;b++) {
              days = days.concat(program[a].subscriptions[b].days);
            }
          }
          days = days.sort(function(a, b) {
            a = new Date(a);
            b = new Date(b);
            return a<b ? -1 : a>b ? 1 : 0;
          });
          data.days = days;
          data.daysN = (data.days[data.days.length-1]-data.days[0])/(24*60*60*1000);
          let admittedO = {};
          for(let a=0;a<event.organizationsettings.call.calls.length;a++) for(let b=0; b<event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (event.organizationsettings.call.calls[a].admitted[b]);
          data.admitted = [];
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);
          data.rooms = [];
          for(let a=0;a<event.schedule.length;a++)  if (event.schedule[a].venue && event.schedule[a].venue.room) data.rooms.push(event.schedule[a].venue.room);
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            res.render('admindev/organizations/peoples', {
              title: 'Events',
              data: data,
              currentUrl: req.originalUrl,
              get: req.query
            });
          }
        }
      });
    }
  });
});

router.get('/:event/program', (req, res) => {
  logger.debug('/organizations/'+req.params.event+'/program');

  let data = {};
  User.
  findOne({"_id": req.params.event}).
  select({title: 1, schedule: 1, organizationsettings: 1}).
  //populate(populate_event).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      data.event = event;
      data.status = status;
      Program.
      find({"event": req.params.event}).
      //select({title: 1, organizationsettings: 1}).
      populate(populate_program).
      exec((err, program) => {
        if (err) {
          res.json(err);
        } else {
          data.program = program;
          let admittedO = {};
          for(let a=0;a<event.organizationsettings.call.calls.length;a++) for(let b=0; b<event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (event.organizationsettings.call.calls[a].admitted[b]);
          data.admitted = [];
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);
          data.rooms = [];
          for(let a=0;a<event.schedule.length;a++)  if (event.schedule[a].venue && event.schedule[a].venue.room) data.rooms.push(event.schedule[a].venue.room);
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            res.render('admindev/organizations/program', {
              title: 'Events',
              data: data,
              currentUrl: req.originalUrl,
              get: req.query
            });
          }
        }
      });
    }
  });
});*/

module.exports = router;