const router = require('../../router')();
let config = require('getconfig');
const moment = require('moment');
const helpers = require('./helpers');

const mongoose = require('mongoose');
const Models = {
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Program': mongoose.model('Program'),
  'Video': mongoose.model('Video'),
  'Order': mongoose.model('Order')
}
const logger = require('../../../utilities/logger');

router.postData = (req, res) => {
  logger.debug('req.body');
  logger.debug(req.body);
  logger.debug('req.params');
  logger.debug(req.params);
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms.new) {
    logger.debug('BINGO');
    let select = Object. assign({}, config.cpanel[req.params.sez].forms.new.select);
    let selectaddon = config.cpanel[req.params.sez].forms.new.selectaddon;
    let post = {};

    helpers.myExternalUrl(req, (err) => {
      logger.debug("myExternalUrl result");
      logger.debug(req.body);
      if (req.params.sez == "videos" && req.body.media && req.body.media.externalurl) {
        select.image = 1;
        select.media = 1;
        //select.is_public = 1;
        select.abouts = 1;
      }
      helpers.mySlugify(Models[config.cpanel[req.params.sez].model], req.body.stagename ? req.body.stagename : req.body.title, (slug) => {
        req.body.slug = slug;
        logger.debug("slug");
        logger.debug(slug);
        //for (const item in select) if(req.body[item]) post[item] = req.body[item];
        // db.users.updateOne({slug:'gianlucadelgobbo'},{$unset: {oldpassword:""}});
        logger.debug('select');
        logger.debug(select);
        for (const item in select) if(req.body[item]) {
          post[item] = req.body[item];
        }
        for (const item in selectaddon) {
          post[item] = selectaddon[item];
        }
        if (req.params.sez == "crews") {
          post.members = [req.user.id];
        } else {
          post.users = [req.user.id];
        }
        if (req.params.ancestor && req.params.id) {
          post[req.params.ancestor] = [req.params.id];
        }
        logger.debug('postpostpostpostpostpost');
        logger.debug(post);
  
        Models[config.cpanel[req.params.sez].model]
        .create(post, (err, data) => {
          if (!err) {
            logger.debug('create success');
            logger.debug(data);
            const id = req.user.id;
            Models['User']
            .findById(id, req.params.sez, (err, user) => {
              logger.debug('findById user');
              logger.debug(user);
              if (!err) {
                if (user) {
                  if (req.params.sez==="partner") {
                    res.json(data);                    
                  } else {
                    user[req.params.sez].push(data._id);
                    logger.debug('save user');
                    logger.debug(user);
                    user.save((err) => {
                      if (err) {
                        logger.debug('save user err');
                        logger.debug(err);
                        res.status(400).send(err);
                      } else {
                        logger.debug('save user success');
                        if (req.params.ancestor && req.params.id) {
                          Models[config.cpanel[req.params.ancestor].model]
                          .findById(req.params.id)
                          .exec((err, ancestor) => {
                            ancestor[req.params.sez].push(data._id);
                            ancestor.save((err) => {
                              if (err) {
                                logger.debug('save ancestor err');
                                logger.debug(err);
                                res.status(400).send(err);
                              } else {
                                logger.debug("save ancestor success");
                                logger.debug(data);
                                logger.debug(data);
                                res.json(data);                    
                              }
                            });
                          });
                        } else {
                          res.json(data);                    
                        }
                        /* select = req.query.pure ? config.cpanel[req.params.sez].list.select : Object.assign(config.cpanel[req.params.sez].list.select, config.cpanel[req.params.sez].list.selectaddon);
                        const populate = req.query.pure ? [] : config.cpanel[req.params.sez].list.populate;
                          
                        Models[config.cpanel[req.params.sez].list.model]
                        .findById(id)
                        .select(select)
                        .populate(populate)
                        .exec((err, data) => {
                          if (err) {
                            res.status(500).send({ message: `${JSON.stringify(err)}` });
                          } else {
                            let send = {_id: data._id};
                            for (const item in config.cpanel[req.params.sez].list.select) send[item] = data[item];
                            logger.debug('sendsendsendsendsendsendsend');
                            logger.debug(send);
                            res.json(send);
                          }
                        }); */
                      }
                    });  
                  }
                } else {
                  res.status(404).send({ message: `DOC_NOT_FOUND` });
                }
              } else {
                res.status(500).send({ message: `${JSON.stringify(err)}` });
              }
            });
          } else {
            logger.debug('create err');
            logger.debug(err);
            res.status(400).send(err);
          }
        });
      });
    });

    
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

router.cancelSubscription = (req, res) => {
  logger.debug(req.body);
  Models.Program
  .findOne({_id: req.body.id/* , members:req.user.id */},'_id, event', (err, sub) => {
    logger.debug(sub.event);
    Models.Event
    .findOne({_id: sub.event},'_id, program', (err, event) => {
      logger.debug(event);
      event.program.forEach((program, index) => {
        if (program.subscription_id == req.body.id) {
          event.program.splice(index, 1);
        }
      });
      event.save(function(err){
        sub.remove(function(err){
          res.json(true);
        });
      });  
    });
  });
}
router.editSubscriptionSave = (req, res) => {
  logger.debug("req.body");
  logger.debug(req.body);
  Models.Program.findOne({_id: req.body.program})
  .exec((err, program) => {
    if (req.body.schedule!=undefined) {
      for(var a=0;a<req.body.schedule.length;a++){
        program.schedule[a].price = req.body.schedule[a].price;
        program.schedule[a].paypal = req.body.schedule[a].paypal;
        program.schedule[a].alleventschedulewithoneprice = req.body.schedule[a].alleventschedulewithoneprice==="1";
        program.schedule[a].priceincludesothershows = req.body.schedule[a].priceincludesothershows==="1";
      }
      program.save(function(err){
        if (err) {
          res.json(err);
        } else {
          Models.Performance.findOne({_id: program.performance})
          .exec((err, performance) => {
            logger.debug({_id: program.performance});
            for(var a=0;a<performance.bookings.length;a++){
              if (performance.bookings[a].event.toString()===program.event.toString()) {
                performance.bookings[a].schedule = program.schedule;
              }
            }
            logger.debug(performance.bookings);
            performance.save(function(err){
              if (err) {
                res.json(err);
              } else {
                res.json({success: true});
              }
            });
          });
        }
      });
    } else if (req.body.fee!=undefined) {
      program.fee = req.body.fee;
      program.technical_cost = req.body.technical_cost;
      program.accommodation_cost = req.body.accommodation_cost;
      program.transfer_cost = req.body.transfer_cost;
      program.save(function(err){
        if (err) {
          res.json(err);
        } else {
          res.json({success: true});
        }
      });
    } else {
      var subscriptions = req.body.subscriptions.filter(item => item.subscriber_id!="" && item.freezed!="1");
      var subscriptions_freezed = req.body.subscriptions.filter(item => item.subscriber_id!="" && item.freezed=="1").map(item => {return item.subscriber_id.toString()});
      for (var item=0;item<subscriptions.length;item++) {
        if (subscriptions[item].packages && subscriptions[item].packages.length) {
          for (var pack=0;pack<subscriptions[item].packages.length;pack++) {
            var tmpPack = JSON.parse("["+subscriptions[item].packages[pack].package+"]");
            tmpPack[0].option = subscriptions[item].packages[pack].option;
            subscriptions[item].packages[pack] = tmpPack[0];
          }
          logger.debug("subscriptions[item].packages");
          logger.debug(subscriptions[item].packages);  
        }
      }
      for (var item=0;item<program.subscriptions.length;item++) {
        if (subscriptions_freezed.indexOf(program.subscriptions[item].subscriber_id.toString())!=-1) {
          program.subscriptions[item].freezed = true;
          subscriptions.push(program.subscriptions[item]);
        }
      }
      program.reference = req.body.reference;
      program.subscriptions = subscriptions;
      program.save(function(err){
        if (err) {
          res.json(err);
        } else {
          Models.Program.find({_id: {$ne: program._id}, event:program.event, "subscriptions.subscriber_id": program.subscriptions.map(item => {return item.subscriber_id;})})
          .exec((err, programs) => {
            if (programs.length) {
              let promises = [];
              for (var item=0;item<programs.length;item++) { 
                for (var subscription=0;subscription<programs[item].subscriptions.length;subscription++) { 
                  for (var subnew=0;subnew<program.subscriptions.length;subnew++) { 
                    if (program.subscriptions[subnew].subscriber_id.toString() == programs[item].subscriptions[subscription].subscriber_id.toString()) {
                      program.subscriptions[subnew].freezed = programs[item].subscriptions[subscription].freezed;
                      programs[item].subscriptions[subscription] = program.subscriptions[subnew];
                    }
                  }
                }
                promises.push(Models.Program.findOneAndUpdate({_id: programs[item]._id}, programs[item]));
              }
              Promise.all(
                promises
              ).then( (resultsPromise) => {
                res.json({success: true});
              });          
            } else {
              res.json({success: true});
            }
          });
        }
      });   
    }
  });
}
router.shareOnTelegram = (req, res) => {
  const TG = require('telegram-bot-api')

  const api = new TG({
      token: process.env.TG_API
  })

  api.sendPhoto({
    chat_id: "@avnode",
    parse_mode: "Markdown",
    caption: '*TEST* CIAO',
    photo: "https://avnode.net/warehouse/performances/2020/12/400x225/2060b7d4-602c-432e-9461-38450f12cb4f_png.jpg"
  })
  .then((value) => {
    res.json(value);
  })
  .catch((value) => {
    res.json(value);
  })
}

router.setVideoCategory = (req, res) => {
  logger.debug(req.body);
  Models.Video
  .findOne({_id: req.body.id},'_id, categories', (err, video) => {
    if (video) {
      video.categories = req.body.categories;
      logger.debug(video);
      video.save(err => {
        res.json({err: err});
      });
    } else {
      res.json({err: "Video not found"});
    }
  });
}
router.setVideoExclude = (req, res) => {
  logger.debug(req.body);
  Models.Video
  .findOne({_id: req.body.id},'_id', (err, video) => {
    if (video) {
      video.vjtv_exclude = req.body.vjtv_exclude;
      logger.debug(video);
      video.save(err => {
        res.json({err: err});
      });
    } else {
      res.json({err: "Video not found"});
    }
  });
}
router.editSubscription = (req, res) => {
  logger.debug(req.body);
  let populate = [
    { "path": "event", "select": "title slug schedule organizationsettings", "model": "Event", "populate":[{"path": "organizationsettings.call.calls.admitted", "select": "name slug", "model": "Category"}]},
    { "path": "performance", "select": "title slug users duration abouts image bookings", "model": "Performance", "populate": [{"path": "users", "select": "stagename addresses image abouts members", "populate": [{"path": "members", "select": "stagename addresses image abouts", "model": "UserShow"}], "model": "UserShow"},{"path": "type", "select": "name", "model": "Category"},{"path": "tecnique", "select": "name", "model": "Category"},{"path": "genre", "select": "name", "model": "Category"}]},
    { "path": "subscriptions.subscriber_id", "select": "stagename name surname email mobile", "model": "User"},
    { "path": "status", "select": "name", "model": "Category"},
    { "path": "reference", "select": "stagename name surname email mobile", "model": "User"}
  ];
  Models.Program
  .findOne({_id: req.body.id/* , members:req.user.id */})
  .populate(populate)
  .exec((err, sub) => {
    logger.debug(sub);
    let daysdays = [];
    let schedule = JSON.parse(JSON.stringify(sub.event.schedule));
    for(let a=0;a<schedule.length;a++) {
      let dayday = new Date(new Date(schedule[a].starttime).setUTCHours(0)).getTime();
      if (daysdays.indexOf(dayday)===-1) {
        daysdays.push(dayday);
      }
    }
    daysdays = daysdays.sort(function(a, b) {
      a = new Date(a);
      b = new Date(b);
      return a<b ? -1 : a>b ? 1 : 0;
    });
    daysdays.unshift(daysdays[0]-(24*60*60*1000));
    daysdays.push(daysdays[daysdays.length-1]+(24*60*60*1000));
    let days = [];
    for(let a=0;a<daysdays.length;a++) days.push({date:daysdays[a], date_formatted:moment(daysdays[a]).format(config.dateFormat[global.getLocale()].weekdaydaymonthyear)});
    
    res.render('adminpro/events/acts-edit-sub', {call: sub,days:days}, function(err, body) {
      logger.debug(err);
      logger.debug("sub");
      res.json(body);
    });
  });
}
router.editSubscriptionPrice = (req, res) => {
  logger.debug(req.body);
  Models.Program
  .findOne({_id: req.body.id/* , members:req.user.id */})
  .select({schedule: 1})
  .exec((err, sub) => {
    res.render('adminpro/events/acts-edit-sub-price', {sub: sub}, function(err, body) {
      res.json(body);
    });
  });
}

router.editSubscriptionCost = (req, res) => {
  logger.debug(req.body);
  Models.Program
  .findOne({_id: req.body.id/* , members:req.user.id */})
  .select({fee: 1, technical_cost: 1, accommodation_cost: 1, transfer_cost: 1})
  .exec((err, sub) => {
    res.render('adminpro/events/acts-edit-sub-cost', {sub: sub}, function(err, body) {
      res.json(body);
    });
  });
}

router.linkPartner = (req, res) => {
  logger.debug(req.body);
  Models.User
  .findOne({_id: req.body.id, is_crew: true},'_id partner_owner', (err, partner) => {
    if (partner) {
      if (!partner.partner_owner || partner.partner_owner.map(item => {return item.owner;}).indexOf(req.body.partner_owner)===-1) {
        if (!partner.partner_owner) partner.partner_owner = [];
        partner.partner_owner.push({owner: req.body.partner_owner, delegate: req.body.delegate});
        logger.debug(partner);
        partner.save(err => {
          res.json({err: err});
        });
      } else {
        res.json({err: "Partner already in"});
      }
    } else {
      res.json({err: "Partner not found"});
    }
  });
}

router.unlinkPartner = (req, res) => {
  logger.debug("unlinkPartner");
  logger.debug(req.body);
  Models.User
  .findOne({_id: req.body.id, is_crew: true, "partner_owner": req.body.owner},'_id event partner_owner', (err, partner) => {
    logger.debug(partner);
    if (partner && partner.partner_owner && partner.partner_owner.length) {
      partner.partner_owner.splice(partner.partner_owner.map(item => {return item.owner.toString();}).indexOf(req.body.owner), 1);
      partner.save(err => {
        res.json({err: err});
      });
    } else {
      res.json({err: "Partner not found"});
    }
});
}
router.setStatus = (req, res) => {
  logger.debug('/partners/status/');
  logger.debug(req.body);
  if (!req.body || !req.body.owner || !req.body.id || !req.body.name || req.body.value === undefined) {
    res.status(400).send("NO DATA");
  } else {
    Models.User.
    findOne({_id: req.body.owner})
    .select({partners:1})
    .exec((err, user) => {
      if (err || !user) {
        logger.debug('user err');
        logger.debug(err);
        res.status(400).send(err);
      } else {
        for (var a=0;a<user.partners.length;a++) {
          if (user.partners[a].partner._id.toString() === req.body.id) {
            user.partners[a][req.body.name] = req.body.value;
            logger.debug(user.partners[a]);
          }
        }
        user.save((err) => {
          logger.debug(err);
          if (err) {
            logger.debug('save user err');
            logger.debug(err);
            res.status(400).send(err);
          } else {
            logger.debug("save user success");
            logger.debug(req.body);
            res.json(req.body);                    
          }
        });
      }
    });

  }
}

router.setCategories = (req, res) => {
  logger.debug('/partners/categories/');
  logger.debug(req.body);
  if (!req.body || !req.body.owner || !req.body.id || !req.body.category || req.body.value === undefined) {
    res.status(400).send("NO DATA");
  } else {
    Models.User.
    findOne({_id: req.body.owner})
    .select({partners:1})
    .exec((err, user) => {
      if (err || !user) {
        logger.debug('user err');
        logger.debug(err);
        res.status(400).send(err);
      } else {
        for (var a=0;a<user.partners.length;a++) {
          if (user.partners[a].partner._id.toString() === req.body.id) {
            if (req.body.value==="true") {
              user.partners[a].categories.push(req.body.category)
            } else {
              user.partners[a].categories.splice(user.partners[a].categories.map(item => {return item.str}).indexOf(req.body.category))
            }
            logger.debug(user.partners[a]);
          }
        }
        user.save((err) => {
          logger.debug(err);
          if (err) {
            logger.debug('save user err');
            logger.debug(err);
            res.status(400).send(err);
          } else {
            logger.debug("save user success");
            logger.debug(req.body);
            res.json(req.body);                    
          }
        });
      }
    });

  }
}

router.addContacts = (req, res) => {
  logger.debug('/partners/contacts/add/');
  logger.debug(req.body);
  Models.User.
  findOne({_id: req.body.crew})
  .exec((err, user) => {
  //select({stagename: 1, createdAt: 1, crews:1}).
    if (err || !user) {
      logger.debug('user err');
      logger.debug(err);
      res.status(400).send(err);
    } else {
      delete req.body.crew;
      if (req.body.index) {
        user.organizationData.contacts.splice(req.body.index, 1, req.body);
      } else {
        logger.debug(user);
        logger.debug("useruseruseruseruseruseruseruseruseruseruseruser");
        delete req.body.index;
        delete req.body.stagename;
        if (!user.organizationData) user.organizationData = {};
        if (!user.organizationData.contacts || !user.organizationData.contacts.length) user.organizationData.contacts = [req.body];
      };
      logger.debug(user.organizationData.contacts[0]);
      user.save((err) => {
        logger.debug(err);
        if (err) {
          logger.debug('save user err');
          logger.debug(err);
          res.status(400).send(err);
        } else {
          logger.debug("save user success");
          logger.debug(user.organizationData.contacts);
          res.json(user.organizationData.contacts);                    
        }
      });
    }
  });
}

router.deleteContacts = (req, res) => {
  logger.debug('/partners/contacts/deleteContacts/');
  logger.debug(req.body);
  Models.User.
  findOne({_id: req.body.id})
  .exec((err, user) => {
  //select({stagename: 1, createdAt: 1, crews:1}).
    logger.debug('stocazzo');
    logger.debug(user);
    if (err || !user) {
      logger.debug('user err');
      logger.debug(err);
      res.status(400).send(err);
    } else {
      user.organizationData.contacts.splice(req.body.index, 1);
      
      user.save((err) => {
        logger.debug(err);
        if (err) {
          logger.debug('save user err');
          logger.debug(err);
          res.status(400).send(err);
        } else {
          logger.debug("save user success");
          logger.debug(user.organizationData.contacts);
          res.json(user.organizationData.contacts);                    
        }
      });
    }
  });
}


router.updatePartnerships = (req, res) => {
  logger.debug("req.body");
  logger.debug(req.body);

  Models.User
  .findOne({_id: req.body.partner},'partnerships', (err, partner) => {
    /* 
    var toadd = true;
    for (var a=0;a<partner.partnerships.length;a++) {
      logger.debug(partner.partnerships[a]);
      if(partner.partnerships[a].toString() === req.body.event) {
        partner.partnerships[a].splice(a, 1);
      }
      if (req.body.category) {
        partner.partnerships[a].push(req.body.event);
        toadd = false;
      }
    }
    a=0;
    while (a<partner.partnerships.length) {
      if(!partner.partnerships[a].events.length) {
        partner.partnerships.splice(a, 1);
      }
      a++
    }
    */
    if (req.body.category) {
      if (partner.partnerships.map(item => {return item.toString()}).indexOf(req.body.event)) {
        partner.partnerships.push(req.body.event);
      }
    } else {
      for (var a=0;a<partner.partnerships.length;a++) {
        if(partner.partnerships[a].toString() === req.body.event) {
          partner.partnerships.splice(a, 1);
        }
      }
    }
    partner.stats.partnerships = partner.partnerships.length;


    partner.save(err => {



      Models.Event
      .findOne({_id: req.body.event},'partnerships', (err, event) => {
        event.partners = req.body.partnerships;
        /* for (var a=0;a<event.partners.length;a++) {
          logger.debug(event.partners[a].users);
        } */
    
    
        event.save(err => {
          res.json(err);
        });
      });
    



    });

  });
}

router.updateProgram = (req, res) => {
  logger.debug("req.body");
  //logger.debug(req.body);
  var performances = [];
  var programIDS = [];
  var program = [];
  var eventProgram = [];
  var promises = [];
  var promisesPerf = [];
  if (req.body.tobescheduled && req.body.tobescheduled.length) {
    for (var a=0;a<req.body.tobescheduled.length;a++) {
      var index = programIDS.indexOf(req.body.tobescheduled[a]._id);
      if (index===-1) {
        programIDS.push(req.body.tobescheduled[a]._id);
        program.push(req.body.tobescheduled[a]);
      } else {
        console.log("DOPPIO TO BE SCHEDULED!!!");
      }
    }  
  }  
  for (var a=0;a<req.body.data.length;a++) {
    var index = programIDS.indexOf(req.body.data[a]._id);
    if (index===-1) {
      programIDS.push(req.body.data[a]._id);
      program.push(req.body.data[a]);
    } else {
      if (!program[index].schedule) program[index].schedule = [];
      program[index].schedule.push(req.body.data[a].schedule[0]);
    }
  }  
  for (var a=0;a<program.length;a++) {
    eventProgram.push({performance:program[a].performance,schedule: program[a].schedule});
    promises.push(Models.Program.findOneAndUpdate({_id: program[a]._id}, { $set: { schedule: program[a].schedule }}));
  }
  Promise.all(
    promises
  ).then( (resultsPromise) => {
    for (var a=0;a<program.length;a++) {
      promisesPerf.push(Models.Performance.findOne({_id: program[a].performance}));
    }
    Promise.all(
      promisesPerf
    ).then( (resultsPromisePerf) => {
      var promisesPerfSave = [];
      for (var a=0;a<resultsPromisePerf.length;a++) {
        if (resultsPromisePerf[a].bookings.length) {
          let notfound = true;
          for (var b=0;b<resultsPromisePerf[a].bookings.length;b++) {
            if (resultsPromisePerf[a].bookings[b].event && resultsPromisePerf[a].bookings[b].event.toString()==req.body.event) {    
              resultsPromisePerf[a].bookings[b].schedule = program[a].schedule;
              notfound = false;
            }
          }
          if (notfound) resultsPromisePerf[a].bookings.push({event:req.body.event,schedule: program[a].schedule});
        } else {
          resultsPromisePerf[a].bookings = [{event:req.body.event,schedule: program[a].schedule}];
        }
        logger.debug("resultsPromisePerf[a].bookings")
        logger.debug(resultsPromisePerf[a].title)
        logger.debug(req.body.event)
        promisesPerfSave.push(Models.Performance.updateOne({_id:resultsPromisePerf[a]._id}, resultsPromisePerf[a]));
      }
      Promise.all(
        promisesPerfSave
      ).then( (resultsPromisePerfSave) => {
        const acceptedonly = false;
        if (acceptedonly) {
          Models.Event.findOneAndUpdate({_id:program[0].event}, {$set: {program: eventProgram}}).exec((err, result) => {
            res.json(err || result);
          });
        } else {
          Models.Event.findOne({_id:req.body.event}).exec((err, event) => {
            for (var a=0;a<event.program.length;a++) {
              for (var b=0;b<eventProgram.length;b++) {
                if (event.program[a].performance.toString() === eventProgram[b].performance.toString()) {
                  event.program[a].schedule = eventProgram[b].schedule;
                }
              }
            }
            event.save((err) => {
              res.json(err);
            });
          });
        }
      }); 
    });
  });
}
/*
orderID: data.orderID,
order: order,
details: details,
data: data
*/
router.contact = (req, res) => {
  logger.debug(req.body);
  if (req.body.user) {
    let message = {};

    Models.User
    .findOne({_id: req.body.user})
    .select({stagename: 1, slug:1, name:1, surname:1, email: 1, is_crew:1, is_banned:1})
    .populate([{ "path": "members", "select": "stagename name surname email", "model": "User"}])
    .exec((err, user) => {
      if (!is_banned) {
        logger.debug(user);
        logger.debug(err);
        message = {to: "Gianluca Del Gobbo <g.delgobbo@avnode.org>"};
        let messagetext = "FROM\n";
        messagetext+= "Stagename: "+req.user.stagename+"\n";
        messagetext+= "Name: "+req.user.name+"\n";
        messagetext+= "Surname: "+req.user.surname+"\n";
        messagetext+= "Email: "+req.user.email+"\n";
        messagetext+= "Link: http://"+req.headers.host+"/"+req.user.slug+"\n---------\n";
        messagetext+= "TO\n";
        messagetext+= "Stagename: "+req.user.stagename+"\n";
        if (!user.is_crew) {
          messagetext+= "Name: "+user.name+"\n";
          messagetext+= "Surname: "+user.surname+"\n";
          messagetext+= "Email: "+user.email+"\n";
        }
        messagetext+= "Link: http://"+req.headers.host+"/"+user.slug+"\n\n---------\n";
        messagetext+= req.body.message+"\n--------------";
        logger.debug(messagetext);
        const mailer = require('../../../utilities/mailer');
        mailer.mySendMailer({
          template: 'bookingRequest',
          message: message,
          locals: {
          },
          email_content: {
            site: 'https://'+req.headers.host,
            subject:  req.body.subject+' | AVnode.net',
            text_text:  messagetext,
            html_text: messagetext.replace(new RegExp("\n","g"),"<br />"),
            html_sign: "The AVnode.net Team",
            text_sign:  "The AVnode.net Team"
          }
        }, function(error_1){
          if (error_1 && error_1.message != "") {
            res.json(error_1);
          } else {
            message = {bcc: "Gianluca Del Gobbo <g.delgobbo@avnode.org>"};
            if (user.is_crew) {
              logger.debug("crew")
              for (var b=0;b<user.members.length;b++) {
                if (!message.to) {
                  message.to = user.members[b].stagename+" <"+user.members[b].email+">";
                } else {
                  if (!message.cc) message.cc = [];
                  message.cc.push(user.members[b].stagename+" <"+user.members[b].email+">");
                }
                }
            } else {
              logger.debug("single")
              if (!message.to) {
                message.to = user.stagename+" <"+user.email+">";
              } else {
                if (!message.cc) message.cc = [];
                message.cc.push(user.stagename+" <"+user.email+">");
              }
            }
            messagetext = "Dear "+user.stagename+",\nwe got this message, are you interested?\n\n---------\n"+req.body.message+"\n--------------";
            mailer.mySendMailer({
              template: 'bookingRequest',
              message: message,
              locals: {
              },
              email_content: {
                site: 'http://'+req.headers.host,
                subject:  req.body.subject+' | AVnode.net',
                text_text:  messagetext,
                html_text: messagetext.replace(new RegExp("\n","g"), "<br />"),
                html_sign: "The AVnode.net Team",
                text_sign:  "The AVnode.net Team"
              }
            }, function(error_2){
              error_2.step = 2;
              res.json(error_2);
            });
          }
        });
        /* program.save(err => {
          res.json({res: err ? err : true});
        }); */

      } else {
        res.json({message:"User is banned"});
      }
    });
  } else {
    res.json({message:"User do not exists"});
  }
}



router.bookingRequest = (req, res) => {
  logger.debug(req.body);
  if (req.body.perf) {
    let message = {};

    Models.Performance
    .findOne({_id: req.body.perf/* , members:req.user.id */})
    .select({title: 1, slug: 1})
    .populate([{ "path": "users", "select": "is_crew stagename name surname email", "model": "User", "populate": { "path": "members", "select": "stagename name surname email", "model": "User"}}])
    .exec((err, perf) => {
      logger.debug(perf.users);
      logger.debug(err);
      message = {to: "Gianluca Del Gobbo <g.delgobbo@avnode.org>"};
      let messagetext = "";
      messagetext+= "Stagename: "+req.user.stagename+"\n";
      messagetext+= "Name: "+req.user.name+"\n";
      messagetext+= "Surname: "+req.user.surname+"\n";
      messagetext+= "Email: "+req.user.email+"\n";
      if (req.body.crew) messagetext+= "Organization: "+req.body.crew+"\n";;
      messagetext+= "Link: http://"+req.headers.host+"/"+req.user.slug+"\n\n---------\n";
      messagetext+= "Performance: http://"+req.headers.host+"/"+perf.slug+"\n\n---------\n";
      messagetext+= req.body.request+"\n--------------";
      logger.debug(messagetext);
      const mailer = require('../../../utilities/mailer');
      mailer.mySendMailer({
        template: 'bookingRequest',
        message: message,
        locals: {
        },
        email_content: {
          site: 'http://'+req.headers.host,
          subject:  req.body.subject+' | AVnode.net',
          text_text:  messagetext,
          html_text: messagetext.replace(new RegExp("\n","g"),"<br />"),
          html_sign: "The AVnode.net Team",
          text_sign:  "The AVnode.net Team"
        }
      }, function(error_1){
        if (error_1 && error_1.message) {
          error_1.step = 1;
          res.json(error_1);
        } else {
          message = {bcc: "Gianluca Del Gobbo <g.delgobbo@avnode.org>"};
          for (var a=0;a<perf.users.length;a++) {
            if (perf.users[a].is_crew) {
              logger.debug("crew")
              for (var b=0;b<perf.users[a].members.length;b++) {
                if (!message.to) {
                  message.to = perf.users[a].members[b].stagename+" <"+perf.users[a].members[b].email+">";
                } else {
                  if (!message.cc) message.cc = [];
                  message.cc.push(perf.users[a].members[b].stagename+" <"+perf.users[a].members[b].email+">");
                }
                }
            } else {
              logger.debug("single")
              if (!message.to) {
                message.to = perf.users[a].stagename+" <"+perf.users[a].email+">";
              } else {
                if (!message.cc) message.cc = [];
                message.cc.push(perf.users[a].stagename+" <"+perf.users[a].email+">");
              }
            }
          }
          messagetext = "Dear "+perf.users[0].stagename+",\nwe got this booking request, are you interested?\n\n---------\n"+req.body.request+"\n--------------";
          mailer.mySendMailer({
            template: 'bookingRequest',
            message: message,
            locals: {
            },
            email_content: {
              site: 'http://'+req.headers.host,
              subject:  req.body.subject+' | AVnode.net',
              text_text:  messagetext,
              html_text: messagetext.replace(new RegExp("\n","g"), "<br />"),
              html_sign: "The AVnode.net Team",
              text_sign:  "The AVnode.net Team"
            }
          }, function(error_2){
            error_2.step = 2;
            res.json(error_2);
          });
        }
      });
      /* program.save(err => {
        res.json({res: err ? err : true});
      }); */
    });
  } else {
    res.json({message:"Performance do not exists"});
  }
}

router.updateSubscription = (req, res) => {
  //logger.debug("updateSubscription");

/*   const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

  // 1b. Import the PayPal SDK client that was created in `Set up the Server SDK`.
  // * PayPal HTTP client dependency
  const payPalClient = require('./paypalClient');
  
  // 2. Set up your server to receive a call from the client
  module.exports = async function handleRequest(req, res) {
  
    // 2a. Get the order ID from the request body
    const orderID = req.body.orderID;
  
    // 3. Call PayPal to get the transaction details
    let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);
  
    let order;
    try {
      order = await payPalClient.client().execute(request);
    } catch (err) {
  
      // 4. Handle any errors from the call
      console.error(err);
      return res.send(500);
    }
  
    // 5. Validate the transaction details are as expected
    if (order.result.purchase_units[0].amount.value !== '220.00') {
      return res.send(400);
    }
  
    // 6. Save the transaction in your database
    // await database.saveTransaction(orderID);
  
    // 7. Return a successful response to the client
    return res.send(200);
  } */
    
  if (req.body.id && req.body.subscriber_id && req.body.wepay) {
    Models.Program
    .findOne({_id: req.body.id/* , members:req.user.id */})
    //.select({schedule: 1, call: 1, event: 1})
    //.populate([{ "path": "status", "select": "name", "model": "Category"},{ "path": "performance", "select": "title", "model": "Performance"},{ "path": "reference", "select": "stagename name surname email mobile", "model": "User"}])
    .exec((err, program) => {
      for (var a=0;a<program.subscriptions.length;a++) {
        if (program.subscriptions[a].subscriber_id == req.body.subscriber_id) {
          program.subscriptions[a].wepay = req.body.wepay;
        }
      }
      program.save(err => {
        res.json({res: err ? err : true});
      });
    });
  } else if (req.body.id && req.body.subscriber_id && req.body.cash) {
    Models.Program
    .findOne({_id: req.body.id/* , members:req.user.id */})
    //.select({schedule: 1, call: 1, event: 1})
    //.populate([{ "path": "status", "select": "name", "model": "Category"},{ "path": "performance", "select": "title", "model": "Performance"},{ "path": "reference", "select": "stagename name surname email mobile", "model": "User"}])
    .exec((err, program) => {
      for (var a=0;a<program.subscriptions.length;a++) {
        if (program.subscriptions[a].subscriber_id == req.body.subscriber_id) {
          program.subscriptions[a].cash = req.body.cash;
        }
      }
      program.save(err => {
        res.json({res: err ? err : true});
      });
    });
  } else if (req.body.id && req.body.subscriber_id && (req.body.hotel || req.body.hotel_room)) {
    Models.Program
    .findOne({_id: req.body.id/* , members:req.user.id */})
    //.select({schedule: 1, call: 1, event: 1})
    //.populate([{ "path": "status", "select": "name", "model": "Category"},{ "path": "performance", "select": "title", "model": "Performance"},{ "path": "reference", "select": "stagename name surname email mobile", "model": "User"}])
    .exec((err, program) => {
      for (var a=0;a<program.subscriptions.length;a++) {
        if (program.subscriptions[a].subscriber_id == req.body.subscriber_id) {
          for (var b=0;b<program.subscriptions[a].packages.length;b++) {
            if (program.subscriptions[a].packages[b].name == "Accommodation") {
              if (req.body.hotel) program.subscriptions[a].packages[b].option = req.body.hotel;
              if (req.body.hotel_room) program.subscriptions[a].packages[b].option_value = req.body.hotel_room;
            }
          }
        }
      }
      program.save(err => {
        res.json({res: err ? err : true});
      });
    });
  } else if (req.body.id && req.body.status) {
    const gmailer = require('../../../utilities/gmailer');
    Models.Program
    .findOne({_id: req.body.id/* , members:req.user.id */})
    .select({schedule: 1, call: 1, event: 1})
    .populate([{ "path": "status", "select": "name", "model": "Category"},{ "path": "performance", "select": "title", "model": "Performance"},{ "path": "reference", "select": "stagename name surname email mobile", "model": "User"}])
    .exec((err, sub) => {
      //logger.debug(sub);
      Models.Event
      .findOne({_id: sub.event})
      .select({program: 1, organizationsettings: 1})
      .exec((err, event) => {
        /* logger.debug(event.organizationsettings.call.calls[sub.call].email);
        event.program.forEach((program, index) => {
          logger.debug(program);
          if (program.subscription_id == req.body.id) {
            //event.program[index].schedule.status = req.body.status;
            program.status = req.body.status;
          }
          logger.debug(program);
        }); */
        const status = {
          "5c38c57d9d426a9522c15ba5": "to be evaluated" ,
          "5be8708afc3961000000019e": "accepted - waiting for payment" ,
          "5be8708afc39610000000013": "accepted" ,
          "5be8708afc39610000000097": "to be completed" ,
          "5be8708afc3961000000011a": "not_accepted" ,
          "5be8708afc39610000000221": "refused from user"
        };
        const old_status_name = sub.status.name;
        sub.status = req.body.status;
        sub.save(function(err){
          //logger.debug("sub.save");
          //logger.debug(sub.call);
          //logger.debug(sub.status);
          //event.save(function(err){
            if(!err) {
              if (sub.call >= 0 && event.organizationsettings.call && event.organizationsettings.call.calls && event.organizationsettings.call.calls[sub.call] && event.organizationsettings.call.calls[sub.call].email) {
                const auth = {
                  user: event.organizationsettings.call.calls[sub.call].email,
                  pass: event.organizationsettings.call.calls[sub.call].emailpassword
                };
                let email = "Ciao " + sub.reference.name +",\n"+"your submisstion to the call for proposals \""+event.organizationsettings.call.calls[sub.call].title+"\" with \""+sub.performance.title+"\" changed the status from \"" + old_status_name + "\" to \"" + status[req.body.status] + "\".";
                if (req.body.status == "5be8708afc3961000000019e") {
                  email+= "\n\nPlease confirm as soon your participation from this page https://avnode.net/admin/subscriptions ";
                } else {
                  email+= "\n\nYou can follow the status of your submission from here https://avnode.net/admin/subscriptions "; 
                }
                email+= "\n\n"+event.organizationsettings.call.calls[sub.call].text_sign;
                const mail = {
                  from: event.organizationsettings.call.calls[sub.call].emailname + " <"+ event.organizationsettings.call.calls[sub.call].email + ">",
                  to: sub.reference.name + " " + sub.reference.surname + " <"+ sub.reference.email + ">",
                  subject: __("Submission UPDATES") + " | " + sub.performance.title + " | " + event.organizationsettings.call.calls[sub.call].title,
                  text: email
                };
                //logger.debug("pre gMailer")
                gmailer.gMailer({auth:auth, mail:mail}, function (err, result){
                  //logger.debug("gMailer");
                  //logger.debug(err);
                  //logger.debug("gMailer");
                  //logger.debug(result);
                  if (err) {
                    logger.debug("Email sending failure");
                    res.json({error: true, msg: "Email sending failure", err: err});
                  } else {
                    logger.debug("Email sending OK");
                    res.json({error: false, msg: "Email sending success"});
                  }
                });
              } else {
                res.json({err:err});
              }
            } else {
              res.json({err:err});
            }
          //});  
        });  
      });
    });
  } else {
    res.json(req);
  }
}

router.updateSendy = function (req, res) {
  let err = [];
  /*let conta = 0;
  let emailwithmailinglists = user.emails.filter(item => item.mailinglists);
  for (let item=0 ; item<emailwithmailinglists.length;item++) {*/
    let mailinglists = [];
    for (mailinglist in req.body.mailinglists) if (req.body.mailinglists[mailinglist]) mailinglists.push(mailinglist);
    let formData = {
      list: 'AXRGq2Ftn2Fiab3skb5E892g',
      email: req.body.email,
      Topics: mailinglists.join(','),
      avnode_id: req.user._id.toString(),
      avnode_slug: e.slug,
      avnode_email: e.email,
      boolean: true
    };
    if (req.user.old_id) formData.flxer_id = req.user.old_id;
    if (req.user.name) formData.Name = req.user.name;
    if (req.user.surname) formData.Surname = req.user.surname;
    if (req.user.stagename) formData.Stagename = req.user.stagename;
    if (req.user.addresses && req.user.addresses[0] && req.user.addresses[0].locality) formData.Location = req.req.user.addresses[0].locality;
    if (req.user.addresses && req.user.addresses[0] && req.user.addresses[0].country) formData.Country = req.req.user.addresses[0].country;
    if (req.user.addresses && req.user.addresses[0] && req.user.addresses[0].geometry && req.user.addresses[0].geometry.lat) formData.LATITUDE = req.user.addresses[0].geometry.lat;
    if (req.user.addresses && req.user.addresses[0] && req.user.addresses[0].geometry && req.user.addresses[0].geometry.lng) formData.LONGITUDE = req.user.addresses[0].geometry.lng;
    logger.debug("formData");
    logger.debug(formData);
  
    var https = require('https');
    var querystring = require('querystring');
    
    // form data
    var postData = querystring.stringify(formData);
    
    // request option
    var options = {
      host: 'ml.avnode.net',
      port: 443,
      method: 'POST',
      path: '/subscribe',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };
    
    // request object
    var req = https.request(options, function (res) {
      var result = '';
      res.on('data', function (chunk) {
        result += chunk;
      });
      res.on('end', function () {
        res.json(error);
      });
      res.on('error', function (err) {
        res.json(err);
      })
    });
    
    // req error
    req.on('error', function (err) {
      logger.debug(err);
    });
    
    //send request witht the postData form
    req.write(postData);
    req.end();

    request.post({
      url: 'https://ml.avnode.net/subscribe',
      form: formData,
      function (error, response, body) {
        logger.debug("Newsletter");
        logger.debug(error);
        logger.debug(body);
        res.json(error);
      }
    });
    //logger.debug(mailinglists.join(','));  }
  //}
}

module.exports = router;
