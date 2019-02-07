const router = require('../../router')();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = mongoose.model('Event');
const ObjectId = Schema.ObjectId;
const User = mongoose.model('User');
const Performance = mongoose.model('Performance');
const Category = mongoose.model('Category');
const Gallery = mongoose.model('Gallery');
const Video = mongoose.model('Video');
const Program = mongoose.model('Program');

const request = require('request');
const fs = require('fs');
const config = require('getconfig');
const sharp = require('sharp');

const logger = require('../../../utilities/logger');

const populate_program = [
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
        "path": "type" , 
        "select": "name slug",
        "model": "Category",
        "populate": [
          { 
            "path": "ancestor" , 
            "select": "name slug",
            "model": "Category"
          }
        ]
      },{ 
        "path": "tecnique" , 
        "select": "name slug",
        "model": "Category",
        "populate": [
          { 
            "path": "ancestor" , 
            "select": "name slug",
            "model": "Category"
          }
        ]
      },{ 
        "path": "genre" , 
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

/* let populate_event = [
  { 
    "path": "program.performance" , 
    "select": "title image abouts stats duration tech_arts tech_reqs",
    "model": "Performance",
    "populate": [
      { 
        "path": "users" , 
        "select": "stagename image abouts addresses social web",
        "model": "UserShow"
      },{ 
        "path": "videos" , 
        "select": "title media",
        "model": "Video"
      },{ 
        "path": "galleries" , 
        "select": "title image",
        "model": "Gallery"
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
        "path": "program.schedule.categories" , 
        "select": "name slug",
        "model": "Category",
        "populate": [
          { 
            "path": "ancestor" , 
            "select": "name slug",
            "model": "Category"
          }
        ]
      },{ 
        "path": "organizationsettings.call.calls.admitted" , 
        "select": "name slug",
        "model": "Category"
      },{ 
        "path": "program.subscription_id" , 
        //"select": "name slug",
        "model": "Program",
        "populate": [
          { 
            "path": "subscriptions.subscriber_id" , 
            "select": "stagename slug",
            "model": "UserShow"
          },{ 
            "path": "reference" , 
            "select": "stagename name surname email mobile",
            "model": "UserShow"
          }
        ]
      }
    ];
 */
const status = [
  { "_id" : "5c38c57d9d426a9522c15ba5", "name" : "to be evaluated" },
  { "_id" : "5be8708afc3961000000019e", "name" : "accepted - waiting for payment" },
  { "_id" : "5be8708afc39610000000013", "name" : "accepted" },
  { "_id" : "5be8708afc39610000000097", "name" : "to be completed" },
  { "_id" : "5be8708afc3961000000011a", "name" : "not_accepted" },
  { "_id" : "5be8708afc39610000000221", "name" : "refused from user" }
];

// V > db.events.findOne({"schedule.venue.location.locality":{$exists: true}},{schedule:1});
// V {"addresses.country": "Italy", "addresses.locality":{$in: ["Rome","Roma"]}},{addresses:1}

router.get('/', (req, res) => {
  logger.debug('/events');
  let results = {};
  const myids = req.user.crews.concat([req.user._id.toString()]);
  Event.
  find({"users": {$in: myids}/* ,"organizationsettings.call.calls.0":{$exists:true} */}).
  //lean().
  select({title: 1, createdAt: 1, organizationsettings:1, social:1, web:1}).
  populate({path: "users", select: {stagename:1}}).
  sort({"schedule.starttime":-1}).
  exec((err, data) => {
    results.events = data;
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(results);
    } else {
      logger.debug(data);
      res.render('admindev/events/home', {
        title: 'Events',
        currentUrl: req.originalUrl,
        superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
        data: results,
        script: false
      });
    }
  });
});
router.get('/:event', (req, res) => {
  logger.debug('/events/'+req.params.event);
  let data = {};
  Event.
  findOne({"_id": req.params.event}).
  //lean().
  select({title: 1, createdAt: 1}).
  exec((err, event) => {
    data.event = event;
    data.status = status;
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      logger.debug(data);
      res.render('admindev/events/dett', {
        title: 'Events: '+data.event.title,
        currentUrl: req.originalUrl,
        superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
        data: data,
        script: false
      });
    }
  });
});
/* router.get('/:event/acts', (req, res) => {
  logger.debug('/events/'+req.params.event+'/acts');
  populate_event[0].match = { "../subscription_id.call": 1};

  let data = {};
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1, createdAt: 1, program: 1,organizationsettings: 1}).
  populate(populate_event).
  exec((err, event) => {
    if (err) {
      logger.debug(err);
    }
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(event);
    } else {
      let admittedO = {};
      for(let a=0;a<event.organizationsettings.call.calls.length;a++) for(let b=0; b<event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (event.organizationsettings.call.calls[a].admitted[b]);
      let admitted = [];
      for(let adm in admittedO) admitted.push(admittedO[adm]);
      logger.debug(admittedO);
      res.render('admindev/events/acts', {
        title: 'Events',
        status: status,
        admitted: admitted,
        currentUrl: req.originalUrl,
        get: req.query,
        data: event.toJSON(),
        script: false
      });
    }
  });
}); 

router.get('/:event/peoples', (req, res) => {
  logger.debug('/events/'+req.params.event+'/peoples');
  populate_event[0].match = { "../subscription_id.call": 1};

  let data = {};
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1, createdAt: 1, program: 1,organizationsettings: 1}).
  populate(populate_event).
  exec((err, event) => {
    if (err) {
      logger.debug(err);
    }
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(event);
    } else {
      let admittedO = {};
      for(let a=0;a<event.organizationsettings.call.calls.length;a++) for(let b=0; b<event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (event.organizationsettings.call.calls[a].admitted[b]);
      let admitted = [];
      for(let adm in admittedO) admitted.push(admittedO[adm]);
      logger.debug(admittedO);
      res.render('admindev/events/acts', {
        title: 'Events',
        status: status,
        admitted: admitted,
        currentUrl: req.originalUrl,
        get: req.query,
        data: event.toJSON(),
        script: false
      });
    }
  });
});
*/
router.get('/:event/acts', (req, res) => {
  logger.debug('/events/'+req.params.event+'/acts');
  logger.debug(req.query)
  let data = {};
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1, schedule: 1, organizationsettings: 1}).
  //populate(populate_event).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      const select = config.cpanel["subscriptions"].list.select;
      const populate = req.query.pure ? [] : config.cpanel["subscriptions"].list.populate;
      const query = {"event": req.params.event};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['schedule.categories'] && req.query['schedule.categories']!='0') query['schedule.categories'] = req.query['schedule.categories'];
      logger.debug(query);
      Program.
      find(query).
      select(select).
      populate(populate).
      exec((err, program) => {
        if (err) {
          res.json(err);
        } else {
          data.event = event;
          data.status = status;
          data.program = JSON.parse(JSON.stringify(program));
          let admittedO = {};
          for(let a=0;a<data.event.organizationsettings.call.calls.length;a++) for(let b=0; b<data.event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[data.event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (data.event.organizationsettings.call.calls[a].admitted[b]);
          data.admitted = [];
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);
          data.rooms = [];
          for(let a=0;a<data.event.schedule.length;a++)  if (data.event.schedule[a].venue && data.event.schedule[a].venue.room) data.rooms.push(data.event.schedule[a].venue.room);
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            for(let pp in data.program) for(let ss in data.program[pp].subscriptions) console.log(data.program[pp].subscriptions[ss].daysFormatted);
            res.render('admindev/events/acts', {
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
  logger.debug('/events/'+req.params.event+'/peoples');
  logger.debug(req.query)
  let data = {};
  Event.
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
            res.render('admindev/events/peoples', {
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
  logger.debug('/events/'+req.params.event+'/program');

  let data = {};
  Event.
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
            res.render('admindev/events/program', {
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

module.exports = router;