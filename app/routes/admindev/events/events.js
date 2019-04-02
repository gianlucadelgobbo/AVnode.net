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
        "path": "program.status" , 
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
  select({title: 1, schedule: 1, program: 1, organizationsettings: 1}).
  populate([{"path": "organizationsettings.call.calls.admitted", "select": "name slug", "model": "Category"}]).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      const select = config.cpanel["subscriptions"].list.select;
      const populate = req.query.pure ? [] : config.cpanel["subscriptions"].list.populate;
      let query = {"event": req.params.event};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['status'] && req.query['status']!='0') query['status'] = req.query['program.schedule.statusNOT'] ? {$ne :req.query['status']} : req.query['status'];
      if (req.query['performance_category'] && req.query['performance_category']!='0') {
        for(var item in populate) {
          if (populate[item].path == "performance") {
            populate[item].match = {type: req.query['performance_category']};
          }
        }
      }
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
          for(let a=0;a<data.program.length;a++) {
            for(let b=0; b<event.program.length;b++) {
              if(data.program[a].performance && data.program[a].performance._id == event.program[b].performance) {
                data.program[a].schedule = event.program[b].schedule;
              } else if (!data.program[a].performance && !req.query['performance_category']){
                if (!data.performnce_missing) data.performnce_missing = []; 
                data.performnce_missing.push(data.program[a]);
              }
            }
          }
          if (data.performnce_missing) data.performnce_missing = JSON.stringify(performnce_missing);
          //if (req.query['performance_category'] && req.query['performance_category']!='0') {
            let prg = [];
            for(let a=0;a<data.program.length;a++) {
              if (data.program[a].performance) prg.push(data.program[a]);
            }
            data.program = prg;
          //}
          if (req.query.sortby && req.query.sortby=='sortby_ref_name') {
            data.program = data.program.sort((a,b) => (a.reference.stagename > b.reference.stagename) ? 1 : ((b.reference.stagename > a.reference.stagename) ? -1 : 0));
          }
          if (req.query.sortby && req.query.sortby=='sortby_perf_name') {
            data.program = data.program.sort((a,b) => (a.performance.title > b.performance.title) ? 1 : ((b.performance.title > a.performance.title) ? -1 : 0));
          }
          let admittedO = {};
          for(let a=0;a<data.event.organizationsettings.call.calls.length;a++) for(let b=0; b<data.event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[data.event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (data.event.organizationsettings.call.calls[a].admitted[b]);
          data.admitted = [];
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);
          data.rooms = [];
          for(let a=0;a<data.event.schedule.length;a++)  if (data.event.schedule[a].venue && data.event.schedule[a].venue.room) data.rooms.push(data.event.schedule[a].venue.room);
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
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
  select({title: 1, schedule: 1, program: 1, organizationsettings: 1}).
  populate([{"path": "organizationsettings.call.calls.admitted", "select": "name slug", "model": "Category"}]).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      const select = config.cpanel["subscriptions"].list.select;
      const populate = req.query.pure ? [] : config.cpanel["subscriptions"].list.populate;
      let query = {"event": req.params.event};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['status'] && req.query['status']!='0') query['status'] = req.query['status'];
      if (req.query['performance_category'] && req.query['performance_category']!='0') {
        for(var item in populate) {
          if (populate[item].path == "performance") {
            populate[item].match = {type: req.query['performance_category']};
          }
        }
      }
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
          for(let a=0;a<data.program.length;a++) {
            for(let b=0; b<event.program.length;b++) {
              if(data.program[a].performance && data.program[a].performance._id == event.program[b].performance) {
                data.program[a].schedule = event.program[b].schedule;
              } else if (!data.program[a].performance && !req.query['performance_category']){
                if (!data.performnce_missing) data.performnce_missing = []; 
                data.performnce_missing.push(data.program[a]);
              }
            }
          }
          if (data.performnce_missing) data.performnce_missing = JSON.stringify(performnce_missing);
          //if (req.query['performance_category'] && req.query['performance_category']!='0') {
            let prg = [];
            for(let a=0;a<data.program.length;a++) {
              if (data.program[a].performance) prg.push(data.program[a]);
            }
            data.program = prg;
          //}
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
          for(let a=0;a<data.event.organizationsettings.call.calls.length;a++) for(let b=0; b<data.event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[data.event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (data.event.organizationsettings.call.calls[a].admitted[b]);
          data.admitted = [];
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);
          
          data.subscriptions = [];
          for(let a=0;a<program.length;a++) {
            for(let b=0; b<program[a].subscriptions.length;b++) {
              if (!program[a].subscriptions[b].freezed) {
                let subscription = JSON.parse(JSON.stringify(program[a]));
                delete subscription.subscriptions;
                delete subscription.performance;
                subscription.performances = [program[a].performance];
                subscription.subscription = program[a].subscriptions[b];
                data.subscriptions.push(subscription);
              }
            }
          }
          for(let a=0;a<program.length;a++) {
            for(let b=0; b<program[a].subscriptions.length;b++) {
              if (program[a].subscriptions[b].freezed) {
                let subscriber_id_map = data.subscriptions.map(subscriber => {return subscriber.subscription.subscriber_id._id.toString()});
                let subscriber_id_index = subscriber_id_map.indexOf(program[a].subscriptions[b].subscriber_id._id.toString());
                if (subscriber_id_index!=-1) {
                  data.subscriptions[subscriber_id_index].performances.push(program[a].performance);
                } else {
                  let subscription = JSON.parse(JSON.stringify(program[a]));
                  delete subscription.subscriptions;
                  delete subscription.performance;
                  subscription.performances = [program[a].performance];
                  subscription.subscription = program[a].subscriptions[b];
                  data.subscriptions.push(subscription);
                }
              }
            }
          }
          if (req.query.sortby && req.query.sortby=='sortby_ref_name') {
            data.subscriptions = data.subscriptions.sort((a,b) => (a.reference.stagename > b.reference.stagename) ? 1 : ((b.reference.stagename > a.reference.stagename) ? -1 : 0));
          }
          if (req.query.sortby && req.query.sortby=='sortby_perf_name') {
            data.subscriptions = data.subscriptions.sort((a,b) => (a.performances[0].title > b.performances[0].title) ? 1 : ((b.performances[0].title > a.performances[0].title) ? -1 : 0));
          }

          if (req.query.sortby && req.query.sortby=='sortby_person_name') {
            data.subscriptions = data.subscriptions.sort((a,b) => ((a.subscription.subscriber_id.name+" "+a.subscription.subscriber_id.surname) > (b.subscription.subscriber_id.name+" "+b.subscription.subscriber_id.surname)) ? 1 : (((b.subscription.subscriber_id.name+" "+b.subscription.subscriber_id.surname) > (a.subscription.subscriber_id.name+" "+a.subscription.subscriber_id.surname)) ? -1 : 0));
          }

          if (req.query.sortby && req.query.sortby=='sortby_arrival_date') {
            data.subscriptions = data.subscriptions.sort((a,b) => ((a.subscription.days[0]) > (b.subscription.days[0])) ? 1 : (((b.subscription.days[0]) > (a.subscription.days[0])) ? -1 : 0));
          }

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

router.post('/:event/program', (req, res) => {
  req.body.event = req.params.event;
  logger.debug(req.body);
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1, program: 1}).
  //populate(populate_event).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      for(var item in event.program) {
        if(event.program[item].performance == req.body.performance) {
          if (event.program[item].schedule && event.program[item].schedule.length) {
            // TODO
          } else {
            if (!event.program[item].schedule) event.program[item].schedule = [];
            event.program[item].schedule.push(req.body.schedule);
          }
        }
      }
      event.save((err) => {
        if (err) {
          res.json(err);
        } else {
          Performance.
          findOne({"_id": req.body.performance}).
          select({title: 1, bookings: 1}).
          //populate(populate_event).
          exec((err, performance) => {
            if (err) {
              res.json(err);
            } else {
              let add = true;
              if(performance.bookings) {
                for(var item in performance.bookings) {
                  if(performance.bookings[item].event == req.body.event) {
                    add = false;
                    if (performance.bookings[item].schedule && performance.bookings[item].schedule.length) {
                      // TODO
                    } else {
                      if (!performance.bookings[item].schedule) performance.bookings[item].schedule = [];
                      performance.bookings[item].schedule.push(req.body.schedule);
                    }
                  }
                }
              }
              if (add) {
                performance.bookings = [{schedule:req.body.schedule, event: req.params.event}];
              }
            }
            performance.save((err) => {
              if (err) {
                res.json(err);
              } else {
                res.json(performance);
              }
            });
          });
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