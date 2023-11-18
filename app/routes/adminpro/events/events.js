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
const Order = mongoose.model('Order');
const Emailqueue = mongoose.model('Emailqueue');

const fs = require('fs');
const config = require('getconfig');
const sharp = require('sharp');
const moment = require('moment');

const logger = require('../../../utilities/logger');

// HOME 
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
      res.render('adminpro/events/home', {
        title: 'Events',
        currentUrl: req.originalUrl,
        
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
      res.render('adminpro/events/dett', {
        title: 'Events | '+data.event.title,
        currentUrl: req.originalUrl,
        
        data: data,
        script: false
      });
    }
  });
});

router.get('/:event/orders', (req, res) => {
  logger.debug('/events/'+req.params.event+'/orders');
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
      let query = {"event": req.params.event};
      logger.debug(query)
      Order.
      find(query).
      /* select(select).
      populate(populate). */
      exec((err, orders) => {
        if (err) {
          res.json(err);
        } else {
          data.event = event;
          data.orders = orders;
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            req.query.sez = "acts";
            res.render('adminpro/events/orders', {
              title: 'Events | '+data.event.title + ': Orders',
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

  router.get('/:event/program-social', (req, res) => {
    router.getActsData(req, res, data => {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        req.query.sez = "acts";
        res.render('adminpro/events/program-social', {
          title: 'Events | '+data.event.title + ': '+__('Program Socials'),
          data: data,
          currentUrl: req.originalUrl,
          
          get: req.query
        });
      }
    });
  });  
  
  router.get('/:event/program-print', (req, res) => {
    router.getPrintData(req, res, data => {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        req.query.sez = "acts";
        res.render('adminpro/events/program-print', {
          title: 'Events | '+data.title + ': '+__('Program Prints'),
          data: data,
          currentUrl: req.originalUrl,
          
          get: req.query
        });
      }
    });
  });  
  
  router.get('/:event/program-print-siae', (req, res) => {
    router.getActsData(req, res, data => {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        req.query.sez = "acts";
        res.render('adminpro/events/program-print-siae', {
          title: 'Events | '+data.event.title + ': '+__('Program Prints Siae'),
          data: data,
          currentUrl: req.originalUrl,
          
          get: req.query
        });
      }
    });
  });  
  
  router.get('/:event/program-print-comune', (req, res) => {
    router.getActsData(req, res, data => {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        req.query.sez = "acts";
        res.render('adminpro/events/program-print-comune', {
          title: 'Events | '+data.event.title + ': '+__('Program Prints Comune'),
          data: data,
          currentUrl: req.originalUrl,
          
          get: req.query
        });
      }
    });
  });  
  /* router.get('/:event/program-social', (req, res) => {
    logger.debug('/events/'+req.params.event+'/program-print');
    let data = {};
    Event.
    findOne({"_id": req.params.event}).
    select({title: 1, schedule: 1, organizationsettings: 1, web: 1}).
    populate([{"path": "organizationsettings.call.calls.admitted", "select": "name slug", "model": "Category"}]).
    exec((err, event) => {
      if (err) {
        res.json(err);
      } else {
        const select = config.cpanel["events_advanced"].forms["program-social"].select;
        const populate = req.query.pure ? [] : config.cpanel["events_advanced"].forms["program-social"].populate;
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
              req.query.sez = "program-social";
              res.render('adminpro/events/program-social', {
                title: event.title+': Program',
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
  
 */  
router.get('/:event/acts', (req, res) => {
  router.getActsData(req, res, data => {
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      req.query.sez = "acts";
      res.render('adminpro/events/acts', {
        title: 'Events | '+data.event.title + ': Acts',
        data: data,
        currentUrl: req.originalUrl,
        
        get: req.query
      });
    }
  });
});  
router.get('/:event/acts/message', (req, res) => {
  logger.debug('/events/'+req.params.event+'/acts/message');
  router.getMessageActs(req, res);
});

router.post('/:event/acts/message', (req, res) => {
  logger.debug('/events/'+req.params.event+'/acts');
  router.getMessageActs(req, res);
});

router.getActsData = (req, res, cb) => {
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
      logger.debug("pre-populate");
      const native_populate = JSON.parse(JSON.stringify(config.cpanel["events_advanced"].forms["acts"].populate));
      logger.debug(native_populate);
      const select = config.cpanel["events_advanced"].forms["acts"].select;
      let populate = req.query.pure ? [] : native_populate;
      let query = {"event": req.params.event};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['status'] && req.query['status']!='0') query['status'] = req.query['program.schedule.statusNOT'] ? {$ne :req.query['status']} : req.query['status'];
      if (req.query['subscriptions.packages.name'] && req.query['subscriptions.packages.name']!='0') query['subscriptions.packages.name'] = req.query['notaccommodation'] ? {$ne :req.query['subscriptions.packages.name']} : req.query['subscriptions.packages.name'];
      if (req.query['packages.option_selected_hotel'] && req.query['packages.option_selected_hotel']!='0') {
        //query['subscriptions.packages.options_name'] = 'Hotels';
        query['subscriptions.packages.option'] = req.query['packages.option_selected_hotel'];
      }
      for(var item in populate) {
        if (populate[item].path == "performance") {
          if (req.query['performance_category'] && req.query['performance_category']!='0') {
            populate[item].match = {type: req.query['not2'] ? {$ne :req.query['performance_category']} : req.query['performance_category']};
          }
          if (req.query['bookings.schedule.venue.room'] && req.query['bookings.schedule.venue.room']!='0') {
            populate[item].match = {'bookings.schedule.venue.room': req.query['bookings.schedule.venue.room']};
          }
        }
      }
      logger.debug("populate")
      logger.debug(populate)
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

          data.hotels = [];
          for(let a=0;a<data.event.organizationsettings.call.calls.length;a++)
            for(let b=0; b<data.event.organizationsettings.call.calls[a].packages.length;b++)
              if (data.event.organizationsettings.call.calls[a].packages[b].options_name == "Hotels")
                data.hotels = data.event.organizationsettings.call.calls[a].packages[b].options.split(",");

          data.rooms = [];
          for(let a=0;a<data.event.schedule.length;a++)  if (data.event.schedule[a].venue && data.event.schedule[a].venue.room && data.rooms.indexOf(data.event.schedule[a].venue.room) == -1) data.rooms.push(data.event.schedule[a].venue.room);
          data.sortby = [
            {value: 'sortby_perf_name', key: 'sort by perf name'},
            {value: 'sortby_ref_name', key: 'sort by ref name'},
            //{value: 'sortby_person_name', key: 'sort by person name'},
            //{value: 'sortby_arrival_date', key: 'sort by arrival date'},
            {value: '0', key: 'sort by sub date'}
          ];
          if (req.query['missing_img'] && req.query['missing_img']!='0') {
            //data.program = data.program.filter(item => {return item.performance.imageFormats.small == 'https://avnode.net/images/default-item.svg'})
            data.program = data.program.filter(item => {
              return item.performance.users.map(item => {return item.imageFormats.small}).indexOf('https://avnode.net/images/default-user.svg')!==-1 || item.performance.imageFormats.small == 'https://avnode.net/images/default-item.svg';
            });
          }
          if (req.query['missing_text'] && req.query['missing_text']!='0') {
            //data.program = data.program.filter(item => {return item.performance.imageFormats.small == 'https://avnode.net/images/default-item.svg'})
            data.program = data.program.filter(item => {
              return item.performance.users.map(item => {console.log(item.about);return !item.about || item.about=="Text is missing"  ? "0" : "1"}).indexOf('0')!==-1 || item.performance.about == 'Text is missing';
            });
          }
          cb(data);
        }
      });
    }
   });
};

router.getPrintData = (req, res, cb) => {
  logger.debug('/events/'+req.params.event+'/getPrintData');
  logger.debug(req.query)
  let data = {};
  Event.
  findOne({"_id": req.params.event}).
  select({
    "title": 1,
    "subtitles": 1,
    "abouts": 1,
    "slug": 1,
    "is_freezed": 1,
    "program_freezed": 1,
    "stats": 1,
    "web": 1,
    "social": 1,
    "emails": 1,
    "image": 1,
    "schedule": 1,
    "program": 1,
    "videos": 1,
    "galleries": 1,
    "type": 1,
    "organizationsettings": 1,
    "partners": 1
  }).
  populate([
    {
    "path": "program.performance",
    "select": {
      "title": 1,
      "stats": 1,
      "users": 1,
      "type": 1,
      "image": 1,
      "duration": 1,
      "tech_arts": 1,
      "tech_reqs": 1,
      "paypal": 1,
      "price": 1,
      "slug": 1
    },
    "model": "Performance",
    "populate": [{
      "path": "users",
      "select": {
        "slug": 1,
        "image": 1,
        "organizationData.logo": 1,
        "members": 1,
        "addresses.country": 1,
        "addresses.locality": 1,
        "stats": 1,
        "social": 1,
        "stagename": 1
      },
      "model": "UserShow"
    }, {
      "path": "type",
      "select": {
        "name": 1,
        "slug": 1
      },
      "model": "Category"
    }]
  }, {
    "path": "program.schedule.categories",
    "select": {
      "name": 1
    },
    "model": "Category"
  }, {
    "path": "program.schedule.status",
    "select": {
      "name": 1
    },
    "model": "Category"
  }, {
    "path": "type",
    "select": {
      "name": 1
    },
    "model": "Category"
  }]).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      logger.debug(event);
      cb(event);

/*       logger.debug("pre-populate");
      const native_populate = JSON.parse(JSON.stringify(config.cpanel["events_advanced"].forms["acts"].populate));
      logger.debug(native_populate);
      const select = config.cpanel["events_advanced"].forms["acts"].select;
      let populate = req.query.pure ? [] : native_populate;
      let query = {"event": req.params.event};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['status'] && req.query['status']!='0') query['status'] = req.query['program.schedule.statusNOT'] ? {$ne :req.query['status']} : req.query['status'];
      if (req.query['subscriptions.packages.name'] && req.query['subscriptions.packages.name']!='0') query['subscriptions.packages.name'] = req.query['notaccommodation'] ? {$ne :req.query['subscriptions.packages.name']} : req.query['subscriptions.packages.name'];
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
      logger.debug("populate")
      logger.debug(populate)
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
          if (req.query['missing_img'] && req.query['missing_img']!='0') {
            //data.program = data.program.filter(item => {return item.performance.imageFormats.small == 'https://avnode.net/images/default-item.svg'})
            data.program = data.program.filter(item => {
              return item.performance.users.map(item => {return item.imageFormats.small}).indexOf('https://avnode.net/images/default-user.svg')!==-1 || item.performance.imageFormats.small == 'https://avnode.net/images/default-item.svg';
            });
          }
          if (req.query['missing_text'] && req.query['missing_text']!='0') {
            //data.program = data.program.filter(item => {return item.performance.imageFormats.small == 'https://avnode.net/images/default-item.svg'})
            data.program = data.program.filter(item => {
              return item.performance.users.map(item => {console.log(item.about);return !item.about || item.about=="Text is missing"  ? "0" : "1"}).indexOf('0')!==-1 || item.performance.about == 'Text is missing';
            });
          }
          cb(event);
        }
      }); */
    }
   });
};

router.getMessageActs = (req, res) => {
  router.getActsData(req, res, data => {
    req.query.sez = "acts";
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      //logger.debug(query);
      logger.debug("req.body");
      logger.debug(req.body);
      if (req.body.subject) {
        var tosave = {};
        if (!req.body.exclude) req.body.exclude = []
        tosave.event = req.params.event;
        tosave.user = req.user._id;
        tosave.subject = req.body.subject;
        tosave.messages_tosend = [];
        tosave.messages_sent = [];
        data.program.forEach((item, index) => {
          if (req.body.exclude.indexOf(item._id)===-1) {
            var message = {};
            message.to_html = "";
            message.cc_html = [];
            message.from_name = req.body.from_name;
            message.from_email = req.body.from_email;
            message.user_email = req.body.user_email;
            message.user_password = req.body.user_password;
            message.subject = req.body.subject.split("[org_name]").join(item.performance.title);;
            if (item.subscriptions) {
              item.subscriptions.forEach((subscription, cindex) => {
                var contact = subscription.subscriber_id;
                if (contact) {
                  if (cindex===0) {
                    message.to_html = (contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">"
                    message.text = req.body["message_"+(contact.lang=="it" ? "it" : "en")]
                    message.text = message.text.split("[email]").join(contact.email);
                    message.text = message.text.split("[name]").join(contact.name);
                    message.text = message.text.split("[slug]").join(contact.slug);
                    message.text = message.text.split("[performancetitle]").join(item.performance.title);
                    message.text = message.text.split("[performanceslug]").join(item.performance.slug);
                  } else {
                    message.cc_html.push((contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">")
                  }
                }
              });
            }
            if (message.to_html != "") tosave.messages_tosend.push(message)
  
          }
        });
        if (req.body.send == "1") {
          logger.debug(tosave);
          Emailqueue.create(tosave, function (err) {
            res.redirect("/adminpro/emailqueue/")
          });
        } else {
          res.render('adminpro/events/message', {
            title: 'Events | '+data.event.title + ': Acts message',
            data: data,
            tosave: tosave,
            currentUrl: req.originalUrl,
            body: req.body,
            get: req.query
          });
        }
      } else {
        res.render('adminpro/events/message', {
          title: 'Events | '+data.event.title + ': Acts message',
          data: data,
          currentUrl: req.originalUrl,
          body: req.body,
          get: req.query
        });
      }
    }
  });
};

router.get('/:event/peoples/message', (req, res) => {
  logger.debug('/events/'+req.params.event+'/acts/message');
  router.getMessagePeoples(req, res);
});

router.post('/:event/peoples/message', (req, res) => {
  logger.debug('/events/'+req.params.event+'/acts');
  router.getMessagePeoples(req, res);
});

router.get('/:event/peoples', (req, res) => {
  logger.debug('/events/'+req.params.event+'/peoples');
  router.getPeoplesData(req, res, data => {
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      req.query.sez = "peoples";
      res.render('adminpro/events/peoples', {
        title: 'Events | '+data.event.title + ': Peoples',
        data: data,
        currentUrl: req.originalUrl,
        
        get: req.query
      });
    }
  });
});

router.getPeoplesData = (req, res, cb) => {
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
      if (req.query['status'] && req.query['status']!='0') query['status'] = req.query['program.schedule.statusNOT'] ? {$ne :req.query['status']} : req.query['status'];
      if (req.query['subscriptions.packages.name'] && req.query['subscriptions.packages.name']!='0') query['subscriptions.packages.name'] = req.query['notaccommodation'] ? {$ne :req.query['subscriptions.packages.name']} : req.query['subscriptions.packages.name'];

      if (req.query['packages.option_selected_hotel'] && req.query['packages.option_selected_hotel']!='0') {
        //query['subscriptions.packages.options_name'] = 'Hotels';
        query['subscriptions.packages.option'] = req.query['packages.option_selected_hotel'];
      }
      for(var item in populate) {
        if (populate[item].path == "performance") {
          if (req.query['performance_category'] && req.query['performance_category']!='0') {
            populate[item].match = {type: req.query['not2'] ? {$ne :req.query['performance_category']} : req.query['performance_category']};
          }
          if (req.query['bookings.schedule.venue.room'] && req.query['bookings.schedule.venue.room']!='0') {
            populate[item].match = {'bookings.schedule.venue.room': req.query['bookings.schedule.venue.room']};
          }
        }
      }
      logger.debug("query");
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
              if (!program[a].subscriptions[b].freezed && program[a].subscriptions[b].subscriber_id && program[a].subscriptions[b].subscriber_id._id) {
                let subscription = JSON.parse(JSON.stringify(program[a]));
                delete subscription.subscriptions;
                delete subscription.performance;
                subscription.performances = [program[a].performance];
                subscription.subscription = program[a].subscriptions[b];
                data.subscriptions.push(subscription);
              } else  if (!program[a].subscriptions[b].freezed) {
                logger.debug(program[a].subscriptions[b])
              }
            }
          }
          logger.debug(data.subscriptions.length);
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
                if (program.subscription.packages[a].name.indexOf("Accommodation") !== -1) {
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
          cb(data)
        }
      });
    }
  });
};

router.getMessagePeoples = (req, res) => {
  router.getPeoplesData(req, res, data => {
    console.log(data)
    req.query.sez = "peoples";
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      //logger.debug(query);
      logger.debug("req.body");
      logger.debug(req.body);
      if (req.body.subject) {
        var tosave = {};
        if (!req.body.exclude) req.body.exclude = []
        tosave.event = req.params.event;
        tosave.user = req.user._id;
        tosave.subject = req.body.subject;
        tosave.messages_tosend = [];
        tosave.messages_sent = [];
        data.subscriptions.forEach((item, index) => {
          console.log(req.body.exclude)
          console.log(item.subscription.subscriber_id._id.toString())
          if (req.body.exclude.indexOf(item.subscription.subscriber_id._id.toString())===-1) {
            var message = {};
            message.to_html = "";
            message.cc_html = [];
            message.from_name = req.body.from_name;
            message.from_email = req.body.from_email;
            message.user_email = req.body.user_email;
            message.user_password = req.body.user_password;
            var contact = item.subscription.subscriber_id;
            message.subject = req.body.subject.split("[org_name]").join(contact.stagename);
            message.to_html = (contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">"
            if (item.subscription.subscriber_id.email !== item.reference.email ) {
              message.cc_html.push((item.reference.name ? item.reference.name+" " : "")+(item.reference.surname ? item.reference.surname+" " : "")+"<"+item.reference.email+">")
            }
            message.text = req.body["message_"+(contact.lang=="it" ? "it" : "en")]
            message.text = message.text.split("[email]").join(contact.email);
            message.text = message.text.split("[name]").join(contact.name);
            //message.text = message.text.split("[slug]").join(contact.slug);
            //message.text = message.text.split("[performancetitle]").join(item.performance.title);
            //message.text = message.text.split("[performanceslug]").join(item.performance.slug);
            if (message.to_html != "") tosave.messages_tosend.push(message)  
          }
        });
        if (req.body.send == "1") {
          logger.debug(tosave);
          Emailqueue.create(tosave, function (err) {
            res.redirect("/adminpro/emailqueue/")
          });
        } else {
          res.render('adminpro/events/peoples_message', {
            title: 'Events | '+data.event.title + ': Peoples message',
            data: data,
            tosave: tosave,
            currentUrl: req.originalUrl,
            body: req.body,
            get: req.query
          });
        }
      } else {
        res.render('adminpro/events/peoples_message', {
          title: 'Events | '+data.event.title + ': Peoples message',
          data: data,
          currentUrl: req.originalUrl,
          body: req.body,
          get: req.query
        });
      }
    }
  });
};


router.get('/:event/program', (req, res) => {
  logger.debug('/events/'+req.params.event+'/program');
  logger.debug(req.query);
  let data = {};
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1, schedule: 1, organizationsettings: 1}).
  populate([{"path": "organizationsettings.call.calls.admitted", "select": "name slug", "model": "Category"}]).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      event.schedule.sort((a,b) => {
        return new Date(a.starttime) - new Date(b.starttime);
      });
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
            let endday = new Date(new Date(schedule[a].endtime).setUTCHours(0)).getTime();
            console.log("stocazzo")
            console.log(endday)
            while (dayday<endday) {
              console.log(dayday)
              if (daysdays.indexOf(dayday)===-1) {
                daysdays.push(dayday);
              }                           
              dayday+=24*60*60*1000;
            }
          }
          console.log(daysdays)
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
                  var delSchedule = false;
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
                      logger.debug(data.program[a].performance._id);
                      if (data.programmebydayvenue[y+"-"+m+"-"+d] && data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room]) {
                        data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room].program.push(program);
                      } else {
                        logger.debug("------------------------------------------------------------");

                        //delete data.program[a].schedule[b];
                      }
                    } else {
                      var days = Math.floor((data.program[a].schedule[b].endtime-data.program[a].schedule[b].starttime)/(24*60*60*1000))+1;
                      logger.debug("stocazzo");
                      logger.debug(data.program[a].performance._id);
                      logger.debug(data.program[a].performance.title);
                      logger.debug(data.program[a].schedule.length);
                      logger.debug(days);
                      logger.debug(a);
                      logger.debug(b);
                      for(let c=0;c<days;c++){
                        let date = new Date((data.program[a].schedule[b].starttime.getTime())+((24*60*60*1000)*c));
                        let d = ('0'+date.getUTCDate()).substr(-2);
                        let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
                        let y = date.getUTCFullYear();
                        let program = JSON.parse(JSON.stringify(data.program[a]));
                        program.schedule = data.program[a].schedule[b];
                        data.program[a].performance.duration = duration/days;
                        logger.debug(data.program[a].schedule[b].venue.room);
                        logger.debug(data.program[a].schedule[b].starttime);
                        if (data.programmebydayvenue[y+"-"+m+"-"+d] && data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room]) {
                          data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room].program.push(program);
                        } else {
                          logger.debug("------------------------------------------------------------");
                          //delSchedule = true;
                        }
                      }
                      logger.debug("stocazzo end");
                    }
                  }
                  if (delSchedule) delete data.program[a].schedule[b];
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
            res.render('adminpro/events/program', {
              title: 'Events | '+data.event.title + ': Program',
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
      for(var item in populate) {
        if (populate[item].path == "performance") {
          if (req.query['bookings.schedule.venue.room'] && req.query['bookings.schedule.venue.room'].length) {
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
                        if (data.programmebydayvenue[y+"-"+m+"-"+d] && data.programmebydayvenue[y+"-"+m+"-"+d].rooms[data.program[a].schedule[b].venue.room].program)  
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
            res.render('adminpro/events/technical-riders', {
              title: event.title+': Technical Riders',
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

/* router.get('/:event/program-print', (req, res) => {
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
      for(var item in populate) {
        if (populate[item].path == "performance") {
          if (req.query['bookings.schedule.venue.room'] && req.query['bookings.schedule.venue.room'].length) {
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
          //data.status = config.cpanel["events_advanced"].status;
          data.program = program;
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
            res.render('adminpro/events/program-print', {
              title: event.title+': Program',
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

 */
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
          if (req.query['bookings.schedule.venue.room'] && req.query['bookings.schedule.venue.room'].length) {
            populate[item].match = {'bookings.schedule.venue.room': req.query['bookings.schedule.venue.room']};
          }
        }
      }
      logger.debug(populate);
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
            res.render('adminpro/events/pass-sheet', {
              title: 'Events | '+data.event.title + ': Pass sheet',
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
            res.render('adminpro/events/pass', {
              title: 'Events | '+data.event.title + ': Pass List',
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