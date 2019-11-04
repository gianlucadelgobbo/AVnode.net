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