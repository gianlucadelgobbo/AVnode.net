const router = require('../../router')();
let config = require('getconfig');
let helpers = require('./helpers');

const mongoose = require('mongoose');
const Models = {
  'Category': mongoose.model('Category'),
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Video': mongoose.model('Video'),
  'VenueDB': mongoose.model('VenueDB'),
  'AddressDB': mongoose.model('AddressDB'),
  'Program': mongoose.model('Program')
}
const logger = require('../../../utilities/logger');

router.getDuplicate = (req, res) => {
  logger.debug("getDuplicate");
  logger.debug(req.params);
  logger.debug(req.query);
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
                      logger.debug(partners);
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
                  logger.debug("getDelete 2");
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
                      logger.debug("getDelete 3");
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
                        logger.debug("getDelete 4");
                        let errors = [];
                        if (data.bookings && data.bookings.length) errors.push({error:"Performace is booked and can not be deleted", bookings: data.bookings});
                        if (data.galleries && data.galleries.length) errors.push({error:"Performace own galleries and can not be deleted", galleries: data.galleries});
                        if (data.videos && data.videos.length) errors.push({error:"Performace own videos and can not be deleted", videos: data.videos});
                        res.json(errors);
                      }
                    break;
                    case "profile" :
                      logger.debug("getDelete 3");
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
                        logger.debug("getDelete 4");
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
  logger.debug("getDelete");
  logger.debug(req.params.sez);
  logger.debug(config.cpanel[req.params.sez].model);
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
              logger.debug("getDelete 2");
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
                  logger.debug("getDelete 3");
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
                    logger.debug("getDelete 4");
                    let errors = [];
                    if (data.bookings && data.bookings.length) errors.push({error:"Performace is booked and can not be deleted", bookings: data.bookings});
                    if (data.galleries && data.galleries.length) errors.push({error:"Performace own galleries and can not be deleted", galleries: data.galleries});
                    if (data.videos && data.videos.length) errors.push({error:"Performace own videos and can not be deleted", videos: data.videos});
                    res.json(errors);
                  }
                break;
                case "profile" :
                  if (!data.activity || data.activity === 0) {
                    logger.debug("getDelete 3");
                    if (data.is_crew == 1) {
                      logger.debug("getDelete 4");
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
                      logger.debug("getDelete 6");
                      results.User = await Models["User"].deleteOne( {_id: data._id});
                      var promises = [];
                      Promise.all(
                        promises
                      ).then( (resultsPromise) => {
                        results.setStatsAndActivity = resultsPromise;
                        res.json(results);
                      });
                    } else {
                      logger.debug("getDelete 7");
                      let errors = [];
                      if (data.videos && data.videos.length) errors.push({error:"Error", videos: data.videos});
                      res.json(errors);
                    }
                  } else {
                    logger.debug("getDelete 8");
                    let errors = [];
                    if (data.activity != 0) errors.push({error:"User is involved in some activities and can not be deleted", activity: data.activity});
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
      router.getData(req, res);
    });
  });

/*   Models[config.cpanel[req.params.sez].model].update( query , { $pull: {"medias": {"slug": req.params.image } } }, function(err){
    req.params.form = 'public';
    router.getData(req, res);
  }); */

}
  
router.removeFootage = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.members = req.user._id;
  logger.debug(query);
  Models["Playlist"]
  .findOne(query)
  .select({_id:1, title:1, stats:1, footage:1})
  .populate({ "path": "footage", "select": "title", "model": "Footage"})
  .exec((err, playlist) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      res.status(404).send({ message: err });
    } else if (!playlist) {
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
    } else if (playlist.footage.map((item)=>{return item._id.toString()}).indexOf(req.params.footage)===-1) {
      res.status(404).send({
        "message": "FOOTAGE_IS_NOT_IN_THE_PLAYLIST",
        "name": "MongoError",
        "stringValue":"\"FOOTAGE_IS_NOT_IN_THE_PLAYLIST\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"FOOTAGE_IS_NOT_IN_THE_PLAYLIST",
          "name":"MongoError",
          "stringValue":"\"FOOTAGE_IS_NOT_IN_THE_PLAYLIST\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (playlist.footage.length===1) {
      res.status(404).send({
        "message": "AT_LEAST_ONE_FOOTAGE_IS_REQUIRED",
        "name": "MongoError",
        "stringValue":"\"AT_LEAST_ONE_FOOTAGE_IS_REQUIRED\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"AT_LEAST_ONE_FOOTAGE_IS_REQUIRED",
          "name":"MongoError",
          "stringValue":"\"AT_LEAST_ONE_FOOTAGE_IS_REQUIRED\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      playlist.footage.splice(playlist.footage.map((item)=>{return item._id.toString()}).indexOf(req.params.footage), 1);
      logger.debug("playlist.footage");
      logger.debug(playlist.footage);
      logger.debug(playlist.footage.length);
      playlist.stats.footage = playlist.footage.length;

      playlist.save(function(err){
        if (err) {
          logger.debug(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          var query = {_id: req.params.footage};
          Models["Footage"]
          .findOne(query)
          .select({_id:1, stats:1, playlists:1})
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, footage) => {
            footage.playlists.splice(footage.playlists.indexOf(req.params.id), 1);
            logger.debug("footage.playlists");
            logger.debug(footage.playlists);
            logger.debug(footage.playlists.length);
            footage.stats.playlists = footage.playlists.length;
            footage.save(function(err){
              if (err) {
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                req.params.sez = 'playlists';
                req.params.form = 'public';
                router.getData(req, res);
              }
            });
          });
        }
      });
    }
  });
}

router.getSubscriptions = (req, res) => {
  logger.debug("getSubscriptions");
  logger.debug(req.params.id);
  if (config.cpanel[req.params.sez] && req.params.id) {
    //const select = req.query.pure ? config.cpanel[req.params.sez].list.select : Object.assign(config.cpanel[req.params.sez].list.select, config.cpanel[req.params.sez].list.selectaddon);
    const select = config.cpanel[req.params.sez].list.select;
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].list.populate;
    populate.push({ "path": "event", "select": "title slug schedule organizationsettings", "model": "Event", "populate":[{"path": "organizationsettings.call.calls.admitted", "select": "name slug", "model": "Category"}]});
    //const ids = [req.params.id].concat(req.user.crews);
    const query = {"reference" :  req.params.id};
    logger.debug(query);
    logger.debug(select);
    logger.debug(populate);
    Models["Program"]
    .find(query)
    .select(select)
    .populate(populate)
    .sort({createdAt:-1})
    .exec((err, data) => {
      logger.debug(data);
      if (err) {
        res.status(500).send({ message: `${JSON.stringify(err)}` });
      } else {
        if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
          res.json(data);
        } else {
          res.render('admin/subscriptions', {
            title: 'Subscriptions',
            paypal: true,
            currentUrl: req.originalUrl,
            
            data: data,
            script: false
          });
        }
      }
    });
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

router.getList = (req, res) => {
  if (config.cpanel[req.params.sez] && req.params.id) {
    const select = req.query.pure ? config.cpanel[req.params.sez].list.select : Object.assign(config.cpanel[req.params.sez].list.select, config.cpanel[req.params.sez].list.selectaddon);
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].list.populate;
    const ids = [req.params.id].concat(req.user.crews);
    const query = req.params.sez == "crews" ? {members: req.params.id} : {users:{$in: ids}};

    Models[config.cpanel[req.params.sez].list.model]
    .find(query)
    .select(select)
    .populate(populate)
    .sort({createdAt:-1})
    .exec((err, data) => {
      if (err) {
        res.status(500).send({ message: `${JSON.stringify(err)}` });
      } else {
        let send = JSON.parse(JSON.stringify(req.user));
        send[req.params.sez] = data;
        //for (const item in config.cpanel[req.params.sez].list.select) send[item] = data[item];
        res.json(send);
      }
    });
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

router.getData = (req, res) => {
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms[req.params.form]) {
    const id = req.params.id;
    const select = req.query.pure ? config.cpanel[req.params.sez].forms[req.params.form].select : Object.assign(config.cpanel[req.params.sez].forms[req.params.form].select, config.cpanel[req.params.sez].forms[req.params.form].selectaddon);
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].forms[req.params.form].populate;
    Models[config.cpanel[req.params.sez].model]
    .findById(id)
    .select(select)
    .populate(populate)
    .exec((err, data) => {
      if (err) {
        res.status(404).send({ message: `${JSON.stringify(err)}` });
      } else {
        if (!data) {
          res.status(404).send({ message: `DOC_NOT_FOUND` });
        } else {
          console.log("stocazzo")
          console.log(helpers.editable(req, data, id))
          if (helpers.editable(req, data, id)) {
            let send = {_id: data._id};
            for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) send[item] = data[item];
            res.json(send);
          } else {
            console.log("stocazzoaaaaaa")
            res.status(404).send({ message: `DOC_NOT_OWNED` });
          }
        }
      }
    });
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

router.getOwnresIds = (req, res,cb) => {
  Models.User
  .findById(req.params.id)
  .select({crews:1})
  .exec((err, data) => {
    if (data._id) data.crews.push(data._id);
    cb(data.crews);
  });
}

router.getSlug = (req, res) => {
  Models[config.cpanel[req.params.sez].model]
  .findOne({ slug : req.params.slug },'_id', (err, user) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    res.json({slug:req.params.slug,exist:user!==null?true:false});
  });
}

router.getEmail = (req, res) => {
  Models["User"]
  .findOne({ $or : [{ "email" : req.params.email },{ "emails.email" : req.params.email }] },'_id', (err, user) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    res.json({email:req.params.email,exist:user!==null?true:false});
  });
}

router.getCategoryByAncestor = (cat, cb) => {
  Models.Category.find({ancestor: cat._id})
  .select({name:1 , slug:1})
  .exec( (err, childrens) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    cb(childrens);
  });
}

router.getCategories = (req, res) => {
  if (req.params.rel == "performances" && req.params.q == "type") {
    router.getPerfCategories(req, res);
  } else {
    let conta = 0;
    Models.Category.findOne({slug: req.params.q, rel: req.params.rel })
    .select({name:1 , slug:1})
    .exec( (err, category) => {
      if (err) logger.debug(`${JSON.stringify(err)}`);
      if (category && category._id) {
        router.getCategoryByAncestor(category, (childrens) => {
          if (err) logger.debug(`${JSON.stringify(err)}`);
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

router.getPerfCategories = (req, res) => {
  Models.Category.find({ancestor: "5be8708afc3961000000021c", rel: req.params.rel })
  .select({name:1 , slug:1})
  .exec( (err, genre) => {
    let conta = 0;
    Models.Category.findOne({slug: req.params.q, rel: req.params.rel })
    .select({name:1 , slug:1})
    .exec( (err, category) => {
      if (err) logger.debug(`${JSON.stringify(err)}`);
      if (category && category._id) {
        router.getCategoryByAncestor(category, (childrens) => {
          logger.debug(childrens);
          if (err) logger.debug(`${JSON.stringify(err)}`);
          for (let a=0;a<childrens.length;a++){
            router.getCategoryByAncestor(childrens[a], (childrens2) => {
              for (let b=0;b<childrens2.length;b++) childrens2[b].childrens = genre;
              childrens[a].childrens = childrens2;
              conta++;
              if (childrens.length == conta) {
                category.childrens = childrens;
                let send = {
                  title: category.name,
                  value: category.slug,
                  key: category._id,
                  children:[]
                };
                for(let a=0; a<category.childrens.length;a++){
                  let child = {
                    title: category.childrens[a].name,
                    value: category.childrens[a].slug,
                    key: category.childrens[a]._id,
                    children:[]
                  };
                  for(let b=0; b<category.childrens[a].childrens.length;b++){
                    let childchild = {
                      title: category.childrens[a].childrens[b].name,
                      value: category.childrens[a].childrens[b].slug,
                      key: category.childrens[a].childrens[b]._id,
                      children:[]
                    };
                    for(let c=0; c<category.childrens[a].childrens[b].childrens.length;c++){
                      let childchildchild = {
                        title: category.childrens[a].childrens[b].childrens[c].name,
                        value: category.childrens[a].childrens[b].childrens[c].slug,
                        key: category.childrens[a].childrens[b].childrens[c]._id,
                        children:[]
                      };
                      childchild.children.push(childchildchild);
                    }
                    child.children.push(childchild);
                  }
                  send.children.push(child);
                }
                res.json(send);
              }
            });
          }
      
        });  
      } else {
        res.json(category);
      }    
    });
  });
}

router.getMembers = (req, res) => {
  Models.User
  .find({$or:[
    { slug : { "$regex": req.params.q, "$options": "i" } },
    { stagename : { "$regex": req.params.q, "$options": "i" } },
    { name : { "$regex": req.params.q, "$options": "i" } },
    { surname : { "$regex": req.params.q, "$options": "i" } }
  ],is_crew: false})
  .select({'stagename':1})
  //.select({'_id':1, 'stagename':1, 'name':1, 'surname':1, 'email': 1})
  //.collation({locale: "en" })
  .sort({'stagename': 1})
  .exec((err, users) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    //res.json(users.map(item => {delete item.imageFormats; return item;}));
    let result = [];
    logger.debug(users);
    if (users && users.length) result = users.map(item => {return {_id:item._id, stagename:item.stagename}});
    res.json(result);
  });
}

router.getAuthors = (req, res) => {
  Models.User
  .find({$or:[
    { slug : { "$regex": req.params.q, "$options": "i" } },
    { stagename : { "$regex": req.params.q, "$options": "i" } },
    { name : { "$regex": req.params.q, "$options": "i" } },
    { surname : { "$regex": req.params.q, "$options": "i" } }
  ]},'_id, stagename', (err, users) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    res.json(users);
  });
}

router.removeAddress = (req, res) => {
  if (req.query.db === "users") {
    logger.debug(req.query);
    router.removeAddressUsers(req, res, () => {
      router.removeAddressDB(req, res, () => {
        res.json(req.query);
      });
    });
  }
  if (req.query.db === "venues") {
    logger.debug(req.query);
    router.removeVenueDB(req, res, (newaddr) => {
      logger.debug("newaddr");
      //logger.debug(newaddr);
      router.removeAddressEvents(req, res, newaddr, () => {
        logger.debug("stocazzo END");
        res.json(req.query);
      });
    });
  }
}

router.removeAddressUsers = (req, res, cb) => {
  logger.debug("removeAddressUsers");
  var conta = 0;
  //res.json(req.query);
  Models.User
  .find({"addresses.country": req.query.country, "addresses.locality": req.query.locality},'_id, addresses', (err, users) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    if (users.length) {
      logger.debug("stocazzo");
      for(var a=0;a<users.length;a++){
        for(var b=0;b<users[a].addresses.length;b++){
          if (users[a].addresses[b].country === req.query.country && users[a].addresses[b].locality === req.query.locality) {
            if (req.query.action === "REMOVE") {
              if (req.query.field === "locality") {
                users[a].addresses[b].locality = undefined;
              }
              if (req.query.field === "country") {
                logger.debug("stocazzzooooooooooo USERS");
                logger.debug(users[a]);
                users[a].addresses.splice(b, 1);
                logger.debug(users[a]);
              }
            }
            if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
              users[a].addresses[b][req.query.field] = req.query.new;
            }
          }
        }
        logger.debug("stocazzzooooooooooo USERS");
        logger.debug(users[a]);
        Models.User.updateOne({_id: users[a]._id}, { $set: {addresses: users[a].addresses}}, function(err, res) {
          conta++;
          if (err) {
            logger.debug(err);
          } else {
            logger.debug(res);
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
  logger.debug("removeAddressDB");
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
    if (err) logger.debug(`${JSON.stringify(err)}`);
    if (addresses.length) {
      var b=0;
      if (req.query.action === "REMOVE") {
        if (req.query.field === "locality") {
          addresses[b].locality = undefined;
          logger.debug("stocazzzooooooooooo AddressDB");
          logger.debug(addresses[b]);
          collection.findByIdAndUpdate(addresses[b]._id, { $unset: {locality:1}}, { new: false }, function (err, res) {
            logger.debug(err);
            logger.debug(res);
            if (err && err.code == "11000") {
              collection.deleteOne(q, function (err) {
                if (err) logger.debug(err);
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
            if (err) logger.debug(err);
            cb();
          });
        }
      }
      if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
        var update = {};
        update[req.query.field] = req.query.new;
        collection.findByIdAndUpdate(addresses[b]._id, update, { new: false }, function (err, res) {
          logger.debug(err);
          logger.debug(res);
          if (err && err.code == "11000") {
            collection.deleteOne(q, function (err) {
              if (err) logger.debug(err);
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
  logger.debug("removeAddressEvents");
  var conta = 0;
  Models.Event
  .find({$or: [{"schedule.venue.name": req.query.name, "schedule.venue.location.country": req.query.country, "schedule.venue.location.locality": req.query.locality},{"program.schedule.venue.name": req.query.name}]},{schedule:1,title:1,program:1}, (err, events) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    if (events.length) {
      for(var a=0;a<events.length;a++){
        logger.debug(events[a].title);
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
                  logger.debug("stocazzzooooooooooo events");
                  logger.debug(events[a]);
                  events[a].program.splice(b, 1);
                  logger.debug(events[a]);
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
        logger.debug(set);
        Models.Event.updateOne({_id: events[a]._id}, set, function(err, res) {
          conta++;
          if (err) {
            logger.debug(err);
          } else {
            logger.debug(res);
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
  logger.debug("removeVenueDB");
  var rel;
  var q;
  q = {"name": req.query.name, "country": req.query.country, "locality": req.query.locality};
  Models.VenueDB
  .find(q, (err, addresses) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    if (addresses.length) {
      var b=0;
      /* if (req.query.action === "REMOVE") {
        if (req.query.field === "locality") {
          addresses[b].locality = undefined;
          logger.debug("stocazzzooooooooooo AddressDB");
          logger.debug(addresses[b]);
          Models.VenueDB.findByIdAndUpdate(addresses[b]._id, { $unset: {locality:1}}, { new: false }, function (err, res) {
            logger.debug(err);
            logger.debug(res);
            if (err && err.code == "11000") {
              Models.VenueDB.deleteOne(q, function (err) {
                if (err) logger.debug(err);
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
            if (err) logger.debug(err);
            cb();
          });
        }
      } */
      if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
        var update = {};
        update[req.query.field] = req.query.new;
        logger.debug(update);
        Models.VenueDB.findByIdAndUpdate(addresses[b]._id, update, { new: false }, function (err, res) {
          //logger.debug(err);
          //logger.debug(res);
          if (err && err.code == "11000") {
            Models.VenueDB.deleteOne(q, function (err) {
              if (err) logger.debug(err);
              cb(res);
              // deleted at most one tank document
            });
          } else {
            cb(res);
          }
        });
      }
    } else {
      logger.debug("stocazzostocazzostocazzostocazzostocazzo");
      cb();
    }
  });
}

router.addMember = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.members = req.user._id;
  logger.debug();
  Models["User"]
  .findOne(query)
  .select({_id:1, stats:1, stagename:1, members:1})
  .populate({ "path": "members", "select": "addresses", "model": "User"})
  .exec((err, crew) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
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
      logger.debug("crew.members");
      logger.debug(crew.members);
      logger.debug(crew.members.length);
      crew.stats.members = crew.members.length;
      logger.debug(crew);
      crew.save(function(err){
        var query = {_id: req.params.member};
        Models["User"]
        .findOne(query)
        .select({_id:1, stats:1, crews:1})
        //.populate({ "path": "members", "select": "addresses", "model": "User"})
        .exec((err, member) => {
          if (err) {
            logger.debug(`${JSON.stringify(err)}`);
            res.status(404).send({ message: err });
          } else {
            member.crews.push(req.params.id);
            logger.debug("member.crews");
            logger.debug(member.crews);
            logger.debug(member.crews.length);
            member.stats.crews = member.crews.length;
            member.save(function(err){
              if (err) {
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                req.params.sez = 'crews';
                req.params.form = 'members';
                router.getData(req, res);
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
  logger.debug(query);
  Models["User"]
  .findOne(query)
  .select({_id:1, stagename:1, stats:1, members:1})
  .populate({ "path": "members", "select": "addresses", "model": "User"})
  .exec((err, crew) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
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
      logger.debug("crew.members");
      logger.debug(crew.members);
      logger.debug(crew.members.length);
      crew.stats.members = crew.members.length;

      crew.save(function(err){
        if (err) {
          logger.debug(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          var query = {_id: req.params.member};
          Models["User"]
          .findOne(query)
          .select({_id:1, stats:1, crews:1})
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, member) => {
            member.crews.splice(member.crews.indexOf(req.params.id), 1);
            logger.debug("member.crews");
            logger.debug(member.crews);
            logger.debug(member.crews.length);
            member.stats.crews = member.crews.length;
            member.save(function(err){
              if (err) {
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                req.params.sez = 'crews';
                req.params.form = 'members';
                router.getData(req, res);
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
      logger.debug(`${JSON.stringify(err)}`);
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
          logger.debug(`${JSON.stringify(err)}`);
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
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                Promise.all(
                  [helpers.setStatsAndActivity(query)]
                ).then( (results) => {
                  //res.json(item);
                  req.params.form = 'public';
                  router.getData(req, res);
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
      logger.debug(`${JSON.stringify(err)}`);
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
          logger.debug(`${JSON.stringify(err)}`);
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
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                Promise.all(
                  [helpers.setStatsAndActivity(query)]
                ).then( (results) => {
                  req.params.form = 'public';
                  router.getData(req, res);
                });
              }
            });
          });
        }
      });
    }
  });
}

router.eventAddPerformance = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};

  Models['Event']
  .findOne(query)
  .select({_id:1, title:1, stats:1, program:1})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
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
          logger.debug(`${JSON.stringify(err)}`);
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
                logger.debug(`${JSON.stringify(err)}`);
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
                        logger.debug(`${JSON.stringify(err)}`);
                        res.status(404).send({ message: err });
                      } else {
                        req.params.sez = 'events';
                        req.params.form = 'program';
                        router.getData(req, res);            
                      }
                    });
                  } else {
                    req.params.sez = 'events';
                    req.params.form = 'program';
                    router.getData(req, res);            
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

router.eventRemovePerformance = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};

  Models['Event']
  .findOne(query)
  .select({_id:1, program:1,})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
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
          logger.debug(`${JSON.stringify(err)}`);
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
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                query = {performance: req.params.performance, event: req.params.id};
                Models["Program"]
                .findOneAndRemove(query, function (err, program) {
                  if (err) {
                    logger.debug(`${JSON.stringify(err)}`);
                    res.status(404).send({ message: err });
                  } else {
                    req.params.sez = 'events';
                    req.params.form = 'program';
                    router.getData(req, res);            
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
      logger.debug(`${JSON.stringify(err)}`);
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
          logger.debug(`${JSON.stringify(err)}`);
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
                logger.debug(`${JSON.stringify(err)}`);
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
                        logger.debug(`${JSON.stringify(err)}`);
                        res.status(404).send({ message: err });
                      } else {
                        req.params.sez = 'events';
                        req.params.form = 'program';
                        router.getData(req, res);            
                      }
                    });
                  } else {
                    req.params.sez = 'events';
                    req.params.form = 'program';
                    router.getData(req, res);            
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
      logger.debug(`${JSON.stringify(err)}`);
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
          logger.debug(`${JSON.stringify(err)}`);
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
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                query = {event: req.params.event, performance: req.params.id};
                Models["Program"]
                .findOneAndRemove(query, function (err, program) {
                  if (err) {
                    logger.debug(`${JSON.stringify(err)}`);
                    res.status(404).send({ message: err });
                  } else {
                    req.params.sez = 'events';
                    req.params.form = 'program';
                    router.getData(req, res);            
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
  const allCountries = require('node-countries-list');
  const R = require('ramda');
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
}

router.setStatsAndActivity = (req, res) => {
  var promises = [];
  promises.push(helpers.setStatsAndActivitySingle({_id: req.params.id}));
  Promise.all(
    promises
  ).then( (resultsPromise) => {
    setTimeout(function() {
      //logger.debug('resultsPromise');
      //logger.debug(resultsPromise);
      //resolve(resultsPromise);
      res.json(resultsPromise);
    }, 1000);
  });
}

router.sendEmailVericaition = (req, res) => {
  logger.debug("sendEmailVericaition");
  logger.debug(req.headers.host);
  const uid = require('uuid');
  //const request = require('request');
  const mongoose = require('mongoose');
  const User = mongoose.model('User');
  User.findOne({"emails.email": req.params.email}, "emails", (err, user) => {
    logger.debug(user._id.toString());
    logger.debug(req.params.id);
    if (err) { 
      logger.debug("MAIL SEARCH ERROR");
      res.json({error: true, msg: "MAIL SEARCH ERROR"});
    } else if (!user) {
      logger.debug("USER NOT FOUND");     
      res.json({error: true, msg: "USER NOT FOUND"});
    } else if (req.params.id !== user._id.toString() && !req.user.is_admin) {
      logger.debug("EMAIL IS NOT YOUR");     
      res.json({error: true, msg: "EMAIL IS NOT YOUR"});
    } else {
      logger.debug("Email OK");
      let nothingToDo = true;
      for(let item=0;item<user.emails.length;item++) {
        if (user.emails[item].email === req.params.email && !user.emails[item].is_confirmed) {
          nothingToDo = false;
          const mailer = require('../../../utilities/mailer');
          user.emails[item].confirm = uid.v4();
          logger.debug(user.emails[item]);
          logger.debug(user);
          user.save((err) => {
            if (err) {
              logger.debug("Save failure");
              logger.debug(err);
              res.json({error: true, msg: "Save failure"});
            } else {
              logger.debug("Save success");
              logger.debug("mySendMailer");
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
                  logger.debug("Email sending failure");
                  logger.debug(err);
                  res.json({error: true, msg: "Email sending failure"});
                } else {
                  logger.debug("Email sending OK");
                  res.json({error: false, msg: "Email sending success"});
                }
              });
            }
          });
        }
      }
      if(nothingToDo) {
        logger.debug("Nothing to do");
        res.json({error: true, msg: "Nothing to do"});          
      }
    }
  });
}


router.addGallery = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  if (req.params.sez == "events" || req.params.sez == "performances") {
    let model = req.params.sez == "events" ? Models['Event'] : Models['Performance'];
    model
    .findOne(query)
    .select({_id:1, title:1, stats:1, galleries:1})
    //.populate({ "path": "users", "select": "stagename", "model": "User"})
    .exec((err, item) => {
      if (err) {
        logger.debug(`${JSON.stringify(err)}`);
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
            logger.debug(`${JSON.stringify(err)}`);
            res.status(404).send({ message: err });
          } else {
            var query = {_id: req.params.gallery};
            var select = {_id:1, events:1}
            Models["Gallery"]
            .findOne(query)
            .select(select)
            //.populate({ "path": "members", "select": "addresses", "model": "User"})
            .exec((err, gallery) => {
              gallery.events.push(req.params.id);
              gallery.save(function(err){
                if (err) {
                  logger.debug(`${JSON.stringify(err)}`);
                  res.status(404).send({ message: err });
                } else {
                  req.params.sez = 'events';
                  req.params.form = 'galleries';
                  router.getData(req, res);            
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
        logger.debug(`${JSON.stringify(err)}`);
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
            logger.debug(`${JSON.stringify(err)}`);
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
                  logger.debug(`${JSON.stringify(err)}`);
                  res.status(404).send({ message: err });
                } else {
                  req.params.sez = 'events';
                  req.params.form = 'galleries';
                  router.getData(req, res);            
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
  logger.debug("addVideo");
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  if (req.params.sez == "events" || req.params.sez == "performances") {
    let model = req.params.sez == "events" ? Models['Event'] : Models['Performance'];
    model
    .findOne(query)
    .select({_id:1, title:1, stats:1, videos:1})
    //.populate({ "path": "users", "select": "stagename", "model": "User"})
    .exec((err, item) => {
      logger.debug("addVideo");
      logger.debug(item);
      if (err) {
        logger.debug(`${JSON.stringify(err)}`);
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
            logger.debug(`${JSON.stringify(err)}`);
            res.status(404).send({ message: err });
          } else {
            var query = {_id: req.params.video};
            var select = {_id:1, events:1}
            Models["Video"]
            .findOne(query)
            .select(select)
            //.populate({ "path": "members", "select": "addresses", "model": "User"})
            .exec((err, video) => {
              if (!video[req.params.sez]) video[req.params.sez] = [];
              video[req.params.sez].push(req.params.id);
              video.save(function(err){
                if (err) {
                  logger.debug(`${JSON.stringify(err)}`);
                  res.status(404).send({ message: err });
                } else {
                  req.params.form = 'videos';
                  router.getData(req, res);            
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
  logger.debug(model);
  model
  .findOne(query)
  .select({_id:1, videos:1})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    logger.debug(req.params.video)
    logger.debug(item.videos)
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
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
          logger.debug(`${JSON.stringify(err)}`);
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
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                req.params.sez = 'events';
                req.params.form = 'videos';
                router.getData(req, res);            
              }
            });
          });
        }
      });
    }
  });
}

/*
router.addVideos = (req, res) => {
  Models[req.params.model]
  .findOne({_id: req.params.id},'_id, videos', (err, result) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
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
          logger.debug(`${JSON.stringify(err)}`);
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
              logger.debug("Newsletter");
              logger.debug(error);
              logger.debug(body);
            }
          });
          //logger.debug(mailinglists.join(','));
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
module.exports = router;
