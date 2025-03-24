import createRouter from "../../router.js";
const router = createRouter();
import config  from 'getconfig';
import helpers from './helpers.js';

import mongoose from 'mongoose';
const Models = {
  'Category': mongoose.model('Category'),
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'EventShow': mongoose.model('EventShow'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Video': mongoose.model('Video'),
  'VenueDB': mongoose.model('VenueDB'),
  'AddressDB': mongoose.model('AddressDB'),
  'Program': mongoose.model('Program'),
  'Emailqueue': mongoose.model('Emailqueue')
}
import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';
import pkg from 'i18n';
const { __ } = pkg;
import { v4 as uuidv4 } from 'uuid';

const setIdentifier = () => {
  return uuidv4();
};

const partners_categories = [
  {
    "_id" : ("5be8708afc396100000001e8"),
    "name" : "CO-ORGANIZER"
  },
  {
    "_id" : ("5be8708afc396100000000fe"),
    "name" : "SUPPORTED BY"
  },
  {
    "_id" : ("5be8708afc3961000000026c"),
    "name" : "IN COLLABORATION"
  },
  {
    "_id" : ("5be8708afc3961000000005e"),
    "name" : "FRIENDS / CONTENTS"
  },
  {
    "_id" : ("5be8708afc3961000000007a"),
    "name" : "TECHNICAL PARTNERS"
  },
  {
    "_id" : ("5be8708afc3961000000007b"),
    "name" : "LPM NETWORK"
  },
  {
    "_id" : ("5be8708afc396100000000e0"),
    "name" : "TOP MEDIA PARTNERS"
  },
  {
    "_id" : ("5be8708afc39610000000165"),
    "name" : "MEDIA PARTNERS"
  },
  {
    "_id" : ("5be8708afc396100000000e1"),
    "name" : "APPROVED BY"
  },
  {
    "_id" : ("5be8708afc39610000000164"),
    "name" : "ISTITUZIONI"
  },
  {
    "_id" : ("5be8708afc396100000000e2"),
    "name" : "NETWORK EVENTS"
  },
  {
    "_id" : ("63cd0ef5803a8b74799d1d7c"),
    "name" : "SCHOOLS"
  },
  {
    "_id" : ("5be8708afc396100000001eb"),
    "name" : "VENUE"
  }
];

router.getDuplicate = (req, res) => {
  logger.info("getDuplicate");
  logger.info(req.params);
  logger.info(req.query);
  // http://localhost:8006/admin/api/events/5c41c8a06b32ec637f343e1a/duplicate?title=bella&slug=bella&exclude=partners,schedule,call,program,galleries,videos
  if (config.cpanel[req.params.sez] && req.params.id) {
    if (req.query.title && req.query.slug) {
      let newrec = new Models[config.cpanel[req.params.sez].model](req.query);
      newrec.save(function (err) {
        if (!err) {
          const id = req.params.id;
          Models[config.cpanel[req.params.sez].model]
          .findById(id)
          .lean()
          .exec(async (err, data) => {
            if (err) {
              res.status(404).send({ message: `${JSON.stringify(err)}` });
            } else {
              if (!data) {
                res.status(404).send({ message: `DOC_NOT_FOUND` });
              } else {
                let exclude = req.query.exclude ? req.query.exclude.split(",") : [];
                // Events
                newrec.users = data.users;
                newrec.subtitles = data.subtitles;
                newrec.abouts = data.abouts;
                newrec.social = data.social;
                newrec.emails = data.emails;
                newrec.web = data.web;
                newrec.type = data.type;
                newrec.categories = data.categories;
                if (exclude.indexOf("partners")===-1) newrec.partners = data.partners;
                if (exclude.indexOf("schedule")===-1) newrec.schedule = data.schedule;
                if (exclude.indexOf("call")===-1) newrec.organizationsettings = data.organizationsettings;
                if (exclude.indexOf("videos")===-1) newrec.videos = data.videos;
                if (exclude.indexOf("galleries")===-1) newrec.galleries = data.galleries;
                // TODO
                //if (exclude.indexOf("program")===-1) newrec.program = data.program;
                //newrec = Object.assign(newrec, data);
                
                newrec.save(async function (err) {
                  if (!err) {
                    let results = {};
                    results.User = await Models["User"].updateMany( {_id: { $in: newrec.users}}, { $push: {events: [newrec._id] } });                      
                    if (exclude.indexOf("partners")===-1) {
                      let partners = [];
                      newrec.partners.forEach(function (item) {
                        partners = partners.concat(item.users);
                      });
                      logger.info(partners);
                      results.User = await Models["User"].updateMany( {_id: { $in: partners}}, { $push: {partnerships: [newrec._id] } });                      
                    }
                    if (exclude.indexOf("videos")===-1) {
                      results.Videos = await Models["Video"].updateMany( {_id: { $in: newrec.videos}}, { $push: {events: [newrec._id] } });                      
                    }
                    if (exclude.indexOf("videos")===-1) {
                      results.Videos = await Models["Gallery"].updateMany( {_id: { $in: newrec.galleries}}, { $push: {events: [newrec._id] } });                      
                    }
                    res.json(newrec);
                  } else {
                    res.json(err);
                  }
                });
                /* if (req.query.delete!="1") {
                  res.json(data);
                } else {
                  logger.info("getDelete 2");
                  let results = {};
                  switch (req.params.sez) {
                    case "galleries" :
                      results.Galleries = await Models[config.cpanel[req.params.sez].model].deleteOne( {_id: data._id});
                      results.Performance = await Models["Performance"].updateMany( {_id: { $in: data.performances}}, { $pullAll: {galleries: [data._id] } });
                      results.Event = await Models["Event"].updateMany( {_id: { $in: data.events}}, { $pullAll: {galleries: [data._id] } });
                      results.User = await Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {galleries: [data._id] } });
                      var promises = [];
                      promises.push(helpers.setStatsAndActivity({_id: { $in: data.users}}));
                      Promise.all(
                        promises
                      ).then( (resultsPromise) => {
                        results.setStatsAndActivity = resultsPromise;
                        res.json(results);
                    });
                    break;
                    case "videos" :
                      results.Videos = await Models[config.cpanel[req.params.sez].model].deleteOne( {_id: data._id});
                      results.Performance = await Models["Performance"].updateMany( {_id: { $in: data.performances}}, { $pullAll: {videos: [data._id] } });
                      results.Event = await Models["Event"].updateMany( {_id: { $in: data.events}}, { $pullAll: {videos: [data._id] } });
                      results.User = await Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {videos: [data._id] } });
                      var promises = [];
                      promises.push(helpers.setStatsAndActivity({_id: { $in: data.users}}));
                      Promise.all(
                        promises
                      ).then( (resultsPromise) => {
                        results.setStatsAndActivity = resultsPromise;
                        res.json(results);
                      });
                    break;
                    case "performances" :
                      logger.info("getDelete 3");
                      if ((!data.bookings || !data.bookings.length) && (!data.galleries || !data.galleries.length) && (!data.videos || !data.videos.length)) {
                        results.Performance = await Models[config.cpanel[req.params.sez].model].deleteOne( {_id: data._id});
                        results.User = await Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {performances: [data._id] } });
                        var promises = [];
                        promises.push(helpers.setStatsAndActivity({_id: { $in: data.users}}));
                        Promise.all(
                          promises
                        ).then( (resultsPromise) => {
                          results.setStatsAndActivity = resultsPromise;
                          res.json(results);
                        });
                      } else {
                        logger.info("getDelete 4");
                        let errors = [];
                        if (data.bookings && data.bookings.length) errors.push({error:"Performace is booked and can not be deleted", bookings: data.bookings});
                        if (data.galleries && data.galleries.length) errors.push({error:"Performace own galleries and can not be deleted", galleries: data.galleries});
                        if (data.videos && data.videos.length) errors.push({error:"Performace own videos and can not be deleted", videos: data.videos});
                        res.json(errors);
                      }
                    break;
                    case "profile" :
                      logger.info("getDelete 3");
                      if (data.members && data.members.length) {
                        results.Crew = await Models[config.cpanel[req.params.sez].model].deleteOne( {_id: data._id});
                        results.User = await Models["User"].updateMany( {_id: { $in: data.members}}, { $pullAll: {crews: [data._id] } });
                        var promises = [];
                        promises.push(helpers.setStatsAndActivity({_id: { $in: data.members}}));
                        Promise.all(
                          promises
                        ).then( (resultsPromise) => {
                          results.setStatsAndActivity = resultsPromise;
                          res.json(results);
                        });
                      } else {
                        logger.info("getDelete 4");
                        let errors = [];
                        if (data.bookings && data.bookings.length) errors.push({error:"Performace is booked and can not be deleted", bookings: data.bookings});
                        if (data.galleries && data.galleries.length) errors.push({error:"Performace own galleries and can not be deleted", galleries: data.galleries});
                        if (data.videos && data.videos.length) errors.push({error:"Performace own videos and can not be deleted", videos: data.videos});
                        res.json(errors);
                      }
                      break;
                  }
                } */
              }
            }
          });
        } else {
          res.status(404).send({ message: err });
        }
      });
    } else {
      let error = [];
      if (!req.query.title) error.push(`MISSING TITLE`);
      if (!req.query.slug) error.push(`MISSING SLUG`);
      res.status(404).send({ message: error});
    } 
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  } 
}

router.getDelete = (req, res) => {
  logger.info("getDelete");
  logger.info(req.params.sez);
  logger.info(config.cpanel[req.params.sez].model);
  if (config.cpanel[req.params.sez] && req.params.id) {
      const id = req.params.id;
      Models[config.cpanel[req.params.sez].model]
      .findById(id)
      .lean()
      .exec(async (err, data) => {
        if (err) {
          res.status(404).send({ message: `${JSON.stringify(err)}` });
        } else {
          if (!data) {
            res.status(404).send({ message: `DOC_NOT_FOUND` });
          } else {
            if (req.query.delete!="1") {
              res.json(data);
            } else {
              logger.info("getDelete 2");
              let results = {};
              switch (req.params.sez) {
                case "galleries" :
                  results.Galleries = await Models[config.cpanel[req.params.sez].model].deleteOne( {_id: data._id});
                  results.Performance = await Models["Performance"].updateMany( {_id: { $in: data.performances}}, { $pullAll: {galleries: [data._id] } });
                  results.Event = await Models["Event"].updateMany( {_id: { $in: data.events}}, { $pullAll: {galleries: [data._id] } });
                  results.User = await Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {galleries: [data._id] } });
                  var promises = [];
                  promises.push(helpers.setStatsAndActivity({_id: { $in: data.users}}));
                  Promise.all(
                    promises
                  ).then( (resultsPromise) => {
                    results.setStatsAndActivity = resultsPromise;
                    res.json(results);
                  });
                case "news" :
                  results.News = await Models[config.cpanel[req.params.sez].model].deleteOne( {_id: data._id});
                  results.User = await Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {news: [data._id] } });
                  var promises = [];
                  promises.push(helpers.setStatsAndActivity({_id: { $in: data.users}}));
                  Promise.all(
                    promises
                  ).then( (resultsPromise) => {
                    results.setStatsAndActivity = resultsPromise;
                    res.json(results);
                  });
                  break;
                case "videos" :
                  results.Videos = await Models[config.cpanel[req.params.sez].model].deleteOne( {_id: data._id});
                  results.Performance = await Models["Performance"].updateMany( {_id: { $in: data.performances}}, { $pullAll: {videos: [data._id] } });
                  results.Event = await Models["Event"].updateMany( {_id: { $in: data.events}}, { $pullAll: {videos: [data._id] } });
                  results.User = await Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {videos: [data._id] } });
                  var promises = [];
                  promises.push(helpers.setStatsAndActivity({_id: { $in: data.users}}));
                  Promise.all(
                    promises
                  ).then( (resultsPromise) => {
                    results.setStatsAndActivity = resultsPromise;
                    res.json(results);
                  });
                break;
                case "performances" :
                  logger.info("getDelete 3");
                  if ((!data.bookings || !data.bookings.length) && (!data.galleries || !data.galleries.length) && (!data.videos || !data.videos.length)) {
                    results.Performance = await Models[config.cpanel[req.params.sez].model].deleteOne( {_id: data._id});
                    results.User = await Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {performances: [data._id] } });
                    var promises = [];
                    promises.push(helpers.setStatsAndActivity({_id: { $in: data.users}}));
                    Promise.all(
                      promises
                    ).then( (resultsPromise) => {
                      results.setStatsAndActivity = resultsPromise;
                      res.json(results);
                    });
                  } else {
                    logger.info("getDelete 4");
                    let errors = [];
                    if (data.bookings && data.bookings.length) errors.push({error:__("Performace is booked and can not be deleted"), bookings: data.bookings});
                    if (data.galleries && data.galleries.length) errors.push({error:__("Performace own galleries and can not be deleted"), galleries: data.galleries});
                    if (data.videos && data.videos.length) errors.push({error:__("Performace own videos and can not be deleted"), videos: data.videos});
                    res.json(errors);
                  }
                break;
                case "events" :
                  logger.info("getDelete events");
                  if ((!data.program || !data.program.length) && (!data.galleries || !data.galleries.length) && (!data.videos || !data.videos.length)) {
                    results.Event = await Models[config.cpanel[req.params.sez].model].deleteOne( {_id: data._id});
                    results.User = await Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {performances: [data._id] } });
                    var promises = [];
                    promises.push(helpers.setStatsAndActivity({_id: { $in: data.users}}));
                    Promise.all(
                      promises
                    ).then( (resultsPromise) => {
                      results.setStatsAndActivity = resultsPromise;
                      res.json(results);
                    });
                  } else {
                    logger.info("getDelete 4");
                    let errors = [];
                    if (data.schedule && data.schedule.length) errors.push({error:__("Event have a program and can not be deleted"), bookings: data.bookings});
                    if (data.galleries && data.galleries.length) errors.push({error:__("Event own galleries and can not be deleted"), galleries: data.galleries});
                    if (data.videos && data.videos.length) errors.push({error:__("Event own videos and can not be deleted"), videos: data.videos});
                    res.json(errors);
                  }
                break;
                case "profile" :
                  if (!data.activity || data.activity === 0) {
                    logger.info("getDelete 3");
                    if (data.is_crew == 1) {
                      logger.info("getDelete 4");
                      results.Crew = await Models[config.cpanel[req.params.sez].model].deleteOne( {_id: data._id});
                      if (data.members && data.members.length) results.User = await Models["User"].updateMany( {_id: { $in: data.members}}, { $pullAll: {crews: [data._id] } });
                      var promises = [];
                      promises.push(helpers.setStatsAndActivity({_id: data._id}));
                      if (data.members && data.members.length) promises.push(helpers.setStatsAndActivity({_id: { $in: data.members}}));
                      Promise.all(
                        promises
                      ).then( (resultsPromise) => {
                        results.setStatsAndActivity = resultsPromise;
                        res.json(results);
                      });
                    } else if (data.is_crew == 0) {
                      logger.info("getDelete 6");
                      results.User = await Models["User"].deleteOne( {_id: data._id});
                      var promises = [];
                      Promise.all(
                        promises
                      ).then( (resultsPromise) => {
                        results.setStatsAndActivity = resultsPromise;
                        res.json(results);
                      });
                    } else {
                      logger.info("getDelete 7");
                      let errors = [];
                      if (data.videos && data.videos.length) errors.push({error:"Error", videos: data.videos});
                      res.json(errors);
                    }
                  } else {
                    logger.info("getDelete 8");
                    let errors = [];
                    if (data.activity != 0) errors.push({error:__("Performer is involved in some activities and can not be deleted"), activity: data.activity});
                    res.json(errors);
                  }
                  break;
              }
            }
          }
        }
      });
    } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

router.removeImage = (req, res) => {
  var query = {
    _id: req.params.id,
    "medias.slug": req.params.image
  };
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};

  Models.Gallery.findOne( query , (err, gallery) => {
    gallery.medias.splice(gallery.medias.map(item=>{return item.slug;}).indexOf(req.params.image),1);
    gallery.image = gallery.medias[0];
    gallery.stats.img = gallery.medias.length;
    gallery.save(function(err){
      req.params.form = 'public';
      router.getData(req, res, "json");
    });
  });

/*   Models[config.cpanel[req.params.sez].model].update( query , { $pull: {"medias": {"slug": req.params.image } } }, function(err){
    req.params.form = 'public';
    router.getData(req, res, "json");
  }); */

}

router.getSubscriptions = async (req, res) => {
  logger.info("getSubscriptions");
  logger.info(req.params.id);
  if (config.cpanel[req.params.sez] && req.params.id) {
    //const select = req.query.pure ? config.cpanel[req.params.sez].list.select : Object.assign(config.cpanel[req.params.sez].list.select, config.cpanel[req.params.sez].list.selectaddon);
    const select = config.cpanel[req.params.sez].list.select;
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].list.populate;
    populate.push({ "path": "event", "select": "title slug schedule organizationsettings", "model": "Event", "populate":[{"path": "organizationsettings.call.calls.admitted", "select": "name slug", "model": "Category"}]});
    //const ids = [req.params.id].concat(req.user.crews);
    const query = {"reference" :  req.params.id};
    /* logger.info(query);
    logger.info(select);
    logger.info(populate); */
    try {

      let data = await Models["Program"]
      .find(query)
      .select(select)
      .populate(populate)
      .sort({createdAt:-1})
      .exec();
      //logger.info(data);
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        res.render('admin/subscriptions', {
          title: 'Subscriptions',
          scripts: ["paypal"],
          currentUrl: req.originalUrl,
          
          data: data,
          script: false
        });
      }
    } catch (err) {
      res.status(500).send({ message: `${JSON.stringify(err)}` });
    }
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

router.getList = async (req, res, view) => {
  if (config.cpanel[req.params.sez] && req.params.id) {
    const select = req.query.pure ? config.cpanel[req.params.sez].list.select : Object.assign(config.cpanel[req.params.sez].list.select, config.cpanel[req.params.sez].list.selectaddon);
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].list.populate;
    const ids = [req.params.id].concat(req.user.crews.map(u => {return u._id.toString()}));
    const query =  req.params.sez == "crews" || req.params.sez == "partners" ? {members: req.params.id} : {users:{$in: ids}};
    try {
      let data = await Models[config.cpanel[req.params.sez].list.model]
      .find(query)
      .select(select)
      .populate(populate)
      .sort({createdAt:-1})
      .exec();
      let send = JSON.parse(JSON.stringify(req.user));
      send[req.params.sez] = data;
      //for (const item in config.cpanel[req.params.sez].list.select) send[item] = data[item];
      if (view == "json") {
        res.json(send);
      } else {
        res.render(view, {
          title: view,
          scripts: [],
          currentUrl: req.originalUrl,
          get: req.params,
          msg_tmp: { }, 
          data: send
        });
      }  
    } catch (err) {
      if (view == "json") {
        res.status(500).send({ message: `${JSON.stringify(err)}` });
      } else {
        res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
      }
    }
  } else {
    if (view == "json") {
      res.status(404).send({ message: `API_NOT_FOUND` });
    } else {
      res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
    }  
  }
}

router.getData = async (req, res, view) => {
  logger.info("ddddddddddddd")
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms[req.params.form]) {
    const id = req.params.id;
    const select = req.query.pure ? config.cpanel[req.params.sez].forms[req.params.form].select : Object.assign(config.cpanel[req.params.sez].forms[req.params.form].select, config.cpanel[req.params.sez].forms[req.params.form].selectaddon);
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].forms[req.params.form].populate;
    try {
      let data = await Models[config.cpanel[req.params.sez].model]
      .findById(id)
      .select(select)
      .populate(populate)
      .exec();
      if (!data) {
        if (view == "json") {
          res.status(404).send({ message: `DOC_NOT_FOUND` });
        } else {
          res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
        }  
      } else {
        if (helpers.editable(req, data, id)) {
          let send = {_id: data._id};
          for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) send[item] = data[item];
          if (view == "json") {
            res.json(send);
          } else {
            if (req.params.sez == "partners" && req.body.subject && req.body.submit=="send") {
              router.addPartnersToQueque(req, res, data, () => {
                req.flash('success', { msg: __('Messagess added to the cue.')+'<a href="/admin/mailer"><b>'+__("CHECK THE CUE")+'</b></a>' });
                res.render(view, {
                  title: view,
                  scripts: [],
                  currentUrl: req.originalUrl,
                  get: req.params,
                  query: req.query,
                  body: req.body,
                  countries: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getCountries() : undefined,
                  languages: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getLanguages() : undefined,
                  msg_tmp: { }, 
                  data: send,
                  partners_categories: partners_categories
                });
              });
            } else if (req.params.sez == "events" && req.body.subject && req.body.submit=="send") {
              router.addPartnersEventToQueque(req, res, data, () => {
                req.flash('success', { msg: __('Messagess added to the cue.')+'<a href="/admin/mailer"><b>'+__("CHECK THE CUE")+'</b></a>' });
                res.render(view, {
                  title: view,
                  scripts: [],
                  currentUrl: req.originalUrl,
                  get: req.params,
                  query: req.query,
                  body: req.body,
                  countries: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getCountries() : undefined,
                  languages: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getLanguages() : undefined,
                  msg_tmp: { }, 
                  data: send,
                  partners_categories: partners_categories
                });
              });
            } else {
              res.render(view, {
                title: view,
                config: config,
                scripts: [],
                currentUrl: req.originalUrl,
                get: req.params,
                query: req.query,
                body: req.body,
                countries: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getCountries() : undefined,
                languages: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getLanguages() : undefined,
                msg_tmp: { }, 
                data: send,
                partners_categories: partners_categories
              });
            }
          }  
        } else {
          if (view == "json") {
            res.status(401).send({ message: `DOC_NOT_OWNED` });
          } else {
            res.status(401).render('401', {path: req.originalUrl, title:__("401: Access to the content is denied"), titleicon:"icon-warning"});
          }  
        }
      }
    } catch (err) {
      console.error(`🔥 Error in getData:`, err);
      if (view == "json") {
        res.status(500).send({ message: `${JSON.stringify(err)}` });
      } else {
        res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
      }
    }
  } else {
    if (view == "json") {
      res.status(404).send({ message: `API_NOT_FOUND` });
    } else {
      res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
    }  
  }
}

router.addPartnersToQueque = (req, res, data, cb) => {
  var tosave = {};
  tosave.organization = req.params.id;
  if (req.params.event) tosave.event = req.params.event;
  tosave.user = req.user._id;
  tosave.subject = req.body.subject;
  tosave.messages_tosend = [];
  tosave.messages_sent = [];
  if (req.query.is_active=="1") data.partners = data.partners.filter(partner => partner.is_active == (req.query.is_active=="1"));
  if (req.query.is_event=="1") data.partners = data.partners.filter(partner => partner.is_event == (req.query.is_event=="1"));
  if (req.query.is_selecta=="1") data.partners = data.partners.filter(partner => partner.is_selecta == (req.query.is_selecta=="1"));
  //-each q in req.query.categories
  if (req.query.categories) 
    data.partners = data.partners.filter(partner => req.query.categories.some(r => partner.categories.map(item => {return item._id.toString()}).includes(r) ));
  if (req.query.nokind) 
    data.partners = data.partners.filter(partner => !partner.categories.length);

  data.partners.forEach((item, index) => {
    var message = {};
    if (!req.body.exclude) req.body.exclude = [];
    if (item.partner && item.partner.organizationData && item.partner.organizationData.contacts && item.partner.organizationData.contacts[0] && item.partner.organizationData.contacts[0].email && req.body.exclude.indexOf(item.partner._id.toString())===-1) {
      message.to_html = "";
      message.cc_html = [];

      message.from_name = req.body.from_name;
      message.from_email = req.body.from_email;
      message.user_email = req.body.user_email;
      message.user_password = req.body.user_password;
      message.subject = req.body.subject.split("[org_name]").join(item.partner.stagename);

      item.partner.organizationData.contacts.forEach((contact, cindex) => {
        if (contact.email && message.to_html == "") {
          message.to_html = (contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">"
          message.text = req.body["message_"+(contact.lang=="it" ? "it" : "en")]
          message.text = message.text.split("[name]").join(contact.name);
          message.text = message.text.split("[slug]").join(item.partner.slug);
        } else if (contact.email && message.to_html != "") {
          message.cc_html.push((contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">")
        }
      });

      if (message.to_html != "") {
        tosave.messages_tosend.push(message);
      } else {
        logger.info(item);
      }
    } else {
      logger.info(item);
    }
  });
  Models.Emailqueue.create(tosave, function (err) {
    logger.info("Emailqueue.create")
    cb(err)
  });
}


router.addPartnersEventToQueque = (req, res, data, cb) => {
  var tosave = {};
  tosave.organization = data.users[0];
  if (req.params.event) tosave.event = req.params.id;
  tosave.user = req.user._id;
  tosave.subject = req.body.subject;
  tosave.messages_tosend = [];
  tosave.messages_sent = [];

  var dest = [];
  data.partners.forEach((group, index) => {
    group.users.forEach((item, index) => {
      logger.info(item);
      if (!req.body.exclude || res.body.exclude.indexOf(item._id.toString())) dest.push(item._id.toString());
    });
  });

  var populate = [{ "path": "partners.partner", "select": "stagename slug organizationData", "model": "User"}];
  //const query = {"partner_owner.owner": {$in: event.users.map(item =>{return item._id})}};
  const query = {"_id": {$in: data.users}};
  Models.User.
  find(query).
  lean().
  sort({stagename: 1}).
  //select({stagename: 1, createdAt: 1, crews:1}).
  populate(populate).
  exec((err, data) => {
    var partners = []
    for (var item in data) {
      partners = partners.concat(data[item].partners);
    }   
    logger.info("partners");
    logger.info(partners);
    partners.forEach((item, index) => {
      var message = {};
      logger.info("req.body.exclude.indexOf(item._id.toString())===-1");
      if (item && item.partner && item.partner.organizationData && item.partner.organizationData.contacts && item.partner.organizationData.contacts[0] && item.partner.organizationData.contacts[0].email && dest.indexOf(item.partner._id.toString())!==-1) {
        message.to_html = "";
        message.cc_html = [];
  
        message.from_name = req.body.from_name;
        message.from_email = req.body.from_email;
        message.user_email = req.body.user_email;
        message.user_password = req.body.user_password;
        message.subject = req.body.subject.split("[org_name]").join(item.partner.stagename);
  
        item.partner.organizationData.contacts.forEach((contact, cindex) => {
          if (contact.email && message.to_html == "") {
            message.to_html = (contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">"
            message.text = req.body["message_"+(contact.lang=="it" ? "it" : "en")]
            message.text = message.text.split("[name]").join(contact.name);
            message.text = message.text.split("[slug]").join(item.partner.slug);
          } else if (contact.email && message.to_html != "") {
            message.cc_html.push((contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">")
          }
        });
  
        if (message.to_html != "") tosave.messages_tosend.push(message)
      } else {
        //logger.info(item.partner.stagename);
      }
    });
    logger.info("tosavetosavetosavetosavetosavetosave");
    //logger.info(tosave);
    Models.Emailqueue.create(tosave, function (err) {
      logger.info("Emailqueue.create")
      cb(err)
    });
  });
}









router.getEmailqueue = (req, res) => {
  logger.info('/mailer/'+req.params.id);
  logger.info("getEmailqueue");
  logger.info("req.body");
  var ids = req.user.crews.map(item => {return item._id});
  logger.info(ids);
  logger.info(req.body);
  logger.info("req.params");
  logger.info(req.params);

  var query = {$or:[{organization: {$in: ids}}, {user: req.user._id}]};
  if (req.params.event) query.event = req.params.event;
  var populate = [
    {path: "organization", select: {stagename:1, slug:1}, model:"UserShow"},
    {path: "user", select: {stagename:1, slug:1}, model:"UserShow"},
    {path: "event", select: {title:1, slug:1}, model:"EventShow"}
  ];
  Models.Emailqueue.
  find(query).
  //sort({stagename: 1}).
  //select({stagename: 1, createdAt: 1, crews:1}).
  populate(populate).
  exec((err, data) => {
    logger.info("data");
    logger.info(data);
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      res.render('admin/emailqueue', {
        title: 'Email queue',
        currentUrl: req.originalUrl,
        map: req.query.map,
        csv: req.query.csv,
        body: req.body,
        event: req.params.event,
        get: req.params,
        owner: req.params.id,
        //events: events,
        user: req.user,
        data: data,
        script: false
      });
    }
  });
}

/* router.getOwnresIds = (req, res,cb) => {
  Models.User
  .findById(req.params.id)
  .select({crews:1})
  .exec((err, data) => {
    if (data._id) data.crews.push(data._id);
    cb(data.crews);
  });
} */

  router.getSlug = async (req, res) => {
    try {
      const model = Models[config.cpanel[req.params.sez].model];
      if (!model) {
        logger.error(`❌ Model not found for section: ${req.params.sez}`);
        return res.status(400).json({ message: "MODEL_NOT_FOUND" });
      }
      const user = await model.findOne({ slug: req.params.slug }).select("_id").exec();
      res.json({ slug: req.params.slug, exist: user !== null });
    } catch (err) {
      logger.error("🔥 Error in getSlug", { message: err.message, stack: err.stack });
      res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
  };
  
router.getEmail = (req, res) => {
  Models["User"]
  .findOne({ $or : [{ "email" : req.params.email },{ "emails.email" : req.params.email }] },'_id', (err, user) => {
    if (err) logger.info(`${JSON.stringify(err)}`);
    res.json({email:req.params.email,exist:user!==null?true:false});
  });
}

router.getCategoryByAncestor = async (cat) => {
  try {
    let childrens = await Models.Category.find({ancestor: cat._id})
    .select({name:1 , slug:1})
    .exec()
    return childrens;
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
  }
}

router.getCategories = (req, res) => {
  if (req.params.rel == "performances" && req.params.q == "type") {
    router.getPerfCategories(req, res, (result) => {
      res.json(result);
    });
  } else {
    let conta = 0;
    Models.Category.findOne({slug: req.params.q, rel: req.params.rel })
    .select({name:1 , slug:1})
    .exec( (err, category) => {
      if (err) logger.info(`${JSON.stringify(err)}`);
      if (category && category._id) {
        router.getCategoryByAncestor(category, (childrens) => {
          if (err) logger.info(`${JSON.stringify(err)}`);
          for (let a=0;a<childrens.length;a++){
            router.getCategoryByAncestor(childrens[a], (childrens2) => {
              childrens[a].childrens = childrens2;
              conta++;
              if (childrens.length == conta) {
                category.childrens = childrens;
                category = JSON.parse(JSON.stringify(category));
                for (let b=0;b<category.childrens.length;b++){
                  category.childrens[b].title = category.childrens[b].name;
                  category.childrens[b].value = category.childrens[b].slug;
                  category.childrens[b].key = category.childrens[b]._id;
                }
                res.json(category);
              }
            });
          }
      
        });  
      } else {
        res.json(category);
      }
    });  
  }
}

/* router.getPerfCategories = async (req, res) => {
  try {
    let genre = await Models.Category.find({ancestor: "5be8708afc3961000000021c", rel: req.params.rel })
    .select({name:1 , slug:1})
    .exec();
    let conta = 0;
    try {
      let category = await Models.Category.findOne({slug: req.params.q, rel: req.params.rel })
      .select({name:1 , slug:1})
      .exec();
      if (category && category._id) {
        router.getCategoryByAncestor(category, (childrens) => {
          logger.info(childrens);
          for (let a=0;a<childrens.length;a++){
            router.getCategoryByAncestor(childrens[a], (childrens2) => {
              for (let b=0;b<childrens2.length;b++) childrens2[b].childrens = genre;
              childrens[a].childrens = childrens2;
              conta++;
              if (childrens.length == conta) {
                category.childrens = childrens;
                let send = {
                  name: category.name,
                  slug: category.slug,
                  _id: category._id,
                  children:[]
                };
                for(let a=0; a<category.childrens.length;a++){
                  let child = {
                    name: category.childrens[a].name,
                    slug: category.childrens[a].slug,
                    _id: category.childrens[a]._id,
                    children:[]
                  };
                  for(let b=0; b<category.childrens[a].childrens.length;b++){
                    let childchild = {
                      name: category.childrens[a].childrens[b].name,
                      slug: category.childrens[a].childrens[b].slug,
                      _id: category.childrens[a].childrens[b]._id,
                      children:[]
                    };
                    for(let c=0; c<category.childrens[a].childrens[b].childrens.length;c++){
                      let childchildchild = {
                        name: category.childrens[a].childrens[b].childrens[c].name,
                        slug: category.childrens[a].childrens[b].childrens[c].slug,
                        _id: category.childrens[a].childrens[b].childrens[c]._id,
                        children:[]
                      };
                      childchild.children.push(childchildchild);
                    }
                    child.children.push(childchild);
                  }
                  send.children.push(child);
                }
                console.log("bbbbbbbbbb")
                console.log(send)
                return send;
              }
            });
          }
        });  
      } else {
        return category;
      }    
    } catch (err) {
      logger.info(`${JSON.stringify(err)}`);
      return err;
    }
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return err;
  }
} */
  router.getPerfCategories = async (req, res) => {
    try {
      let genre = await Models.Category.find({ ancestor: "5be8708afc3961000000021c", rel: req.params.rel })
        .select({ name: 1, slug: 1 })
        .exec();
  
      let category = await Models.Category.findOne({ slug: req.params.q, rel: req.params.rel })
        .select({ name: 1, slug: 1 })
        .exec();
  
      if (!category || !category._id) return category; // Return empty if category not found
  
      let childrens = await router.getCategoryByAncestor(category);
  
      for (let a = 0; a < childrens.length; a++) {
        let childrens2 = await router.getCategoryByAncestor(childrens[a]);
  
        for (let b = 0; b < childrens2.length; b++) {
          childrens2[b].childrens = genre;
        }
        childrens[a].childrens = childrens2;
      }
  
      category.childrens = childrens;
  
      let send = {
        name: category.name,
        slug: category.slug,
        _id: category._id,
        children: category.childrens.map(child => ({
          name: child.name,
          slug: child.slug,
          _id: child._id,
          children: child.childrens.map(childchild => ({
            name: childchild.name,
            slug: childchild.slug,
            _id: childchild._id,
            children: childchild.childrens.map(childchildchild => ({
              name: childchildchild.name,
              slug: childchildchild.slug,
              _id: childchildchild._id,
              children: []
            }))
          }))
        }))
      };
  
      console.log("✅ Successfully built category tree:", send);
      return send;
    } catch (err) {
      logger.info(`🔥 Error in getPerfCategories: ${JSON.stringify(err)}`);
      return err;
    }
  };
  
router.getMembers = (req, res) => {
  Models.User
  .find({$or:[
    { slug : { "$regex": req.params.q, "$options": "i" } },
    { stagename : { "$regex": req.params.q, "$options": "i" } },
    { name : { "$regex": req.params.q, "$options": "i" } },
    { surname : { "$regex": req.params.q, "$options": "i" } }
  ],is_crew: false})
  .lean()
  .select({'stagename':1})
  //.select({'_id':1, 'stagename':1, 'name':1, 'surname':1, 'email': 1})
  //.collation({locale: "en" })
  .sort({'stagename': 1})
  .exec((err, users) => {
    if (err) logger.info(`${JSON.stringify(err)}`);
    //res.json(users.map(item => {delete item.imageFormats; return item;}));
    let result = [];
    logger.info(users);
    res.json(users);
  });
}

router.getAuthors = (req, res) => {
  var find = {$or:[
    { slug : { "$regex": req.params.q, "$options": "i" } },
    { stagename : { "$regex": req.params.q, "$options": "i" } },
    { name : { "$regex": req.params.q, "$options": "i" } },
    { surname : { "$regex": req.params.q, "$options": "i" } }
  ]};
  if (req.query.is_crew) find.is_crew = true;
  Models.User
  .find(find)
  .lean()
  .select({'stagename':1})
  .sort({'stagename': 1})
  .exec((err, users) => {
    if (err) logger.info(`${JSON.stringify(err)}`);
    res.json(users);
  });
}

router.getPerformances = (req, res) => {
  Models.Performance
  .find({$or:[
    { slug : { "$regex": req.params.q, "$options": "i" } },
    { title : { "$regex": req.params.q, "$options": "i" } }
  ]})
  .lean()
  .select({'title':1})
  .sort({'title': 1})
  .exec((err, performances) => {
    if (err) logger.info(`${JSON.stringify(err)}`);
    res.json(performances);
  });
}

router.getGalleries = (req, res) => {
  Models.Gallery
  .find({$or:[
    { slug : { "$regex": req.params.q, "$options": "i" } },
    { title : { "$regex": req.params.q, "$options": "i" } }
  ]})
  .lean()
  .select({'title':1})
  .sort({'title': 1})
  .exec((err, galleries) => {
    if (err) logger.info(`${JSON.stringify(err)}`);
    res.json(galleries);
  });
}

router.getVideos = (req, res) => {
  var select, find;
  if (req.query.vjtv) {
    find = {"categories.0":{$exists:true},"media.externalurl":{$exists:false},"media.duration": {$gt:60000}, "media.encoded": 1, $or:[
      { slug : { "$regex": req.params.q, "$options": "i" } },
      { title : { "$regex": req.params.q, "$options": "i" } }
    ]};
    select = {'title':1, 'slug':1, "categories": 1,"media.duration": 1}
  } else {
    find = {$or:[
      { slug : { "$regex": req.params.q, "$options": "i" } },
      { title : { "$regex": req.params.q, "$options": "i" } }
    ]};
    select = {'title':1}
  }
  Models.Video
  .find(find)
  .lean()
  //.populate({path:"categories", })
  .select(select)
  .sort({'title': 1})
  .exec((err, video) => {
    if (err) logger.info(`${JSON.stringify(err)}`);
    res.json(video);
  });
}

router.removeAddress = (req, res) => {
  if (req.query.db === "users") {
    logger.info(req.query);
    router.removeAddressUsers(req, res, () => {
      router.removeAddressDB(req, res, () => {
        res.json(req.query);
      });
    });
  }
  if (req.query.db === "venues") {
    logger.info(req.query);
    router.removeVenueDB(req, res, (newaddr) => {
      //logger.info(newaddr);
      router.removeAddressEvents(req, res, newaddr, () => {
        res.json(req.query);
      });
    });
  }
}

router.removeAddressUsers = (req, res, cb) => {
  logger.info("removeAddressUsers");
  var conta = 0;
  //res.json(req.query);
  Models.User
  .find({"addresses.country": req.query.country, "addresses.locality": req.query.locality},'_id, addresses', (err, users) => {
    if (err) logger.info(`${JSON.stringify(err)}`);
    if (users.length) {
      for(var a=0;a<users.length;a++){
        for(var b=0;b<users[a].addresses.length;b++){
          if (users[a].addresses[b].country === req.query.country && users[a].addresses[b].locality === req.query.locality) {
            if (req.query.action === "REMOVE") {
              if (req.query.field === "locality") {
                users[a].addresses[b].locality = undefined;
              }
              if (req.query.field === "country") {
                logger.info("stocazzzooooooooooo USERS");
                logger.info(users[a]);
                users[a].addresses.splice(b, 1);
                logger.info(users[a]);
              }
            }
            if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
              users[a].addresses[b][req.query.field] = req.query.new;
            }
          }
        }
        logger.info("stocazzzooooooooooo USERS");
        logger.info(users[a]);
        Models.User.updateOne({_id: users[a]._id}, { $set: {addresses: users[a].addresses}}, function(err, res) {
          conta++;
          if (err) {
            logger.info(err);
          } else {
            logger.info(res);
          }
          if (conta === users.length) cb();
        });
      }
    } else {
      cb();
    }
  });
}

router.removeAddressDB = (req, res, cb) => {
  logger.info("removeAddressDB");
  var collection;
  var rel;
  var q;
  if (req.query.db === "users") {
    collection = Models.AddressDB;
    q = {"country": req.query.country, "locality": req.query.locality};
  }
  if (req.query.db === "venues") {
    collection = Models.VenueDB;
    q = {"name": req.query.name, "country": req.query.country, "locality": req.query.locality};
  }
  collection
  .find(q, (err, addresses) => {
    if (err) logger.info(`${JSON.stringify(err)}`);
    if (addresses.length) {
      var b=0;
      if (req.query.action === "REMOVE") {
        if (req.query.field === "locality") {
          addresses[b].locality = undefined;
          logger.info("stocazzzooooooooooo AddressDB");
          logger.info(addresses[b]);
          collection.findByIdAndUpdate(addresses[b]._id, { $unset: {locality:1}}, { new: false }, function (err, res) {
            logger.info(err);
            logger.info(res);
            if (err && err.code == "11000") {
              collection.deleteOne(q, function (err) {
                if (err) logger.info(err);
                cb();
                // deleted at most one tank document
              });
            } else {
              cb();
            }
          });
        }
        if (req.query.field === "country") {
          collection.deleteOne(q, function (err) {
            if (err) logger.info(err);
            cb();
          });
        }
      }
      if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
        var update = {};
        update[req.query.field] = req.query.new;
        collection.findByIdAndUpdate(addresses[b]._id, update, { new: false }, function (err, res) {
          logger.info(err);
          logger.info(res);
          if (err && err.code == "11000") {
            collection.deleteOne(q, function (err) {
              if (err) logger.info(err);
              cb();
              // deleted at most one tank document
            });
          } else {
            cb();
          }
        });
      }
    } else {
      cb();
    }
  });
}

router.removeAddressEvents = (req, res, newaddr, cb) => {
  logger.info("removeAddressEvents");
  var conta = 0;
  Models.Event
  .find({$or: [{"schedule.venue.name": req.query.name, "schedule.venue.location.country": req.query.country, "schedule.venue.location.locality": req.query.locality},{"program.schedule.venue.name": req.query.name}]},{schedule:1,title:1,program:1}, (err, events) => {
    if (err) logger.info(`${JSON.stringify(err)}`);
    if (events.length) {
      for(var a=0;a<events.length;a++){
        logger.info(events[a].title);
        for(var b=0;b<events[a].schedule.length;b++){
          if (events[a].schedule[b].venue.name === req.query.name && events[a].schedule[b].venue.location.country === req.query.country && events[a].schedule[b].venue.location.locality === req.query.locality) {
            /* if (req.query.action === "REMOVE") {
              if (req.query.field === "locality") {
                events[a].schedule[b].venue.location.locality = undefined;
              }
              if (req.query.field === "country") {
                events[a].schedule.splice(b, 1);
              }
            } */
            if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
              if (req.query.field === "name") {
                events[a].schedule[b].venue.name = req.query.new;
              } else {
                events[a].schedule[b].venue.location[req.query.field] = req.query.new;
              }
            }
          }
        }
        if (events[a].program && events[a].program.length) {
          for(var b=0;b<events[a].program.length;b++){
            if (events[a].program[b].schedule.venue && events[a].program[b].schedule.venue.name == req.query.name/*  && events[a].program[b].schedule.venue.location.country === req.query.country && events[a].program[b].schedule.venue.location.locality === req.query.locality */) {
              /* if (req.query.action === "REMOVE") {
                if (req.query.field === "locality") {
                  events[a].program[b].schedule.venue.location.locality = undefined;
                }
                if (req.query.field === "country") {
                  logger.info("stocazzzooooooooooo events");
                  logger.info(events[a]);
                  events[a].program.splice(b, 1);
                  logger.info(events[a]);
                }
              } */
              if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
                if (req.query.field === "name") {
                  events[a].program[b].schedule.venue.name = req.query.new;
                } else {
                  events[a].program[b].schedule.venue.location[req.query.field] = req.query.new;
                }
              }
            }
          }
        }
        var set = events[a].program ? {schedule: events[a].schedule,program: events[a].program} : {schedule: events[a].schedule};
        logger.info(set);
        Models.Event.updateOne({_id: events[a]._id}, set, function(err, res) {
          conta++;
          if (err) {
            logger.info(err);
          } else {
            logger.info(res);
          }
          if (conta === events.length) cb();
        });
      }
    } else {
      cb();
    }
  });
}

router.removeVenueDB = (req, res, cb) => {
  logger.info("removeVenueDB");
  var rel;
  var q;
  q = {"name": req.query.name, "country": req.query.country, "locality": req.query.locality};
  Models.VenueDB
  .find(q, (err, addresses) => {
    if (err) logger.info(`${JSON.stringify(err)}`);
    if (addresses.length) {
      var b=0;
      /* if (req.query.action === "REMOVE") {
        if (req.query.field === "locality") {
          addresses[b].locality = undefined;
          logger.info("stocazzzooooooooooo AddressDB");
          logger.info(addresses[b]);
          Models.VenueDB.findByIdAndUpdate(addresses[b]._id, { $unset: {locality:1}}, { new: false }, function (err, res) {
            logger.info(err);
            logger.info(res);
            if (err && err.code == "11000") {
              Models.VenueDB.deleteOne(q, function (err) {
                if (err) logger.info(err);
                cb();
                // deleted at most one tank document
              });
            } else {
              cb();
            }
          });
        }
        if (req.query.field === "country") {
          Models.VenueDB.deleteOne(q, function (err) {
            if (err) logger.info(err);
            cb();
          });
        }
      } */
      if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
        var update = {};
        update[req.query.field] = req.query.new;
        logger.info(update);
        Models.VenueDB.findByIdAndUpdate(addresses[b]._id, update, { new: false }, function (err, res) {
          //logger.info(err);
          //logger.info(res);
          if (err && err.code == "11000") {
            Models.VenueDB.deleteOne(q, function (err) {
              if (err) logger.info(err);
              cb(res);
              // deleted at most one tank document
            });
          } else {
            cb(res);
          }
        });
      }
    } else {
      logger.info("stocazzostocazzostocazzostocazzostocazzo");
      cb();
    }
  });
}

router.addMember = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.members = req.user._id;
  logger.info();
  Models["User"]
  .findOne(query)
  .select({_id:1, stats:1, stagename:1, members:1})
  .populate({ "path": "members", "select": "addresses", "model": "User"})
  .exec((err, crew) => {
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!crew) {
      res.status(404).send({
        "message": "USER_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (crew.members.map((item)=>{return item._id.toString()}).indexOf(req.params.member)!==-1) {
      res.status(404).send({
        "message": "USER_IS_ALREADY_IN",
        "name": "MongoError",
        "stringValue":"\"USER_IS_ALREADY_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_IS_ALREADY_IN",
          "name":"MongoError",
          "stringValue":"\"USER_IS_ALREADY_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      crew.members.push(req.params.member);
      logger.info("crew.members");
      logger.info(crew.members);
      logger.info(crew.members.length);
      crew.stats.members = crew.members.length;
      logger.info(crew);
      crew.save(function(err){
        var query = {_id: req.params.member};
        Models["User"]
        .findOne(query)
        .select({_id:1, stats:1, crews:1})
        //.populate({ "path": "members", "select": "addresses", "model": "User"})
        .exec((err, member) => {
          if (err) {
            logger.info(`${JSON.stringify(err)}`);
            res.status(404).send({ message: err });
          } else {
            member.crews.push(req.params.id);
            logger.info("member.crews");
            logger.info(member.crews);
            logger.info(member.crews.length);
            member.stats.crews = member.crews.length;
            member.save(function(err){
              if (err) {
                logger.info(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                req.params.sez = 'crews';
                req.params.form = 'members';
                router.getData(req, res, "json");
              }
            });              
          }
        });
      });
    }
  });
}

router.removeMember = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.members = req.user._id;
  logger.info(query);
  Models["User"]
  .findOne(query)
  .select({_id:1, stagename:1, stats:1, members:1})
  .populate({ "path": "members", "select": "addresses", "model": "User"})
  .exec((err, crew) => {
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!crew) {
      res.status(404).send({
        "message": "USER_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (crew.members.map((item)=>{return item._id.toString()}).indexOf(req.params.member)===-1) {
      res.status(404).send({
        "message": "MEMBER_IS_NOT_A_MEMBER",
        "name": "MongoError",
        "stringValue":"\"MEMBER_IS_NOT_A_MEMBER\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"MEMBER_IS_NOT_A_MEMBER",
          "name":"MongoError",
          "stringValue":"\"MEMBER_IS_NOT_A_MEMBER\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (crew.members.length===1) {
      res.status(404).send({
        "message": "LEAST_ONE_MEMBER_IS_REQUIRED",
        "name": "MongoError",
        "stringValue":"\"LEAST_ONE_MEMBER_IS_REQUIRED\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"LEAST_ONE_MEMBER_IS_REQUIRED",
          "name":"MongoError",
          "stringValue":"\"LEAST_ONE_MEMBER_IS_REQUIRED\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      crew.members.splice(crew.members.map((item)=>{return item._id.toString()}).indexOf(req.params.member), 1);
      logger.info("crew.members");
      logger.info(crew.members);
      logger.info(crew.members.length);
      crew.stats.members = crew.members.length;

      crew.save(function(err){
        if (err) {
          logger.info(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          var query = {_id: req.params.member};
          Models["User"]
          .findOne(query)
          .select({_id:1, stats:1, crews:1})
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, member) => {
            member.crews.splice(member.crews.indexOf(req.params.id), 1);
            logger.info("member.crews");
            logger.info(member.crews);
            logger.info(member.crews.length);
            member.stats.crews = member.crews.length;
            member.save(function(err){
              if (err) {
                logger.info(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                req.params.sez = 'crews';
                req.params.form = 'members';
                router.getData(req, res, "json");
              }
            });
          });
        }
      });
    }
  });
}

router.addUser = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};

  Models[config.cpanel[req.params.sez].model]
  .findOne(query)
  .select({_id:1, stagename:1, stats:1, users:1})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!item) {
      res.status(404).send({
        "message": "USER_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (item.users.indexOf(req.params.user)!==-1) {
      res.status(404).send({
        "message": "USER_IS_ALREADY_IN",
        "name": "MongoError",
        "stringValue":"\"USER_IS_ALREADY_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_IS_ALREADY_IN",
          "name":"MongoError",
          "stringValue":"\"USER_IS_ALREADY_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      item.users.push(req.params.user);
      item.save(function(err){
        if (err) {
          logger.info(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          var query = {_id: req.params.user};
          var select = {_id:1, stats:1, crews:1}
          select[req.params.sez] = 1;
          Models["User"]
          .findOne(query)
          .select(select)
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, user) => {
            user[req.params.sez].push(req.params.id);
            user.save(function(err){
              if (err) {
                logger.info(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                Promise.all(
                  [helpers.setStatsAndActivity(query)]
                ).then( (results) => {
                  //res.json(item);
                  req.params.form = 'public';
                  router.getData(req, res, "json");
                });
              
              }
            });
          });
        }
      });
    }
  });
}

router.removeUser = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};

  Models[config.cpanel[req.params.sez].model]
  .findOne(query)
  .select({_id:1, stagename:1, stats:1, users:1,})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!item) {
      res.status(404).send({
        "message": "USER_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (item.users.indexOf(req.params.user)===-1) {
      res.status(404).send({
        "message": "USER_IS_NOT_IN",
        "name": "MongoError",
        "stringValue":"\"USER_IS_NOT_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_IS_NOT_IN",
          "name":"MongoError",
          "stringValue":"\"USER_IS_NOT_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (item.users.length===1) {
      res.status(404).send({
        "message": "LEAST_ONE_AUTHOR_IS_REQUIRED",
        "name": "MongoError",
        "stringValue":"\"LEAST_ONE_AUTHOR_IS_REQUIRED\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"LEAST_ONE_AUTHOR_IS_REQUIRED",
          "name":"MongoError",
          "stringValue":"\"LEAST_ONE_AUTHOR_IS_REQUIRED\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      item.users.splice(item.users.indexOf(req.params.user), 1);
      //res.json(item);
      item.save(function(err){
        if (err) {
          logger.info(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          var query = {_id: req.params.user};
          var select = {_id:1, stats:1, crews:1}
          select[req.params.sez] = 1;
          Models["User"]
          .findOne(query)
          .select(select)
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, user) => {
            user[req.params.sez].splice(user[req.params.sez].indexOf(req.params.id), 1);
            user.save(function(err){
              if (err) {
                logger.info(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                Promise.all(
                  [helpers.setStatsAndActivity(query)]
                ).then( (results) => {
                  req.params.form = 'public';
                  router.getData(req, res, "json");
                });
              }
            });
          });
        }
      });
    }
  });
}
/*
router.eventAddPerformance = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};

  Models['Event']
  .findOne(query)
  .select({_id:1, title:1, stats:1, program:1})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!item) {
      res.status(404).send({
        "message": "PERFORMANCE_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"PERFORMANCE_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"PERFORMANCE_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"PERFORMANCE_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (item.program.map((item)=>{return item.performance.toString()}).indexOf(req.params.performance)!==-1) {
      res.status(404).send({
        "message": "PERFORMANCE_IS_ALREADY_IN",
        "name": "MongoError",
        "stringValue":"\"PERFORMANCE_IS_ALREADY_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"PERFORMANCE_IS_ALREADY_IN",
          "name":"MongoError",
          "stringValue":"\"PERFORMANCE_IS_ALREADY_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      item.program.push({performance:req.params.performance});
      item.save(function(err){
        if (err) {
          logger.info(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          var query = {_id: req.params.performance};
          var select = {_id:1, bookings:1}
          Models["Performance"]
          .findOne(query)
          .select(select)
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, performance) => {
            performance.bookings.push({event:req.params.id});
            performance.save(function(err){
              if (err) {
                logger.info(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                query = {performance: req.params.performance, event: req.params.id};
                Models["Program"]
                .findOne(query)
                .exec((err, program) => {
                  if (!program) {
                    program = {};
                    program.performance = req.params.performance;
                    program.reference = req.user._id;
                    program.event = req.params.id;
                    program.status = "5be8708afc39610000000013";
                    Models["Program"]
                    .create(program, function (err, program) {
                      if (err) {
                        logger.info(`${JSON.stringify(err)}`);
                        res.status(404).send({ message: err });
                      } else {
                        req.params.sez = 'events';
                        req.params.form = 'program';
                        router.getData(req, res, "json");            
                      }
                    });
                  } else {
                    req.params.sez = 'events';
                    req.params.form = 'program';
                    router.getData(req, res, "json");            
                  }
                });
              }
            });
          });
        }
      });
    }
  });
}
*/
router.eventAddPerformance = (req, res) => {
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};

  var query = {_id: req.params.id};
  Models['Event']
  .findOne(query)
  .select({_id:1, title:1, stats:1, program:1})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, event) => {
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!event) {
      res.status(404).send({
        "message": "PERFORMANCE_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"PERFORMANCE_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"PERFORMANCE_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"PERFORMANCE_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (event.program.map((item)=>{return item.performance.toString()}).indexOf(req.params.performance)!==-1) {
      res.status(404).send({
        "message": "PERFORMANCE_IS_ALREADY_IN",
        "name": "MongoError",
        "stringValue":"\"PERFORMANCE_IS_ALREADY_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"PERFORMANCE_IS_ALREADY_IN",
          "name":"MongoError",
          "stringValue":"\"PERFORMANCE_IS_ALREADY_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      query = {performance: req.params.performance, event: req.params.id};
      Models["Program"]
      .findOne(query)
      .exec((err, pp) => {
        if (!pp) {
          var programnew = {};
          programnew.performance = req.params.performance;
          programnew.reference = req.user._id;
          programnew.event = req.params.id;
          programnew.status = "5be8708afc39610000000013";
          Models["Program"]
          .create(programnew, function (err, program) {
            if (err) {
              logger.info(`${JSON.stringify(err)}`);
              res.status(404).send({ message: err });
            } else {
              Models["Program"]
              .findOne(query)
              .exec((err, program) => {
                event.program.push({performance:req.params.performance, subscription_id:program._id});
                event.save(function(err){
                  if (err) {
                    logger.info(`${JSON.stringify(err)}`);
                    res.status(404).send({ message: err });
                  } else {
                    var query = {_id: req.params.performance};
                    var select = {_id:1, bookings:1}
                    Models["Performance"]
                    .findOne(query)
                    .select(select)
                    //.populate({ "path": "members", "select": "addresses", "model": "User"})
                    .exec((err, performance) => {
                      performance.bookings.push({event:req.params.id, subscription_id:program._id});
                      performance.save(function(err){
                        if (err) {
                          logger.info(`${JSON.stringify(err)}`);
                          res.status(404).send({ message: err });
                        } else {
                          req.params.sez = 'events';
                          req.params.form = 'program';
                          router.getData(req, res, "json");
                        }
                      });
                    });
                  }
                });
              });
            }
          });
        } else {
          res.status(404).send({
            "message": "PERFORMANCE_IS_ALREADY_IN",
            "name": "MongoError",
            "stringValue":"\"PERFORMANCE_IS_ALREADY_IN\"",
            "kind":"Date",
            "value":null,
            "path":"id",
            "reason":{
              "message":"PERFORMANCE_IS_ALREADY_IN",
              "name":"MongoError",
              "stringValue":"\"PERFORMANCE_IS_ALREADY_IN\"",
              "kind":"string",
              "value":null,
              "path":"id"
            }
          });
        }
      });
    }
  });
}

router.eventRemovePerformance = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};

  Models['Event']
  .findOne(query)
  .select({_id:1, program:1,})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!item) {
      res.status(404).send({
        "message": "PERFORMANCE_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"PERFORMANCE_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"PERFORMANCE_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"PERFORMANCE_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (item.program.map((item)=>{return item.performance.toString()}).indexOf(req.params.performance)===-1) {
      res.status(404).send({
        "message": "PERFORMANCE_IS_NOT_IN",
        "name": "MongoError",
        "stringValue":"\"PERFORMANCE_IS_NOT_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"PERFORMANCE_IS_NOT_IN",
          "name":"MongoError",
          "stringValue":"\"PERFORMANCE_IS_NOT_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      item.program.splice(item.program.map((item)=>{return item.performance.toString()}).indexOf(req.params.performance), 1);
      //res.json(item);
      item.save(function(err){
        if (err) {
          logger.info(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          var query = {_id: req.params.performance};
          var select = {_id:1, bookings:1}
          //select[req.params.sez] = 1;
          Models["Performance"]
          .findOne(query)
          .select(select)
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, performance) => {
            performance.bookings.splice(performance.bookings.map((item)=>{return item.event.toString()}).indexOf(req.params.id), 1);
            performance.save(function(err){
              if (err) {
                logger.info(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                query = {performance: req.params.performance, event: req.params.id};
                Models["Program"]
                .findOneAndRemove(query, function (err, program) {
                  if (err) {
                    logger.info(`${JSON.stringify(err)}`);
                    res.status(404).send({ message: err });
                  } else {
                    req.params.sez = 'events';
                    req.params.form = 'program';
                    router.getData(req, res, "json");            
                  }
                });
              }
            });
          });
        }
      });
    }
  });
}

router.performanceAddEvent = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};

  Models['Performance']
  .findOne(query)
  .select({_id:1, title:1, stats:1, bookings:1})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!item) {
      res.status(404).send({
        "message": "PERFORMANCE_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"PERFORMANCE_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"PERFORMANCE_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"PERFORMANCE_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (item.bookings.map((item)=>{return item.event.toString()}).indexOf(req.params.event)!==-1) {
      res.status(404).send({
        "message": "EVENT_IS_ALREADY_IN",
        "name": "MongoError",
        "stringValue":"\"EVENT_IS_ALREADY_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"EVENT_IS_ALREADY_IN",
          "name":"MongoError",
          "stringValue":"\"EVENT_IS_ALREADY_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      item.bookings.push({event:req.params.event});
      item.save(function(err){
        if (err) {
          logger.info(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          var query = {_id: req.params.event};
          var select = {_id:1, program:1}
          Models["Event"]
          .findOne(query)
          .select(select)
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, event) => {
            event.program.push({performance:req.params.id});
            event.save(function(err){
              if (err) {
                logger.info(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                query = {event: req.params.event, performance: req.params.id};
                Models["Program"]
                .findOne(query)
                .exec((err, program) => {
                  if (!program) {
                    program = {};
                    program.performance = req.params.id;
                    program.reference = req.user._id;
                    program.event = req.params.event;
                    program.status = "5be8708afc39610000000013";
                    Models["Program"]
                    .create(program, function (err, program) {
                      if (err) {
                        logger.info(`${JSON.stringify(err)}`);
                        res.status(404).send({ message: err });
                      } else {
                        req.params.sez = 'events';
                        req.params.form = 'program';
                        router.getData(req, res, "json");            
                      }
                    });
                  } else {
                    req.params.sez = 'events';
                    req.params.form = 'program';
                    router.getData(req, res, "json");            
                  }
                });
              }
            });
          });
        }
      });
    }
  });
}

router.performanceRemoveEvent = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};

  Models['Performance']
  .findOne(query)
  .select({_id:1, bookings:1,})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!item) {
      res.status(404).send({
        "message": "PERFORMANCE_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"PERFORMANCE_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"PERFORMANCE_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"PERFORMANCE_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (item.bookings.map((item)=>{return item.event.toString()}).indexOf(req.params.event)===-1) {
      res.status(404).send({
        "message": "EVENT_IS_NOT_IN",
        "name": "MongoError",
        "stringValue":"\"EVENT_IS_NOT_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"EVENT_IS_NOT_IN",
          "name":"MongoError",
          "stringValue":"\"EVENT_IS_NOT_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      item.bookings.splice(item.bookings.map((item)=>{return item.event.toString()}).indexOf(req.params.event), 1);
      //res.json(item);
      item.save(function(err){
        if (err) {
          logger.info(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          var query = {_id: req.params.event};
          var select = {_id:1, program:1}
          //select[req.params.sez] = 1;
          Models["Event"]
          .findOne(query)
          .select(select)
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, event) => {
            event.program.splice(event.program.map((item)=>{return item.performance.toString()}).indexOf(req.params.id), 1);
            event.save(function(err){
              if (err) {
                logger.info(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                query = {event: req.params.event, performance: req.params.id};
                Models["Program"]
                .findOneAndRemove(query, function (err, program) {
                  if (err) {
                    logger.info(`${JSON.stringify(err)}`);
                    res.status(404).send({ message: err });
                  } else {
                    req.params.sez = 'events';
                    req.params.form = 'program';
                    router.getData(req, res, "json");            
                  }
                });
              }
            });
          });
        }
      });
    }
  });
}

router.getCountries = (req, res) => {
  res.json(helpers.getCountries());
}

router.setStatsAndActivity = (req, res) => {
  var promises = [];
  promises.push(helpers.setStatsAndActivitySingle({_id: req.params.id}));
  Promise.all(
    promises
  ).then( (resultsPromise) => {
    setTimeout(function() {
      //logger.info('resultsPromise');
      //logger.info(resultsPromise);
      //resolve(resultsPromise);
      res.json(resultsPromise);
    }, 1000);
  });
}

router.sendEmailVerification = (req, res) => {
  logger.info("sendEmailVerification");
  logger.info(req.headers.host);
  //import uid from 'uuid';
  //import mongoose from 'mongoose';
  const User = mongoose.model('User');
  //User.findOne({"emails.email": req.params.email}, "emails", (err, user) => {
  User.findOne({"_id": req.user._id}, "emails", (err, user) => {
    if (err) { 
      logger.info("MAIL SEARCH ERROR");
      res.json({error: true, msg: __("MAIL SEARCH ERROR")});
    } else if (!user) {
      logger.info("USER NOT FOUND");     
      res.json({error: true, msg: __("USER NOT FOUND")});
    } else if (req.user._id.toString() !== user._id.toString() /*&& !req.user.is_admin*/) {
      logger.info("EMAIL IS NOT YOUR");     
      res.json({error: true, msg: __("EMAIL IS NOT YOUR")});
    } else {
      logger.info("Email OK");
      let nothingToDo = true;
      if (user.emails.map(item => {return item.email}).indexOf(req.params.email)===-1) {
        user.emails.push({
          "is_public": false,
          "is_primary": false,
          "is_confirmed": false,
          "email": req.params.email,
        });
      }
      for(let item=0;item<user.emails.length;item++) {
        if (user.emails[item].email === req.params.email && !user.emails[item].is_confirmed) {
          nothingToDo = false;
          const mailer = require('../../../utilities/mailer');
          user.emails[item].confirm = setIdentifier();
          logger.info(user.emails[item]);
          logger.info(user);
          user.save((err) => {
            if (err) {
              logger.info("Save failuresssss");
              logger.info(err);
              res.json({error: true, msg: __(err.message)});
            } else {
              logger.info("Save success");
              logger.info("mySendMailer");
              mailer.mySendMailer({
                template: 'confirm-email',
                message: {
                  to: user.emails[item].email
                },
                email_content: {
                  site:    (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/+"://"+req.headers.host,
                  title:    __("Email Confirm"),
                  subject:  __("Email Confirm")+' | AVnode.net',
                  block_1:  __("We’ve received a request to add this new email")+": "+user.emails[item].email,
                  button:   __("Click here to confirm"),
                  block_2:  __("If you didn’t make the request, just ignore this message. Otherwise, you add the email using this link:"),
                  block_3:  __("Thanks."),
                  link:     (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/+"://"+req.headers.host+'/verify/email/'+user.emails[item].confirm,
                  html_sign: "The AVnode.net Team",
                  text_sign:  "The AVnode.net Team"
                }
              }, function (err){
                if (err) {
                  logger.info("Email sending failure");
                  logger.info(err);
                  res.json({error: true, msg: __("Confirmation email sending failure, please try later"), err: err});
                } else {
                  logger.info("Email sending OK");
                  res.json({error: false, msg: __("Confirmation Email sending success, please check your inbox and confirm")});
                }
              });
            }
          });
        }
      }
      if(nothingToDo) {
        logger.info("Nothing to do");
        res.json({error: true, msg: "Nothing to do"});          
      }
    }
  });
}


router.addGallery = (req, res) => {
  logger.info("addGallery");
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  if (req.params.sez == "events" || req.params.sez == "performances") {
    let model = req.params.sez == "events" ? Models['Event'] : Models['Performance'];
    model
    .findOne(query)
    .select({_id:1, title:1, stats:1, galleries:1})
    //.populate({ "path": "users", "select": "stagename", "model": "User"})
    .exec((err, item) => {
      logger.info("addGallery");
      logger.info(item);
      if (err) {
        logger.info(`${JSON.stringify(err)}`);
        res.status(404).send({ message: err });
      } else if (!item) {
        res.status(404).send({
          "message": "USER_NOT_ALLOWED_TO_EDIT",
          "name": "MongoError",
          "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
          "kind":"Date",
          "value":null,
          "path":"id",
          "reason":{
            "message":"USER_NOT_ALLOWED_TO_EDIT",
            "name":"MongoError",
            "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
            "kind":"string",
            "value":null,
            "path":"id"
          }
        });
      } else if (item.galleries.map((item)=>{return item.toString()}).indexOf(req.params.gallery)!==-1) {
        res.status(404).send({
          "message": "GALLERY_IS_ALREADY_IN",
          "name": "MongoError",
          "stringValue":"\"GALLERY_IS_ALREADY_IN\"",
          "kind":"Date",
          "value":null,
          "path":"id",
          "reason":{
            "message":"GALLERY_IS_ALREADY_IN",
            "name":"MongoError",
            "stringValue":"\"GALLERY_IS_ALREADY_IN\"",
            "kind":"string",
            "value":null,
            "path":"id"
          }
        });
      } else {
        item.galleries.push(req.params.gallery);
        item.save(function(err){
          if (err) {
            logger.info(`${JSON.stringify(err)}`);
            res.status(404).send({ message: err });
          } else {
            var query = {_id: req.params.gallery};
            var select = {_id:1}
            select[req.params.sez] = 1
            Models["Gallery"]
            .findOne(query)
            .select(select)
            //.populate({ "path": "members", "select": "addresses", "model": "User"})
            .exec((err, gallery) => {
              if (!gallery[req.params.sez]) gallery[req.params.sez] = [];
              gallery[req.params.sez].push(req.params.id);
              gallery.save(function(err){
                if (err) {
                  logger.info(`${JSON.stringify(err)}`);
                  res.status(404).send({ message: err });
                } else {
                  //req.params.sez = 'events';
                  req.params.form = 'galleries';
                  router.getData(req, res, "json");            
                }
              });
            });
          }
        });
      }
    });
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

router.removeGallery = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  if (req.params.sez == "events" || req.params.sez == "performances") {
    let model = req.params.sez == "events" ? Models['Event'] : Models['Performance'];
    model
    .findOne(query)
    .select({_id:1, galleries:1,})
    //.populate({ "path": "users", "select": "stagename", "model": "User"})
    .exec((err, item) => {
      if (err) {
        logger.info(`${JSON.stringify(err)}`);
        res.status(404).send({ message: err });
      } else if (!item) {
        res.status(404).send({
          "message": "USER_NOT_ALLOWED_TO_EDIT",
          "name": "MongoError",
          "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
          "kind":"Date",
          "value":null,
          "path":"id",
          "reason":{
            "message":"USER_NOT_ALLOWED_TO_EDIT",
            "name":"MongoError",
            "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
            "kind":"string",
            "value":null,
            "path":"id"
          }
        });
      } else if (item.galleries.map((item)=>{return item.toString()}).indexOf(req.params.gallery)===-1) {
        res.status(404).send({
          "message": "GALLERY_IS_NOT_IN",
          "name": "MongoError",
          "stringValue":"\"GALLERY_IS_NOT_IN\"",
          "kind":"Date",
          "value":null,
          "path":"id",
          "reason":{
            "message":"GALLERY_IS_NOT_IN",
            "name":"MongoError",
            "stringValue":"\"GALLERY_IS_NOT_IN\"",
            "kind":"string",
            "value":null,
            "path":"id"
          }
        });
      } else {
        item.galleries.splice(item.galleries.map((item)=>{return item.toString()}).indexOf(req.params.gallery), 1);
        //res.json(item);
        item.save(function(err){
          if (err) {
            logger.info(`${JSON.stringify(err)}`);
            res.status(404).send({ message: err });
          } else {
            var query = {_id: req.params.gallery};
            var select = {_id:1, events:1}
            //select[req.params.sez] = 1;
            Models["Gallery"]
            .findOne(query)
            .select(select)
            //.populate({ "path": "members", "select": "addresses", "model": "User"})
            .exec((err, gallery) => {
              gallery.events.splice(gallery.events.map((item)=>{return item.toString()}).indexOf(req.params.id), 1);
              gallery.save(function(err){
                if (err) {
                  logger.info(`${JSON.stringify(err)}`);
                  res.status(404).send({ message: err });
                } else {
                  //req.params.sez = 'events';
                  req.params.form = 'galleries';
                  router.getData(req, res, "json");            
                }
              });
            });
          }
        });
      }
    });
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

router.addVideo = (req, res) => {
  logger.info("addVideo");
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  if (req.params.sez == "events" || req.params.sez == "performances") {
    let model = req.params.sez == "events" ? Models['Event'] : Models['Performance'];
    model
    .findOne(query)
    .select({_id:1, title:1, stats:1, videos:1})
    //.populate({ "path": "users", "select": "stagename", "model": "User"})
    .exec((err, item) => {
      logger.info("addVideo");
      logger.info(item);
      if (err) {
        logger.info(`${JSON.stringify(err)}`);
        res.status(404).send({ message: err });
      } else if (!item) {
        res.status(404).send({
          "message": "USER_NOT_ALLOWED_TO_EDIT",
          "name": "MongoError",
          "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
          "kind":"Date",
          "value":null,
          "path":"id",
          "reason":{
            "message":"USER_NOT_ALLOWED_TO_EDIT",
            "name":"MongoError",
            "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
            "kind":"string",
            "value":null,
            "path":"id"
          }
        });
      } else if (item.videos.map((item)=>{return item.toString()}).indexOf(req.params.video)!==-1) {
        res.status(404).send({
          "message": "VIDEO_IS_ALREADY_IN",
          "name": "MongoError",
          "stringValue":"\"VIDEO_IS_ALREADY_IN\"",
          "kind":"Date",
          "value":null,
          "path":"id",
          "reason":{
            "message":"VIDEO_IS_ALREADY_IN",
            "name":"MongoError",
            "stringValue":"\"VIDEO_IS_ALREADY_IN\"",
            "kind":"string",
            "value":null,
            "path":"id"
          }
        });
      } else {
        item.videos.push(req.params.video);
        item.save(function(err){
          if (err) {
            logger.info(`${JSON.stringify(err)}`);
            res.status(404).send({ message: err });
          } else {
            var query = {_id: req.params.video};
            var select = {_id:1}
            select[req.params.sez] = 1
            Models["Video"]
            .findOne(query)
            .select(select)
            //.populate({ "path": "members", "select": "addresses", "model": "User"})
            .exec((err, video) => {
              if (!video[req.params.sez]) video[req.params.sez] = [];
              video[req.params.sez].push(req.params.id);
              video.save(function(err){
                if (err) {
                  logger.info(`${JSON.stringify(err)}`);
                  res.status(404).send({ message: err });
                } else {
                  req.params.form = 'videos';
                  router.getData(req, res, "json");            
                }
              });
            });
          }
        });
      }
    });
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

router.removeVideo = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  let model;
  if (req.params.sez == "events" || req.params.sez == "performances") {
    model = req.params.sez == "events" ? Models['Event'] : Models['Performance'];
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
  logger.info(model);
  model
  .findOne(query)
  .select({_id:1, videos:1})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    logger.info(req.params.video)
    logger.info(item.videos)
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!item) {
      res.status(404).send({
        "message": "USER_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (item.videos.map((item)=>{return item.toString()}).indexOf(req.params.video)===-1) {
      res.status(404).send({
        "message": "VIDEO_IS_NOT_IN",
        "name": "MongoError",
        "stringValue":"\"VIDEO_IS_NOT_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"VIDEO_IS_NOT_IN",
          "name":"MongoError",
          "stringValue":"\"VIDEO_IS_NOT_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      item.videos.splice(item.videos.map((item)=>{return item.toString()}).indexOf(req.params.video), 1);
      //res.json(item);
      item.save(function(err){
        if (err) {
          logger.info(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          var query = {_id: req.params.video};
          var select = {_id:1, events:1}
          //select[req.params.sez] = 1;
          Models["Video"]
          .findOne(query)
          .select(select)
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, video) => {
            video.events.splice(video.events.map((item)=>{return item.toString()}).indexOf(req.params.id), 1);
            video.save(function(err){
              if (err) {
                logger.info(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                //req.params.sez = 'events';
                req.params.form = 'videos';
                router.getData(req, res, "json");            
              }
            });
          });
        }
      });
    }
  });
}

router.eventGetFreezed = (req, res) => {
  console.log("eventGetFreezed")
  var populate = [
    { 
      "path": "program.performance", "select": "id title image slug duration price paypal users is_public stats abouts galleries videos bookings", "model": "Performance",  
      "populate": [
        { "path": "users", "select": "stagename slug stats addresses members organizationData gender image abouts web social performances", "model": "UserShow"/* , "populate": [
          { "path": "performances", "select": "title slug image users", "model": "Performance", "populate": [
            { "path": "users", "select": "stagename slug stats addresses members organizationData gender image abouts web social performances", "model": "UserShow"},
            { "path": "bookings", "populate":{ "path": "performance", "select": "title slug image users", "model": "Performance"}}
          ]}
        ] */},
        { "path": "bookings", "populate":{ "path": "performance", "select": "title slug image users", "model": "Performance"}},
        { "path": "galleries", "select": "title slug image medias", "model": "Gallery"},
        { "path": "videos", "select": "title slug image media", "model": "Video"},
        { "path": "type", "select": "name slug", "model": "Category"},
        { "path": "tecnique", "select": "name slug", "model": "Category"},
        { "path": "genre", "select": "name slug", "model": "Category"}
      ]
    },
    { "path": "program.schedule.categories", "select": "name"}
  ];
  //console.log()
  Models.EventShow.findOneAndUpdate({_id: req.params.id}, {is_freezed: false}, {upsert: true, useFindAndModify: false}, function(err, doc) {
    if (err) {
      res.status(404).send({ message: err });
    } else {
      Models.EventShow.
      //find({"users": req.params.id}).
      findOne({_id: req.params.id}).
      select({title: 1, slug: 1, program: 1, is_freezed: 1, program_freezed: 1, galleries: 1, videos: 1, partners: 1}).
      populate(populate).
      //sort({title: 1}).
      //select({stagename: 1, createdAt: 1, crews:1}).
      //exec((err, events) => {
      exec((err, event) => {
        console.log("program_freezed")
        console.log(event.advanced.menu);
        console.log("program_freezed")
       /*  console.log("program_freezed")
        console.log(event.is_freezed)
        console.log(event.advanced.performers) */
        //event.is_freezed = true;
        //2event.program_freezed = JSON.parse(JSON.stringify(event.advanced));
        /* event.program_freezed.programmenotscheduled.forEach(function (item) {
          item.id = item._id;
          delete item._id;
        }); */

        Models.EventShow.findOneAndUpdate({_id: req.params.id}, {program_freezed: JSON.parse(JSON.stringify(event.advanced))}, {upsert: true, useFindAndModify: false}, function(err, doc) {
          if (err) {
            res.status(404).send({ message: err });
          } else {
            Models.EventShow.findOneAndUpdate({_id: req.params.id}, {is_freezed: true}, {upsert: true, useFindAndModify: false}, function(err, doc) {
              if (err) {
                res.status(404).send({ message: err });
              } else {
                res.send({ message: __("FREEZING SUCCESS") });
              }
            });
          }
          // saved!
        });
      });
    }
  });
}

router.getPartners = async (req, res) => {
  logger.info('/organizations/'+req.params.id);
  logger.info(req.user.crews.map(item => {return item._id}));
  var crews = req.user.crews.map(item => {return item._id});
  let categories = await Models.Category.
  find({ancestor: "5be8708afc396100000001eb"}).
  lean().
  exec();
  var populate = [
    {path: "users", select: {stagename:1}, model:"UserShow"},
    {path: "partners.users", select: {stagename:1}, model:"UserShow"},
    {path: "partners.category", select: {name:1, slug:1}, model:"Category"}
  ];
  let event = await Models.Event.
  //find({"users": req.params.id}).
  findOne({_id: req.params.id}).
  populate(populate).
  select({title: 1, slug: 1, partners:1, users:1}).
  //sort({title: 1}).
  //select({stagename: 1, createdAt: 1, crews:1}).
  //exec((err, events) => {
  exec();
  var populate = [
    { "path": "partners.partner", "select": "stagename", "model": "User"}
  /* 
    {path: "members", select: {stagename:1, gender:1, name:1, surname:1, email:1, emails:1, phone:1, mobile:1, lang:1, skype:1, slug:1, social:1, web:1}, model:"UserShow"},
    {path: "partnerships", select: {title:1, slug:1}, model:"EventShow"},
    {path: "partnerships.category", select: {name:1, slug:1}, model:"Category"}
  */];
  //const query = {"partner_owner.owner": {$in: event.users.map(item =>{return item._id})}};
  const query = {"_id": {$in: event.users.map(item =>{return item._id})}};
  let data = await Models.User.
  find(query).
  lean().
  sort({stagename: 1}).
  populate(populate).
  exec();
  var partners = []
  for (var item in data) {
    partners = partners.concat(data[item].partners);
  }   
  if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
    res.json(data);
  } else {
    var partnerships = event.partners.slice(0);
    var notassigned = [];
    var notassignedID = [];
    var partnersID = [];

    for (var item=0; item<partnerships.length; item++) partnersID = partnersID.concat(partnerships[item].users.map(item => {return item._id.toString()}));
    for (var item in partners) {
      if (partners[item] && partners[item].is_active && partners[item].is_selecta && partners[item].partner) {
        if (partnersID.indexOf(partners[item].partner._id.toString())===-1) {
          if (notassignedID.indexOf(partners[item].partner._id.toString())===-1) {
            notassignedID.push(partners[item].partner._id.toString());
            notassigned.push(partners[item].partner);
          }
        }
      } else {
        logger.info(partners[item]);
      }
    }
    notassigned.sort((a,b)=>{
      if ( a.stagename < b.stagename ){
        return -1;
      }
      if ( a.stagename > b.stagename ){
        return 1;
      }
      return 0;
    });
    var existingCat = partnerships.map(item => {return item.category._id.toString()});
    var pp = partnerships.map(item => {return item});
    
    for (var item in categories) {
      if (existingCat.indexOf(categories[item]._id.toString())===-1) pp.push({category:categories[item], users:[]});
    }
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      res.render('admin/events_partners', {
        title: 'Partners',
        currentUrl: req.originalUrl,
        hide: req.query.hide ? req.query.hide : [],
        owner: crews,
        get: req.params,
        body: req.body,
        //events: events,
        notassigned: notassigned,
        data: event,
        //events: events,
        event: event,
        partnerships: pp,
        script: false
      });
    }
  }
}

/*
router.addVideos = (req, res) => {
  Models[req.params.model]
  .findOne({_id: req.params.id},'_id, videos', (err, result) => {
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!result) {
      res.status(404).send({
        "message": "USER_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      Models.Video
      .create({slug:req.body.slug, slug:req.body.title}, (err, data) => {
        if (err) {
          logger.info(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          result.videos.push(data._id);
          result.save(function(err){
            //res.json(result);
            res.json(data);
          });
        }
      });
    }
  });
}

  let mailinglists = [];

          for (mailinglist in user.emails[item].mailinglists) if (user.emails[item].mailinglists[mailinglist]) mailinglists.push(mailinglist);

          let formData = {
            list: 'AXRGq2Ftn2Fiab3skb5E892g',
            api_key: process.env.SENDYAPIKEY,
            email: user.emails[item].email,
            Topics: mailinglists.join(','),
            avnode_id: user._id.toString(),
            flxer_id: user.old_id ? user.old_id : "avnode",
          };
          if (user.name) formData.Name = user.name;
          if (user.surname) formData.Surname = user.surname;
          if (user.stagename) formData.Stagename = user.stagename;
          if (user.addresses && user.addresses[0] && user.addresses[0].locality) formData.Location = user.addresses[0].locality;
          if (user.addresses && user.addresses[0] && user.addresses[0].country) formData.Country = user.addresses[0].country;
          if (user.addresses && user.addresses[0] && user.addresses[0].geometry && user.addresses[0].geometry.lat) formData.LATITUDE = user.addresses[0].geometry.lat;
          if (user.addresses && user.addresses[0] && user.addresses[0].geometry && user.addresses[0].geometry.lng) formData.LONGITUDE = user.addresses[0].geometry.lng;

          request.post({
            url: 'https://ml.avnode.net/subscribe',
            formData:formData,
            function (error, response, body) {
              logger.info("Newsletter");
              logger.info(error);
              logger.info(body);
            }
          });
          //logger.info(mailinglists.join(','));
 */

/**/

/*

const profilePublic = require('./api/profilePublic');
const profileImages = require('./api/profileImages');
const profileEmails = require('./api/profileEmails');
const profilePrivate = require('./api/profilePrivate');
const profilePassword = require('./api/profilePassword');


router.get('/countries', (req, res) => {
  // FIXME: Later evaluate language param to return
  // localized list depending on the user settings.
  const convert = R.compose(
    R.map(
      R.zipObj(['key', 'name'])
    ),
    R.toPairs
  );

  allCountries('en', (err, countries) => {
    if (err) {
      throw err;
    }
    res.json(convert(countries));
  });
});
*/
export default router;
