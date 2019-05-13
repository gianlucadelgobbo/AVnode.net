const router = require('../../router')();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = mongoose.model('EventShow');
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
const moment = require('moment');

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
    data.status = config.cpanel["events_advanced"].status;
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
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

router.get('/:event/acts', (req, res) => {
  logger.debug('/events/'+req.params.event+'/acts');
  logger.debug(req.query)
  let data = {};
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1, schedule: 1, organizationsettings: 1}).
  populate([{"path": "organizationsettings.call.calls.admitted", "select": "name slug", "model": "Category"}]).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      const select = config.cpanel["events_advanced"].forms["acts"].select;
      const populate = req.query.pure ? [] : config.cpanel["events_advanced"].forms["acts"].populate;
      let query = {"event": req.params.event};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['status'] && req.query['status']!='0') query['status'] = req.query['program.schedule.statusNOT'] ? {$ne :req.query['status']} : req.query['status'];
      for(var item in populate) {
        if (populate[item].path == "performance") {
          if (req.query['performance_category'] && req.query['performance_category']!='0') {
            populate[item].match = {type: req.query['performance_category']};
          }
          if (req.query['bookings.schedule.venue.room'] && req.query['bookings.schedule.venue.room']!='0') {
            populate[item].match = {'bookings.schedule.venue.room': req.query['bookings.schedule.venue.room']};
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
          data.status = config.cpanel["events_advanced"].status;
          data.program = JSON.parse(JSON.stringify(program));
          for(let a=0;a<data.program.length;a++) {
            if(data.program[a].performance) {
              if (data.program[a].performance.abouts) delete data.program[a].performance.abouts;
              if (data.program[a].performance.tech_arts) delete data.program[a].performance.tech_arts;
              if (data.program[a].performance.tech_reqs) delete data.program[a].performance.tech_reqs;
              if (data.program[a].performance.bookings) delete data.program[a].performance.bookings;              
            } else if (!data.program[a].performance && !req.query['performance_category']){
              if (!data.performnce_missing) data.performnce_missing = []; 
              data.performnce_missing.push(data.program[a]);
            }
          }
          if (data.performnce_missing) data.performnce_missing = JSON.stringify(data.performnce_missing);
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

          data.admitted = [];
          let admittedO = {};
          for(let a=0;a<data.event.organizationsettings.call.calls.length;a++) for(let b=0; b<data.event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[data.event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (data.event.organizationsettings.call.calls[a].admitted[b]);
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);

          data.rooms = [];
          for(let a=0;a<data.event.schedule.length;a++)  if (data.event.schedule[a].venue && data.event.schedule[a].venue.room && data.rooms.indexOf(data.event.schedule[a].venue.room) == -1) data.rooms.push(data.event.schedule[a].venue.room);
          data.sortby = [
            {value: 'sortby_perf_name', key: 'sort by perf name'},
            {value: 'sortby_ref_name', key: 'sort by ref name'},
            //{value: 'sortby_person_name', key: 'sort by person name'},
            //{value: 'sortby_arrival_date', key: 'sort by arrival date'},
            {value: '0', key: 'sort by sub date'}
          ];
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            req.query.sez = "acts";
            res.render('admindev/events/acts', {
              title: 'Events: Acts',
              data: data,
              currentUrl: req.originalUrl,
              superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
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
      const select = config.cpanel["events_advanced"].forms["peoples"].select;
      const populate = req.query.pure ? [] : config.cpanel["events_advanced"].forms["peoples"].populate;
      let query = {"event": req.params.event};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['packages.option_selected_hotel'] && req.query['packages.option_selected_hotel']!='0') {
        query['packages.options_name'] = 'hotels';
        query['packages.option'] = req.query['packages.option_selected_hotel'];
      }
      if (req.query['status'] && req.query['status']!='0') query['status'] = req.query['status'];
      for(var item in populate) {
        if (populate[item].path == "performance") {
          if (req.query['performance_category'] && req.query['performance_category']!='0') {
            populate[item].match = {type: req.query['performance_category']};
          }
          if (req.query['bookings.schedule.venue.room'] && req.query['bookings.schedule.venue.room']!='0') {
            populate[item].match = {'bookings.schedule.venue.room': req.query['bookings.schedule.venue.room']};
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
          data.status = config.cpanel["events_advanced"].status;
          let daysdays = [];
          let schedule = JSON.parse(JSON.stringify(data.event.schedule));
          for(let a=0;a<schedule.length;a++) {
            let dayday = new Date(new Date(schedule[a].starttime).setUTCHours(0)).getTime();
            if (daysdays.indexOf(dayday)===-1) {
              daysdays.push(dayday);
            }
          }
          data.days = daysdays.sort(function(a, b) {
            a = new Date(a);
            b = new Date(b);
            return a<b ? -1 : a>b ? 1 : 0;
          });
          data.days.unshift(data.days[0]-(24*60*60*1000));
          data.days.push(data.days[data.days.length-1]+(24*60*60*1000));
          data.daysN = (data.days[data.days.length-1]-data.days[0])/(24*60*60*1000);

          
          data.hotels = [];
          for(let a=0;a<data.event.organizationsettings.call.calls.length;a++)
            for(let b=0; b<data.event.organizationsettings.call.calls[a].packages.length;b++)
              if (data.event.organizationsettings.call.calls[a].packages[b].options_name == "Hotels")
                data.hotels = data.event.organizationsettings.call.calls[a].packages[b].options.split(",");
          
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
          
          if (req.query.sortby && req.query.sortby=='sortby_hotel_room') {
            propertyRetriever = program => {
              for(let a=0;a<program.subscription.packages.length;a++) {
                if (program.subscription.packages[a].name == "Accommodation") {
                  if (program.subscription.packages[a].option) {
                    if (program.subscription.packages[a].option_value) {
                      return program.subscription.packages[a].option + program.subscription.packages[a].option_value;
                    } else {
                      return program.subscription.packages[a].option;
                    }
                  } else {
                    return "ZZZZZZZ";
                  }
                }
              }
              return "ZZZZZZZ";
            }
            data.subscriptions = data.subscriptions.sort(function (a, b) {
              var valueA = propertyRetriever(a);
              var valueB = propertyRetriever(b);
              if (valueA < valueB) {
                  return -1;
              } else if (valueA > valueB) {
                  return 1;
              } else {
                  return 0;
              }
            });
          }

          data.sortby = [
            {value: 'sortby_perf_name', key: 'sort by perf name'},
            {value: 'sortby_ref_name', key: 'sort by ref name'},
            {value: 'sortby_person_name', key: 'sort by person name'},
            {value: 'sortby_arrival_date', key: 'sort by arrival date'},
            {value: 'sortby_hotel_room', key: 'sort by hotel/room'},
            {value: '0', key: 'sort by sub date'}
          ];
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            req.query.sez = "peoples";
            res.render('admindev/events/peoples', {
              title: 'Events: Peoples',
              data: data,
              currentUrl: req.originalUrl,
              superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
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
  populate([{"path": "organizationsettings.call.calls.admitted", "select": "name slug", "model": "Category"}]).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      const select = config.cpanel["events_advanced"].forms["program"].select;
      const populate = req.query.pure ? [] : config.cpanel["events_advanced"].forms["program"].populate;
      let query = {"event": req.params.event, status: "5be8708afc39610000000013"};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
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
          //data.status = config.cpanel["events_advanced"].status;
          data.program = program;
          data.admitted = [];
          let admittedO = {};
          for(let a=0;a<data.event.organizationsettings.call.calls.length;a++) for(let b=0; b<data.event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[data.event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (data.event.organizationsettings.call.calls[a].admitted[b]);
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);

          data.rooms = [];
          for(let a=0;a<data.event.schedule.length;a++)  if (data.event.schedule[a].venue && data.event.schedule[a].venue.room && data.rooms.indexOf(data.event.schedule[a].venue.room) == -1) data.rooms.push(data.event.schedule[a].venue.room);

          let daysdays = [];
          let schedule = JSON.parse(JSON.stringify(data.event.schedule));
          for(let a=0;a<schedule.length;a++) {
            let dayday = new Date(new Date(schedule[a].starttime).setUTCHours(0)).getTime();
            if (daysdays.indexOf(dayday)===-1) {
              daysdays.push(dayday);
            }
          }
          data.days = daysdays;

          if (req.query.sortby && req.query.sortby=='sortby_perf_name') {
            data.program = data.program.sort((a,b) => (a.performance.title > b.performance.title) ? 1 : ((b.performance.title > a.performance.title) ? -1 : 0));
          }
/*           let daysdays = [];
          for(let a=0;a<program.length;a++) {
            for(let b=0; b<program[a].subscriptions.length;b++) {
              daysdays = daysdays.concat(program[a].subscriptions[b].days);
            }
          }
          daysdays = daysdays.sort(function(a, b) {
            a = new Date(a);
            b = new Date(b);
            return a<b ? -1 : a>b ? 1 : 0;
          });
 */          

          data.sortby = [
            {value: 'sortby_perf_name', key: 'sort by perf name'},
            {value: 'sortby_ref_name', key: 'sort by ref name'},
            //{value: 'sortby_person_name', key: 'sort by person name'},
            //{value: 'sortby_arrival_date', key: 'sort by arrival date'},
            {value: '0', key: 'sort by sub date'}
          ];
          
          data.programmebydayvenue = {}
          for(let a=0;a<event.schedule.length;a++) {
            let date = new Date(event.schedule[a].starttime);  // dateStr you get from mongodb
            if (date.getUTCHours()<10) date = new Date(event.schedule[a].starttime-(24*60*60*1000));
            let d = ('0'+date.getUTCDate()).substr(-2);
            let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
            let y = date.getUTCFullYear();
            const lang = global.getLocale();
            let newdate = moment(date).format(config.dateFormat[lang].weekdaydaymonthyear);
            if (!data.programmebydayvenue[y+"-"+m+"-"+d]) {
              data.programmebydayvenue[y+"-"+m+"-"+d] = {
                day: y+"-"+m+"-"+d,
                date: newdate,
                rooms: {}
              };
              data.programmebydayvenue[y+"-"+m+"-"+d].rooms[event.schedule[a].venue.room] = {
                schedule: event.schedule[a],
                program: []
              };
            }
            if (!data.programmebydayvenue[y+"-"+m+"-"+d].rooms[event.schedule[a].venue.room]) {
              data.programmebydayvenue[y+"-"+m+"-"+d].rooms[event.schedule[a].venue.room] = {
                schedule: event.schedule[a],
                program: []
              };
            }
          }
          for(let a=0;a<data.program.length;a++) {
            if (data.program[a].performance) {
              var duration = data.program[a].performance.duration;
              if (data.program[a].schedule && data.program[a].schedule.length) {
                for(let b=0;b<data.program[a].schedule.length;b++) {
                  if (data.program[a].schedule[b] && data.program[a].schedule[b].venue && data.program[a].schedule[b].venue.room) {
                    if ((data.program[a].schedule[b].endtime-data.program[a].schedule[b].starttime)/(24*60*60*1000)<1) {
                      let date = new Date(data.program[a].schedule[b].starttime);  // dateStr you get from mongodb
                      if (date.getUTCHours()<10) date = new Date(data.program[a].schedule[b].starttime-(24*60*60*1000));
                      let d = ('0'+date.getUTCDate()).substr(-2);
                      let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
                      let y = date.getUTCFullYear();
                      let program = JSON.parse(JSON.stringify(data.program[a]));
                      program.schedule = data.program[a].schedule[b];
                      logger.debug(data.program[a].performance.title);
                      if (data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room]) {
                        data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room].program.push(program);
                      } else {
                        delete data.program[a].schedule[b];
                      }
                    } else {
                      var days = Math.floor((data.program[a].schedule[b].endtime-data.program[a].schedule[b].starttime)/(24*60*60*1000))+1;
                      for(let c=0;c<days;c++){
                        let date = new Date((data.program[a].schedule[b].starttime.getTime())+((24*60*60*1000)*c));
                        let d = ('0'+date.getUTCDate()).substr(-2);
                        let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
                        let y = date.getUTCFullYear();
                        let program = JSON.parse(JSON.stringify(data.program[a]));
                        program.schedule = data.program[a].schedule[b];
                        data.program[a].performance.duration = duration/days;
                        logger.debug(data.program[a].schedule[b].venue.room);
                        if (data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room]) {
                          data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room].program.push(program);
                        } else {
                          delete data.program[a].schedule[b];
                        }
                      }
                    }
                  }
                }  
              }
            }
          }
          for(let item in data.programmebydayvenue) {
            for(let room in data.programmebydayvenue[item].rooms) {
              data.programmebydayvenue[item].rooms[room].program.sort((a,b) => (a.schedule.starttime > b.schedule.starttime) ? 1 : ((b.schedule.starttime > a.schedule.starttime) ? -1 : 0));
            }
          }
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            req.query.sez = "program";
            res.render('admindev/events/program', {
              title: 'Events: Program',
              data: data,
              currentUrl: req.originalUrl,
              superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
              get: req.query
            });
          }
        }
      });
    }
  });
});

router.get('/:event/technical-riders', (req, res) => {
  logger.debug('/events/'+req.params.event+'/technical-riders');
  let data = {};
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1, schedule: 1, organizationsettings: 1}).
  populate([{"path": "organizationsettings.call.calls.admitted", "select": "name slug", "model": "Category"}]).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      const select = config.cpanel["events_advanced"].forms["technical-riders"].select;
      const populate = req.query.pure ? [] : config.cpanel["events_advanced"].forms["technical-riders"].populate;
      let query = {"event": req.params.event, status: "5be8708afc39610000000013"};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
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
          //data.status = config.cpanel["events_advanced"].status;
          data.program = program;
/*           data.admitted = [];
          let admittedO = {};
          for(let a=0;a<data.event.organizationsettings.call.calls.length;a++) for(let b=0; b<data.event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[data.event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (data.event.organizationsettings.call.calls[a].admitted[b]);
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);
 */
          data.rooms = [];
          for(let a=0;a<data.event.schedule.length;a++)  if (data.event.schedule[a].venue && data.event.schedule[a].venue.room && data.rooms.indexOf(data.event.schedule[a].venue.room) == -1) data.rooms.push(data.event.schedule[a].venue.room);

          let daysdays = [];
          let schedule = JSON.parse(JSON.stringify(data.event.schedule));
          for(let a=0;a<schedule.length;a++) {
            let dayday = new Date(new Date(schedule[a].starttime).setUTCHours(0)).getTime();
            if (daysdays.indexOf(dayday)===-1) {
              daysdays.push(dayday);
            }
          }
          data.days = daysdays;

          /* data.sortby = [
            {value: 'sortby_perf_name', key: 'sort by perf name'},
            {value: 'sortby_ref_name', key: 'sort by ref name'},
            //{value: 'sortby_person_name', key: 'sort by person name'},
            //{value: 'sortby_arrival_date', key: 'sort by arrival date'},
            {value: '0', key: 'sort by sub date'}
          ]; */
          
          data.programmebydayvenue = {}
          for(let a=0;a<event.schedule.length;a++) {
            let date = new Date(event.schedule[a].starttime);  // dateStr you get from mongodb
            if (date.getUTCHours()<10) date = new Date(event.schedule[a].starttime-(24*60*60*1000));
            let d = ('0'+date.getUTCDate()).substr(-2);
            let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
            let y = date.getUTCFullYear();
            const lang = global.getLocale();
            let newdate = moment(date).format(config.dateFormat[lang].weekdaydaymonthyear);
            if (!data.programmebydayvenue[y+"-"+m+"-"+d]) {
              data.programmebydayvenue[y+"-"+m+"-"+d] = {
                day: y+"-"+m+"-"+d,
                date: newdate,
                rooms: {}
              };
              data.programmebydayvenue[y+"-"+m+"-"+d].rooms[event.schedule[a].venue.room] = {
                schedule: event.schedule[a],
                program: []
              };
            }
            if (!data.programmebydayvenue[y+"-"+m+"-"+d].rooms[event.schedule[a].venue.room]) {
              data.programmebydayvenue[y+"-"+m+"-"+d].rooms[event.schedule[a].venue.room] = {
                schedule: event.schedule[a],
                program: []
              };
            }
          }
          for(let a=0;a<data.program.length;a++) {
            if (data.program[a].performance) {
              var duration = data.program[a].performance.duration;
              if (data.program[a].schedule && data.program[a].schedule.length) {
                for(let b=0;b<data.program[a].schedule.length;b++) {
                  if (data.program[a].schedule[b] && data.program[a].schedule[b].venue && data.program[a].schedule[b].venue.room) {
                    if ((data.program[a].schedule[b].endtime-data.program[a].schedule[b].starttime)/(24*60*60*1000)<1) {
                      let date = new Date(data.program[a].schedule[b].starttime);  // dateStr you get from mongodb
                      if (date.getUTCHours()<10) date = new Date(data.program[a].schedule[b].starttime-(24*60*60*1000));
                      let d = ('0'+date.getUTCDate()).substr(-2);
                      let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
                      let y = date.getUTCFullYear();
                      let program = JSON.parse(JSON.stringify(data.program[a]));
                      program.schedule = data.program[a].schedule[b];
                      data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room].program.push(program);
                    } else {
                      var days = Math.floor((data.program[a].schedule[b].endtime-data.program[a].schedule[b].starttime)/(24*60*60*1000))+1;
                      for(let c=0;c<days;c++){
                        let date = new Date((data.program[a].schedule[b].starttime.getTime())+((24*60*60*1000)*c));
                        let d = ('0'+date.getUTCDate()).substr(-2);
                        let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
                        let y = date.getUTCFullYear();
                        let program = JSON.parse(JSON.stringify(data.program[a]));
                        program.schedule = data.program[a].schedule[b];
                        data.program[a].performance.duration = duration/days;
                        data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room].program.push(program);
                      }
                    }
                  }
                }  
              }
            }
          }
          for(let item in data.programmebydayvenue) {
            for(let room in data.programmebydayvenue[item].rooms) {
              data.programmebydayvenue[item].rooms[room].program.sort((a,b) => (a.schedule.starttime > b.schedule.starttime) ? 1 : ((b.schedule.starttime > a.schedule.starttime) ? -1 : 0));
            }
          }
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            req.query.sez = "technical-riders";
            res.render('admindev/events/technical-riders', {
              title: event.title+': Technical Riders',
              data: data,
              currentUrl: req.originalUrl,
              superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
              get: req.query
            });
          }
        }
      });
    }
  });
});

router.get('/:event/program-print', (req, res) => {
  logger.debug('/events/'+req.params.event+'/program-print');
  let data = {};
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1, schedule: 1, organizationsettings: 1}).
  populate([{"path": "organizationsettings.call.calls.admitted", "select": "name slug", "model": "Category"}]).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      const select = config.cpanel["events_advanced"].forms["program-print"].select;
      const populate = req.query.pure ? [] : config.cpanel["events_advanced"].forms["program-print"].populate;
      let query = {"event": req.params.event, status: "5be8708afc39610000000013"};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
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
          //data.status = config.cpanel["events_advanced"].status;
          data.program = program;
/*           data.admitted = [];
          let admittedO = {};
          for(let a=0;a<data.event.organizationsettings.call.calls.length;a++) for(let b=0; b<data.event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[data.event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (data.event.organizationsettings.call.calls[a].admitted[b]);
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);
 */
          data.rooms = [];
          for(let a=0;a<data.event.schedule.length;a++)  if (data.event.schedule[a].venue && data.event.schedule[a].venue.room && data.rooms.indexOf(data.event.schedule[a].venue.room) == -1) data.rooms.push(data.event.schedule[a].venue.room);

          let daysdays = [];
          let schedule = JSON.parse(JSON.stringify(data.event.schedule));
          for(let a=0;a<schedule.length;a++) {
            let dayday = new Date(new Date(schedule[a].starttime).setUTCHours(0)).getTime();
            if (daysdays.indexOf(dayday)===-1) {
              daysdays.push(dayday);
            }
          }
          data.days = daysdays;

          /* data.sortby = [
            {value: 'sortby_perf_name', key: 'sort by perf name'},
            {value: 'sortby_ref_name', key: 'sort by ref name'},
            //{value: 'sortby_person_name', key: 'sort by person name'},
            //{value: 'sortby_arrival_date', key: 'sort by arrival date'},
            {value: '0', key: 'sort by sub date'}
          ]; */
          
          data.programmebydayvenue = {}
          for(let a=0;a<event.schedule.length;a++) {
            let date = new Date(event.schedule[a].starttime);  // dateStr you get from mongodb
            if (date.getUTCHours()<10) date = new Date(event.schedule[a].starttime-(24*60*60*1000));
            let d = ('0'+date.getUTCDate()).substr(-2);
            let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
            let y = date.getUTCFullYear();
            const lang = global.getLocale();
            let newdate = moment(date).format(config.dateFormat[lang].weekdaydaymonthyear);
            if (!data.programmebydayvenue[y+"-"+m+"-"+d]) {
              data.programmebydayvenue[y+"-"+m+"-"+d] = {
                day: y+"-"+m+"-"+d,
                date: newdate,
                rooms: {}
              };
              data.programmebydayvenue[y+"-"+m+"-"+d].rooms[event.schedule[a].venue.room] = {
                schedule: event.schedule[a],
                program: []
              };
            }
            if (!data.programmebydayvenue[y+"-"+m+"-"+d].rooms[event.schedule[a].venue.room]) {
              data.programmebydayvenue[y+"-"+m+"-"+d].rooms[event.schedule[a].venue.room] = {
                schedule: event.schedule[a],
                program: []
              };
            }
          }
          for(let a=0;a<data.program.length;a++) {
            if (data.program[a].performance) {
              var duration = data.program[a].performance.duration;
              if (data.program[a].schedule && data.program[a].schedule.length) {
                for(let b=0;b<data.program[a].schedule.length;b++) {
                  if (data.program[a].schedule[b] && data.program[a].schedule[b].venue && data.program[a].schedule[b].venue.room) {
                    if ((data.program[a].schedule[b].endtime-data.program[a].schedule[b].starttime)/(24*60*60*1000)<1) {
                      let date = new Date(data.program[a].schedule[b].starttime);  // dateStr you get from mongodb
                      if (date.getUTCHours()<10) date = new Date(data.program[a].schedule[b].starttime-(24*60*60*1000));
                      let d = ('0'+date.getUTCDate()).substr(-2);
                      let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
                      let y = date.getUTCFullYear();
                      let program = JSON.parse(JSON.stringify(data.program[a]));
                      program.schedule = data.program[a].schedule[b];
                      data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room].program.push(program);
                    } else {
                      var days = Math.floor((data.program[a].schedule[b].endtime-data.program[a].schedule[b].starttime)/(24*60*60*1000))+1;
                      for(let c=0;c<days;c++){
                        let date = new Date((data.program[a].schedule[b].starttime.getTime())+((24*60*60*1000)*c));
                        let d = ('0'+date.getUTCDate()).substr(-2);
                        let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
                        let y = date.getUTCFullYear();
                        let program = JSON.parse(JSON.stringify(data.program[a]));
                        program.schedule = data.program[a].schedule[b];
                        data.program[a].performance.duration = duration/days;
                        data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room].program.push(program);
                      }
                    }
                  }
                }  
              }
            }
          }
          for(let item in data.programmebydayvenue) {
            for(let room in data.programmebydayvenue[item].rooms) {
              data.programmebydayvenue[item].rooms[room].program.sort((a,b) => (a.schedule.starttime > b.schedule.starttime) ? 1 : ((b.schedule.starttime > a.schedule.starttime) ? -1 : 0));
            }
          }
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            req.query.sez = "program-print";
            res.render('admindev/events/program-print', {
              title: event.title+': Program',
              data: data,
              currentUrl: req.originalUrl,
              superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
              get: req.query
            });
          }
        }
      });
    }
  });
});

router.get('/:event/pass-sheet', (req, res) => {
  logger.debug('/events/'+req.params.event+'/pass-sheet');
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
      const select = config.cpanel["events_advanced"].forms["pass-sheet"].select;
      const populate = req.query.pure ? [] : config.cpanel["events_advanced"].forms["pass-sheet"].populate;
      let query = {"event": req.params.event, status: '5be8708afc39610000000013'};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['packages.option_selected_hotel'] && req.query['packages.option_selected_hotel']!='0') {
        query['packages.options_name'] = 'hotels';
        query['packages.option'] = req.query['packages.option_selected_hotel'];
      }
      if (req.query['status'] && req.query['status']!='0') query['status'] = req.query['status'];
      for(var item in populate) {
        if (populate[item].path == "performance") {
          if (req.query['performance_category'] && req.query['performance_category']!='0') {
            populate[item].match = {type: req.query['performance_category']};
          }
          if (req.query['bookings.schedule.venue.room'] && req.query['bookings.schedule.venue.room']!='0') {
            populate[item].match = {'bookings.schedule.venue.room': req.query['bookings.schedule.venue.room']};
          }
        }
      }
      logger.debug(query);
      Program.
      find(query).
      select(select).
      populate(populate).
      exec((err, program) => {
        logger.debug(program);
        if (err) {
          res.json(err);
        } else {
          data.event = event;
          //data.status = config.cpanel["events_advanced"].status;
          let daysdays = [];
          let schedule = JSON.parse(JSON.stringify(data.event.schedule));
          for(let a=0;a<schedule.length;a++) {
            let dayday = new Date(new Date(schedule[a].starttime).setUTCHours(0)).getTime();
            if (daysdays.indexOf(dayday)===-1) {
              daysdays.push(dayday);
            }
          }
          data.days = daysdays.sort(function(a, b) {
            a = new Date(a);
            b = new Date(b);
            return a<b ? -1 : a>b ? 1 : 0;
          });
          //data.days.unshift(data.days[0]-(24*60*60*1000));
          //data.days.push(data.days[data.days.length-1]+(24*60*60*1000));
          data.daysN = ((data.days[data.days.length-1]-data.days[0])/(24*60*60*1000))-1;

          
          /* data.hotels = [];
          for(let a=0;a<data.event.organizationsettings.call.calls.length;a++)
            for(let b=0; b<data.event.organizationsettings.call.calls[a].packages.length;b++)
              if (data.event.organizationsettings.call.calls[a].packages[b].options_name == "Hotels")
                data.hotels = data.event.organizationsettings.call.calls[a].packages[b].options.split(",");
           */
          data.subscriptions = [];
          for(let a=0;a<program.length;a++) {
            for(let b=0; b<program[a].subscriptions.length;b++) {
              if (!program[a].subscriptions[b].freezed) {
                let subscription = JSON.parse(JSON.stringify(program[a]));
                subscription.performance.schedule = subscription.schedule;
                subscription.performances = [subscription.performance];
                subscription.subscription = subscription.subscriptions[b];
                delete subscription.subscriptions;
                delete subscription.schedule;
                delete subscription.performance;
                data.subscriptions.push(subscription);
              }
            }
          }
          for(let a=0;a<program.length;a++) {
            for(let b=0; b<program[a].subscriptions.length;b++) {
              if (program[a].subscriptions[b].freezed) {
                let subscriber_id_map = data.subscriptions.map(subscriber => {return subscriber.subscription.subscriber_id._id.toString()});
                let subscriber_id_index = subscriber_id_map.indexOf(program[a].subscriptions[b].subscriber_id._id.toString());
                let subscription = JSON.parse(JSON.stringify(program[a]));
                subscription.performance.schedule = subscription.schedule;
                if (subscriber_id_index!=-1) {
                  data.subscriptions[subscriber_id_index].performances.push(subscription.performance);
                } else {
                  subscription.performances = [subscription.performance];
                  subscription.subscription = subscription.subscriptions[b];
                  delete subscription.subscriptions;
                  delete subscription.schedule;
                  delete subscription.performance;
                  data.subscriptions.push(subscription);
                  }
              }
            }
          }
          data.subscriptions = data.subscriptions.sort((a,b) => ((a.subscription.subscriber_id.stagename) > (b.subscription.subscriber_id.stagename)) ? 1 : (((b.subscription.subscriber_id.stagename) > (a.subscription.subscriber_id.stagename)) ? -1 : 0));
          
          data.sortby = [
          ];
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            req.query.sez = "pass-sheet";
            res.render('admindev/events/pass-sheet', {
              title: 'Events: Pass sheet',
              data: data,
              currentUrl: req.originalUrl,
              superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
              get: req.query
            });
          }
        }
      });
    }
  });
});

router.get('/:event/pass', (req, res) => {
  logger.debug('/events/'+req.params.event+'/pass');
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
      const select = config.cpanel["events_advanced"].forms["pass"].select;
      const populate = req.query.pure ? [] : config.cpanel["events_advanced"].forms["pass"].populate;
      let query = {"event": req.params.event, status: '5be8708afc39610000000013'};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['packages.option_selected_hotel'] && req.query['packages.option_selected_hotel']!='0') {
        query['packages.options_name'] = 'hotels';
        query['packages.option'] = req.query['packages.option_selected_hotel'];
      }
      if (req.query['status'] && req.query['status']!='0') query['status'] = req.query['status'];
      for(var item in populate) {
        if (populate[item].path == "performance") {
          if (req.query['performance_category'] && req.query['performance_category']!='0') {
            populate[item].match = {type: req.query['performance_category']};
          }
          if (req.query['bookings.schedule.venue.room'] && req.query['bookings.schedule.venue.room']!='0') {
            populate[item].match = {'bookings.schedule.venue.room': req.query['bookings.schedule.venue.room']};
          }
        }
      }
      logger.debug(query);
      Program.
      find(query).
      select(select).
      populate(populate).
      exec((err, program) => {
        logger.debug(program);
        if (err) {
          res.json(err);
        } else {
          data.event = event;
          //data.status = config.cpanel["events_advanced"].status;
          let daysdays = [];
          let schedule = JSON.parse(JSON.stringify(data.event.schedule));
          for(let a=0;a<schedule.length;a++) {
            let dayday = new Date(new Date(schedule[a].starttime).setUTCHours(0)).getTime();
            if (daysdays.indexOf(dayday)===-1) {
              daysdays.push(dayday);
            }
          }
          data.days = daysdays.sort(function(a, b) {
            a = new Date(a);
            b = new Date(b);
            return a<b ? -1 : a>b ? 1 : 0;
          });
          //data.days.unshift(data.days[0]-(24*60*60*1000));
          //data.days.push(data.days[data.days.length-1]+(24*60*60*1000));
          data.daysN = ((data.days[data.days.length-1]-data.days[0])/(24*60*60*1000))-1;

          
          /* data.hotels = [];
          for(let a=0;a<data.event.organizationsettings.call.calls.length;a++)
            for(let b=0; b<data.event.organizationsettings.call.calls[a].packages.length;b++)
              if (data.event.organizationsettings.call.calls[a].packages[b].options_name == "Hotels")
                data.hotels = data.event.organizationsettings.call.calls[a].packages[b].options.split(",");
           */
          data.subscriptions = [];
          for(let a=0;a<program.length;a++) {
            for(let b=0; b<program[a].subscriptions.length;b++) {
              if (!program[a].subscriptions[b].freezed) {
                let subscription = JSON.parse(JSON.stringify(program[a]));
                subscription.performances = [subscription.performance];
                subscription.subscription = subscription.subscriptions[b];
                delete subscription.subscriptions;
                delete subscription.schedule;
                delete subscription.performance;
                data.subscriptions.push(subscription);
              }
            }
          }
          for(let a=0;a<program.length;a++) {
            for(let b=0; b<program[a].subscriptions.length;b++) {
              if (program[a].subscriptions[b].freezed) {
                let subscriber_id_map = data.subscriptions.map(subscriber => {return subscriber.subscription.subscriber_id._id.toString()});
                let subscriber_id_index = subscriber_id_map.indexOf(program[a].subscriptions[b].subscriber_id._id.toString());
                let subscription = JSON.parse(JSON.stringify(program[a]));
                if (subscriber_id_index!=-1) {
                  data.subscriptions[subscriber_id_index].performances.push(subscription.performance);
                } else {
                  subscription.performances = [subscription.performance];
                  subscription.subscription = subscription.subscriptions[b];
                  delete subscription.subscriptions;
                  delete subscription.schedule;
                  delete subscription.performance;
                  data.subscriptions.push(subscription);
                  }
              }
            }
          }
          data.subscriptions = data.subscriptions.sort((a,b) => ((a.subscription.subscriber_id.stagename) > (b.subscription.subscriber_id.stagename)) ? 1 : (((b.subscription.subscriber_id.stagename) > (a.subscription.subscriber_id.stagename)) ? -1 : 0));
          
          data.sortby = [
          ];
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            req.query.sez = "pass";
            res.render('admindev/events/pass', {
              title: 'Events: Pass List',
              data: data,
              currentUrl: req.originalUrl,
              superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
              get: req.query
            });
          }
        }
      });
    }
  });
});

module.exports = router;