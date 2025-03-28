import createRouter from "../../router.js";
const router = createRouter();


import config from 'getconfig';
import helpers from '../../../utilities/helpers.js';
import mongoose from 'mongoose';
import axios from 'axios';

//import TG from 'telegram-bot-api'
import { mySendMailer } from '../../../utilities/mailer.js';
import https from 'https';
import querystring from 'querystring';
import { gMailer } from '../../../utilities/gmailer.js';

const Models = {
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Program': mongoose.model('Program'),
  'Video': mongoose.model('Video'),
  'Order': mongoose.model('Order')
}
import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';


router.postData = async (req, res) => {
  try {
    logger.info("postData");
    logger.info("req.body");
    logger.info('');
    logger.info(req.body);
    logger.info("req.params");
    logger.info(req.params);
    if (!config.cpanel[req.params.sez] || !config.cpanel[req.params.sez].forms.new) {
      res.status(404).send({ message: `API_NOT_FOUND` });
    }
    logger.info('BINGO');
    let select = Object. assign({}, config.cpanel[req.params.sez].forms.new.select);
    let selectaddon = config.cpanel[req.params.sez].forms.new.selectaddon;
    let post = {};
    if (req.params.sez === 'videos' && req.body.externalurl) {
      try {
        await helpers.myExternalUrl(req);
        req.body.is_public = 1;
        if (req.body.media) {
          select.image = 1;
          select.media = 1;
          select.is_public = 1;
          select.abouts = 1;
        }
      } catch (err) {
        logger.error("🔥 Error in myExternalUrl:", err);
        return res.status(400).json({ message: "Invalid external URL", error: err.message });
      }
      logger.info("myExternalUrl result");
      logger.info(req.body);
    }

    try {
      req.body.slug = await helpers.mySlugify(Models[config.cpanel[req.params.sez].model], req.body.stagename || req.body.title);
    } catch (err) {
      logger.error("🔥 Error in mySlugify:", err);
      return res.status(500).json({ message: "Error generating slug", error: err.message });
    }
    //helpers.mySlugify(Models[config.cpanel[req.params.sez].model], req.body.stagename ? req.body.stagename : req.body.title, (slug) => {
    //req.body.slug = slug;
    logger.info("mySlugify");
    logger.info(req.body.slug);
    //for (const item in select) if(req.body[item]) post[item] = req.body[item];
    // db.users.updateOne({slug:'gianlucadelgobbo'},{$unset: {oldpassword:""}});
    logger.info('select');
    logger.info(select);
    for (const item in select) if(req.body[item]) {
      post[item] = req.body[item];
    }
    for (const item in selectaddon) {
      post[item] = selectaddon[item];
    }
    if (req.params.sez == "crews") {
      post.members = [req.user.id];
    } else if (req.params.sez == "partners") {
    } else {
      post.users = [req.user.id];
    }
    if (req.params.ancestor && req.params.id) {
      post[req.params.ancestor] = [req.params.id];
    }
    logger.info('postpostpostpostpostpost');
    logger.info(post);

    let data;
    try {
      //data = await Models[config.cpanel[req.params.sez].model].create(post);
      const Model = Models[config.cpanel[req.params.sez].model];
      data = new Model(post);
      data.$locals = { __: req.__ }; // o qualsiasi funzione di traduzione tu usi
      //await doc.validate(); // triggera i validator
      await data.save();
    } catch (err) {
      logger.error("🔥 Error creating entry in DB:", err);
      res.status(400).send(err);
      //return res.status(500).json({ message: "Error saving to database", error: err.message });
    }
    logger.info("Create success:", data);

/*         var id;
    if (req.params.sez==="partners") {
      id = post.partner_owner[0].owner;
    } else {
      id = req.user.id;
    }
    
    Models['User']
    .findById(id, req.params.sez, (err, user) => { */

    let userId = req.params.sez === "partners" ? post.partner_owner[0].owner : req.user.id;

    let user;
    try {
      user = await Models["User"].findById(userId).select(req.params.sez).exec();
      if (!user) {
        res.status(404).send({ message: `DOC_NOT_FOUND` });
      }
      if (req.params.sez==="partners") {
        user[req.params.sez].push({
          is_selecta: true,
          is_active: true,
          partner: data._id
        });                
      } else {
        user[req.params.sez].push(data._id);
        logger.info('save user');
        logger.info(user);
      }
      try {
        await user.save();           
        logger.info("Save success:");
      } catch (err) {
        logger.error("🔥 Error updating user:", err);
        res.status(500).send({ message: `${JSON.stringify(err)}` });
      }
    } catch (err) {
      logger.error("🔥 Error finding user:", err);
      res.status(404).send({ message: `DOC_NOT_FOUND` });
    }

    if (req.params.ancestor && req.params.id) {
      try {
        let ancestor = await Models[config.cpanel[req.params.ancestor].model].findById(req.params.id).exec();
        if (ancestor) {
          ancestor[req.params.sez].push(data._id);
          try {
            await ancestor.save();
            logger.info("Ancestor updated successfully");
          } catch (err) {
            logger.error("🔥 Error saving ancestor:", err);
            return res.status(500).send(err);
          }
        }
      } catch (err) {
        logger.error("🔥 Error finding ancestor:", err);
        return res.status(500).json({ message: "Error retrieving ancestor data", error: err.message });
      }
    }
    logger.info("save ancestor success");
    logger.info(data);
    logger.info("stocazzooooooooooo");
    logger.info(data);
    var cloneData = JSON.parse(JSON.stringify(data));

    if (req.body.admitted) cloneData.admitted = req.body.admitted
    res.json(cloneData);      
  } catch (error) {
    logger.error("🔥 Unexpected Error in postData:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

router.cancelSubscription = (req, res) => {
  logger.info(req.body);
  var err = [];
  Models.Program
  .findOne({_id: req.body.id/* , members:req.user.id */},'_id, event performance', (err, sub) => {
    if (err) {
      err.push(err);
      res.json(err);
    } else {
      logger.info("sub.event");
      logger.info(sub.event);
      logger.info("sub.performance");
      logger.info(sub.performance);
      Models.Event
      .findOne({_id: sub.event, "program.subscription_id": req.body.id},'_id, program', (err, event) => {
        if (err) {
          err.push(err);
          res.json(err);
        } else {
          logger.info("event.program");
          logger.info(event.program.length);
          event.program.forEach((program, index) => {
            if (program.subscription_id == req.body.id) {
              event.program.splice(index, 1);
            }
          });
          logger.info(event.program.length);
          Models.Performance
          .findOne({_id: sub.performance},'_id, bookings', (err, performance) => {
            if (err) {
              err.push(err);
              res.json(err);
            } else {
              logger.info("performance.bookings.length");
              logger.info(performance.bookings);
              performance.bookings.forEach((booking, index) => {
                if (booking.subscription_id == req.body.id) {
                  performance.bookings.splice(index, 1);
                }
              });
              logger.info(performance.bookings.length);
              event.save(function(err){
                performance.save(function(err){
                  sub.remove(function(err){
                    logger.info("SUCCESSO!!!");
                    res.json(true);
                  });
                });  
              });
            }
          });
        } 
      });
    }
  });
}

router.editSubscriptionSave = (req, res) => {
  logger.info("editSubscriptionSave");
  logger.info("req.body");
  logger.info(req.body);
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
            logger.info({_id: program.performance});
            for(var a=0;a<performance.bookings.length;a++){
              if (performance.bookings[a].event && performance.bookings[a].event.toString()===program.event.toString()) {
                performance.bookings[a].schedule = program.schedule;
              }
            }
            logger.info(performance.bookings);
            performance.save(function(err){
              Models.Event.findOne({"program.subscription_id": req.body.program})
              .exec((err, event) => {
                logger.info(event.program);
                for(var a=0;a<event.program.length;a++){
                  if (event.program[a].subscription_id.toString()===req.body.program.toString()) {
                    event.program[a].schedule = program.schedule;
                  }
                }
                logger.info(event.program);
                event.save(function(err){
                  if (err) {
                    res.json(err);
                  } else {
                    res.json({success: true});
                  }
                });
              });
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
          logger.info("subscriptions[item].packages");
          logger.info(subscriptions[item].packages);  
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
                promises.push(Models.Program.findOneAndUpdate({_id: programs[item]._id}, programs[item]), {upsert: true, useFindAndModify: false});
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
/**/
router.setReordered = (req, res) => {
  logger.info(req.body);
  Models[req.body.model]
  .findOne({_id: req.body.id}, (err, item) => {
    if (item) {
      item[req.body.link] = req.body.obj;
      logger.info(item[req.body.link]);
      item.save(err => {
        res.json({err: err});
      });
    } else {
      res.json({err: "Item not found"});
    }
  });
}
router.setVideoCategory = (req, res) => {
  logger.info(req.body);
  Models.Video
  .findOne({_id: req.body.id},'_id, categories', (err, video) => {
    if (video) {
      video.categories = req.body.categories;
      logger.info(video);
      video.save(err => {
        res.json({err: err});
      });
    } else {
      res.json({err: "Video not found"});
    }
  });
}
router.setVideoExclude = (req, res) => {
  logger.info(req.body);
  Models.Video
  .findOne({_id: req.body.id},'_id', (err, video) => {
    if (video) {
      video.vjtv_exclude = req.body.vjtv_exclude;
      logger.info(video);
      video.save(err => {
        res.json({err: err});
      });
    } else {
      res.json({err: "Video not found"});
    }
  });
}

router.editSubscription = (req, res) => {
  logger.info(req.body);
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
    logger.info(sub);
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
    for(let a=0;a<daysdays.length;a++) days.push({date:daysdays[a], date_formatted: req.moment(daysdays[a]).format(config.dateFormat[req.getLocale()].weekdaydaymonthyear)});
    
    res.render('adminpro/events/acts-edit-sub', {call: sub,days:days}, function(err, body) {
      logger.info(err);
      logger.info("sub");
      res.json(body);
    });
  });
}

router.editSubscriptionPrice = (req, res) => {
  logger.info(req.body);
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
  logger.info(req.body);
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
  logger.info(req.body);
  Models.User
  .findOne({_id: req.body.id, is_crew: true},'_id partner_owner', (err, partner) => {
    logger.info("eq.body");
    logger.info(err || partner);
    if (partner) {
      if (!partner.partner_owner || partner.partner_owner.map(item => {return item.owner;}).indexOf(req.body.partner_owner)===-1) {
        if (!partner.partner_owner) partner.partner_owner = [];
        partner.partner_owner.push({owner: req.body.partner_owner, delegate: req.body.delegate});
        partner.save(err => {
          Models.User
          .findOne({_id: req.body.partner_owner, is_crew: true},'_id partners', (err, owner) => {
            if (owner) {
              if (!owner.partners || owner.partners.map(item => {return item.partner.toString();}).indexOf(req.body.id)===-1) {
                if (!owner.partners) owner.partners = [];
                owner.partners.push({partner: req.body.id, delegate: req.body.delegate, "is_active":true, "is_selecta":true});
                logger.info("owner.partners");
                logger.info(owner.partners);
                owner.save(err => {
                  res.json({err: err});
                });
              } else {
                res.status(400).json({err: "Partner already in"});
              }
            } else {
              res.status(404).json({err: "Owner not found"});
            }
          });
        });
      } else {
        Models.User
        .findOne({_id: req.body.partner_owner, is_crew: true},'_id partners', (err, owner) => {
          if (owner) {
            logger.info("owner");
            if (!owner.partners || owner.partners.map(item => {return item.partner.toString();}).indexOf(req.body.id)===-1) {
              if (!owner.partners) owner.partners = [];
              owner.partners.push({partner: req.body.id, delegate: req.body.delegate, "is_active":true, "is_selecta":true});
              logger.info("owner.partners");
              logger.info(owner.partners.map(item => {return item.partner.toString();}).indexOf(req.body.id));
              owner.save(err => {
                res.json({err: err});
              });
            } else {
              logger.info({err: "Partner already in"});
              logger.info(owner.partners[owner.partners.map(item => {return item.partner.toString();}).indexOf(req.body.id)]);
              res.status(400).json({err: "Partner already in"});
            }
          } else {
            res.status(404).json({err: "Owner not found"});
          }
        });
      }
    } else {
      res.status(404).json({err: "Partner not found"});
    }
  });
}

router.unlinkPartner = (req, res) => {
  logger.info("unlinkPartner");
  logger.info(req.body);
  Models.User
  .findOne({_id: req.body.owner, /* is_crew: true,  */"partners.partner": req.body.id},'_id event partners', (err, user) => {
    logger.info(user.partners.length);
    if (user && user.partners && user.partners.length) {
      user.partners.splice(user.partners.map(item => {return item.partner.toString();}).indexOf(req.body.id), 1);
      logger.info(user.partners.length);
      user.save(err => {
        Models.User
        .findOne({_id: req.body.id, /* is_crew: true,  */"partner_owner.owner": req.body.owner},'_id event partner_owner', (err, partner) => {
          logger.info(partner.partner_owner.length);
          if (partner && partner.partner_owner && partner.partner_owner.length) {
            partner.partner_owner.splice(partner.partner_owner.map(item => {return item.owner.toString();}).indexOf(req.body.owner), 1);
            logger.info(partner.partner_owner.length);
            partner.save(err => {
              res.json({err: err});
            });
          } else {
            res.json({err: "Partner not found"});
          }
        });
      });
    } else {
      res.json({err: "Owner not found"});
    }
  });
}
router.setStatus = (req, res) => {
  logger.info('/partners/status/');
  logger.info(req.body);
  if (!req.body || !req.body.owner || !req.body.id || !req.body.name || req.body.value === undefined) {
    res.status(400).send("NO DATA");
  } else {
    Models.User.
    findOne({_id: req.body.owner})
    .select({partners:1})
    .exec((err, user) => {
      if (err || !user) {
        logger.info('user err');
        logger.info(err);
        res.status(400).send(err);
      } else {
        for (var a=0;a<user.partners.length;a++) {
          if (user.partners[a].partner._id.toString() === req.body.id) {
            user.partners[a][req.body.name] = req.body.value;
            logger.info(user.partners[a]);
          }
        }
        user.save((err) => {
          logger.info(err);
          if (err) {
            logger.info('save user err');
            logger.info(err);
            res.status(400).send(err);
          } else {
            logger.info("save user success 2");
            logger.info(req.body);
            res.json(req.body);                    
          }
        });
      }
    });

  }
}

router.setCategories = (req, res) => {
  logger.info('/partners/categories/');
  logger.info(req.body);
  if (!req.body || !req.body.owner || !req.body.id || !req.body.category || req.body.value === undefined) {
    res.status(400).send("NO DATA");
  } else {
    Models.User.
    findOne({_id: req.body.owner})
    .select({partners:1})
    .exec((err, user) => {
      if (err || !user) {
        logger.info('user err');
        logger.info(err);
        res.status(400).send(err);
      } else {
        for (var a=0;a<user.partners.length;a++) {
          if (user.partners[a].partner._id.toString() === req.body.id) {
            if (req.body.value==="true") {
              user.partners[a].categories.push(req.body.category)
            } else {
              logger.info("req.body.category");
              logger.info(req.body.category);
              logger.info(user.partners[a].categories.map(item => {return item.toString()}));
              user.partners[a].categories.splice(user.partners[a].categories.map(item => {return item.toString()}).indexOf(req.body.category))
            }
            logger.info(user.partners[a].categories);
          }
        }
        user.save((err) => {
          logger.info(err);
          if (err) {
            logger.info('save user err');
            logger.info(err);
            res.status(400).send(err);
          } else {
            logger.info("save user success 3");
            //logger.info(req.body);
            res.json(req.body);                    
          }
        });
      }
    });

  }
}

router.addContacts = (req, res) => {
  logger.info('/partners/contacts/add/');
  logger.info(req.body);
  Models.User.
  findOne({_id: req.body.crew})
  .exec((err, user) => {
  //select({stagename: 1, createdAt: 1, crews:1}).
    if (err || !user) {
      logger.info('user err');
      logger.info(err);
      res.status(400).send(err);
    } else {
      delete req.body.crew;
      if (req.body.index) {
        user.organizationData.contacts.splice(req.body.index, 1, req.body);
      } else {
        logger.info(user);
        logger.info("useruseruseruseruseruseruseruseruseruseruseruser");
        delete req.body.index;
        delete req.body.stagename;
        if (!user.organizationData) user.organizationData = {};
        if (!user.organizationData.contacts || !user.organizationData.contacts.length) {
          user.organizationData.contacts = [req.body];
        } else {
          user.organizationData.contacts.push(req.body);
        }
      };
      logger.info(user.organizationData.contacts[0]);
      user.save((err) => {
        logger.info(err);
        if (err) {
          logger.info('save user err');
          logger.info(err);
          res.status(400).send(err);
        } else {
          logger.info("save user success 4");
          logger.info(user.organizationData.contacts);
          res.json(user.organizationData.contacts);                    
        }
      });
    }
  });
}

router.deleteContacts = (req, res) => {
  logger.info('/partners/contacts/deleteContacts/');
  logger.info(req.body);
  Models.User.
  findOne({_id: req.body.id})
  .exec((err, user) => {
  //select({stagename: 1, createdAt: 1, crews:1}).
    logger.info('stocazzo');
    logger.info(user);
    if (err || !user) {
      logger.info('user err');
      logger.info(err);
      res.status(400).send(err);
    } else {
      logger.info(req.body.index);
      user.organizationData.contacts.splice(req.body.index, 1);
      logger.info(user.organizationData.contacts);   
      user.save((err) => {
        logger.info(err);
        if (err) {
          logger.info('save user err');
          logger.info(err);
          res.status(400).send(err);
        } else {
          logger.info("save user success 5");
          logger.info(user.organizationData.contacts);
          res.json(user.organizationData.contacts);                    
        }
      });
    }
  });
}


router.updatePartnerships = async (req, res) => {
  logger.info("updatePartnerships");
  logger.info("req.body");
  logger.info(req.body);
  let event;
  try {
    event = await   Models.Event
    .findOne({_id: req.body.event},'partnerships');
  
    if (!event) {
      logger.info(`${JSON.stringify(err)}`);
      return res.status(500).json(err);
    }
  } catch (err) {
    return res.status(500).json(err);
  }

  event.partners = req.body.partnerships;
  
  try {
    event.save()
  } catch (err) {
    return res.status(500).json(err);
  }

  let partner;
  if (req.body.partner) {
    try {
      partner = await Models.User
      .findOne({_id: req.body.partner},'partnerships');  
      if (!partner) {
        logger.info(`${JSON.stringify(err)}`);
        return res.status(500).json(err);
      }
    } catch (err) {
      return res.status(500).json(err);
    }

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
    try {
      partner.save()
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json(err);
  }
}

router.updateProgram = (req, res) => {
  logger.info("updateProgram");
  logger.info("req.body");
  logger.info(req.body);
  var performances = [];
  var programIDS = [];
  var program = [];
  var eventProgram = [];
  var promises = [];
  var promisesPerf = [];
  if (req.body.tobescheduled && req.body.tobescheduled.length) {
    for (var a=0;a<req.body.tobescheduled.length;a++) {
      var index = programIDS.indexOf(req.body.tobescheduled[a]._id);
      logger.info("req.body.tobescheduled[a]");
      logger.info(req.body.tobescheduled[a]);
      if (index===-1) {
        programIDS.push(req.body.tobescheduled[a]._id);
        program.push(req.body.tobescheduled[a]);
      } else {
        console.log("DOPPIO TO BE SCHEDULED!!!");
      }
    }  
  }  
  if (req.body.data && req.body.data.length) {
    for (var a=0;a<req.body.data.length;a++) {
      var index = programIDS.indexOf(req.body.data[a]._id);
      logger.info("req.body.data[a]");
      logger.info(req.body.data[a]);
      if (index===-1) {
        programIDS.push(req.body.data[a]._id);
        program.push(req.body.data[a]);
      } else {
        if (!program[index].schedule) program[index].schedule = [];
        program[index].schedule.push(req.body.data[a].schedule[0]);
      }
    } 
  }
  for (var a=0;a<program.length;a++) {
    eventProgram.push({subscription_id: program[a]._id, performance: program[a].performance, schedule: !program[a].schedule ? [] : program[a].schedule});
    if (program[a].performance.toString() == "60ef195282f94366b0a464d2") {
      logger.info("60ef195282f94366b0a464d260ef195282f94366b0a464d2");
      logger.info(program[a]._id);
      logger.info(program[a].schedule);
    }
    promises.push(Models.Program.findOneAndUpdate({_id: program[a]._id}, { $set: { schedule: !program[a].schedule ? [] : program[a].schedule }}, {upsert: true, useFindAndModify: false}));
  }
  logger.info("eventProgram");
  logger.info(eventProgram);
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
        logger.info("resultsPromisePerf[a].bookings")
        logger.info(resultsPromisePerf[a].title)
        logger.info(req.body.event)
        promisesPerfSave.push(Models.Performance.updateOne({_id:resultsPromisePerf[a]._id}, resultsPromisePerf[a]));
      }
      Promise.all(
        promisesPerfSave
      ).then( (resultsPromisePerfSave) => {
        const acceptedonly = false;
        if (acceptedonly) {
          Models.Event.findOneAndUpdate({_id:program[0].event}, {$set: {program: eventProgram}}, {upsert: true, useFindAndModify: false}).exec((err, result) => {
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
router.contact = async (req, res) => {
  logger.info("req.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.body");
  logger.info(req.body);
  if (req.body.user) {
    let message = {};
    let user;
    try {
      user = await Models.User
      .findOne({_id: req.body.user})
      .select({stagename: 1, slug:1, name:1, surname:1, email: 1, is_crew:1, is_banned:1})
      .populate([{ "path": "members", "select": "stagename name surname email", "model": "User"}])
      .exec();
      if (!user.is_banned) {
        message = {to: "Gianluca Del Gobbo <g.delgobbo@avnode.org>"};
        let messagetext = "FROM\n";
        messagetext+= "Stagename: "+req.user.stagename+"\n";
        messagetext+= "Name: "+req.user.name+"\n";
        messagetext+= "Surname: "+req.user.surname+"\n";
        messagetext+= "Email: "+req.user.email+"\n";
        messagetext+= "Link: https://"+req.headers.host+"/"+req.user.slug+"\n---------\n";
        messagetext+= "TO\n";
        messagetext+= "Stagename: "+req.user.stagename+"\n";
        if (!user.is_crew) {
          messagetext+= "Name: "+user.name+"\n";
          messagetext+= "Surname: "+user.surname+"\n";
          messagetext+= "Email: "+user.email+"\n";
        }
        messagetext+= "Link: http://"+req.headers.host+"/"+user.slug+"\n\n---------\n";
        messagetext+= req.body.message+"\n--------------";
        try {
          await mySendMailer({
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
          })
        } catch (error) {
          return res.json({error:error});
        }
        message = {bcc: "Gianluca Del Gobbo <g.delgobbo@avnode.org>"};
        if (user.is_crew) {
          logger.info("crew")
          for (var b=0;b<user.members.length;b++) {
            if (!message.to) {
              message.to = user.members[b].stagename+" <"+user.members[b].email+">";
            } else {
              if (!message.cc) message.cc = [];
              message.cc.push(user.members[b].stagename+" <"+user.members[b].email+">");
            }
            }
        } else {
          logger.info("single")
          if (!message.to) {
            message.to = user.stagename+" <"+user.email+">";
          } else {
            if (!message.cc) message.cc = [];
            message.cc.push(user.stagename+" <"+user.email+">");
          }
        }
        messagetext = "Dear "+user.stagename+",\nwe got this message, are you interested?\n\n---------\n"+req.body.message+"\n--------------";
        try {
          await mySendMailer({
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
          });
          return res.json({error:false, message: req.__("Messagge sent")});
        } catch (error) {
          return res.json({error:error});
        }
      } else {
        return res.json({error:true, message: req.__("User is banned")});
      }
    } catch (error) {
      return res.json({error:error, message: req.__("User do not exists")});
    }
  } else {
    return res.json({error:true, message: req.__("User is missing")});
  }
}

/* router.forceEmailChange = (req, res) => {
  logger.info("forceEmailChange");
  logger.info(req.body);
  if (req.body._id) {
    let message = {};

    Models.User
    .findOne({_id: req.body._id})
    .select({stagename: 1, slug:1, name:1, surname:1, email: 1, emails:1})
    .exec((err, user) => {
      logger.info(user);
      logger.info(user.emails.map((item)=>{return item.email}).indexOf(req.body.oldemail));
      const newemail = req.body.email
      const emailindex = user.emails.map((item)=>{return item.email}).indexOf(req.body.oldemail)
      const deaultmailinglists = { flxer: false, flyer: false, livevisuals: true, updates: true };
      var keys = Object.keys(deaultmailinglists);

      var sendytopics = keys.filter(function(key) {
          return deaultmailinglists[key]
      });
      logger.info(sendytopics);
      if (emailindex == -1 && user.email != req.body.oldemail) {
        res.json({errors:{message:"Email not Found"}});
      } else {
        if (emailindex != -1) {
          logger.info(user.emails[emailindex].mailinglists);
          user.emails[emailindex].email = newemail;
          user.emails[emailindex].mailinglists = deaultmailinglists;
        }
        if (user.email == req.body.oldemail) {
          user.email = newemail;
        }
        let formData = {
          list: 'AXRGq2Ftn2Fiab3skb5E892g',
          api_key: process.env.SENDYAPIKEY,
          email: newemail,
          Topics: sendytopics,
          avnode_id: user._id.toString(),
          avnode_slug: user.slug,
          avnode_email: newemail,
          boolean: true
        };
        if (user.name) formData.Name = user.name;
        if (user.surname) formData.Surname = user.surname;
        if (user.stagename) formData.Stagename = user.stagename;
        if (user.addresses && user.addresses[0] && user.addresses[0].locality) formData.Location = req.user.addresses[0].locality;
        if (user.addresses && user.addresses[0] && user.addresses[0].country) formData.Country = req.user.addresses[0].country;
        if (user.addresses && user.addresses[0] && user.addresses[0].geometry && user.addresses[0].geometry.lat) formData.LATITUDE = user.addresses[0].geometry.lat;
        if (user.addresses && user.addresses[0] && user.addresses[0].geometry && user.addresses[0].geometry.lng) formData.LONGITUDE = user.addresses[0].geometry.lng;
        Models.User.updateOne({_id:user._id}, { emails: user.emails, email: user.email })
        .exec((err, user) => {
          logger.info("formData");
          logger.info(formData);
                  
          // form data
          var postData = querystring.stringify(formData);
      
          axios.post('https://ml.avnode.net/subscribe', postData)
          .then(
            (response) => {
              if (response.data === 1) {
                res.json({message:"User is saved"});
              } else {
                res.json({error:{message:response.data}});
              }
            },
            (error) => {
              res.json({error:{message:"User is NOT saved"}});
          });
        });
      }
     /*  if (!is_banned) {
        logger.info(user);
        logger.info(err);
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
        logger.info(messagetext);
        const mailer = require('../../../utilities/mailer');
       mySendMailer({
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
              logger.info("crew")
              for (var b=0;b<user.members.length;b++) {
                if (!message.to) {
                  message.to = user.members[b].stagename+" <"+user.members[b].email+">";
                } else {
                  if (!message.cc) message.cc = [];
                  message.cc.push(user.members[b].stagename+" <"+user.members[b].email+">");
                }
                }
            } else {
              logger.info("single")
              if (!message.to) {
                message.to = user.stagename+" <"+user.email+">";
              } else {
                if (!message.cc) message.cc = [];
                message.cc.push(user.stagename+" <"+user.email+">");
              }
            }
            messagetext = "Dear "+user.stagename+",\nwe got this message, are you interested?\n\n---------\n"+req.body.message+"\n--------------";
           mySendMailer({
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

      } else {
        res.json({message:"User is banned"});
      } */
   /* });
  } else {
    res.json({message:"User do not exists"});
  }
} */



router.bookingRequest = async (req, res) => {
  logger.info("req.body");
  logger.info(req.body);
  if (req.body.perf) {
    let message = {};
    let perf;
    try {
      perf = await Models.Performance
      .findOne({_id: req.body.perf/* , members:req.user.id */})
      .select({title: 1, slug: 1})
      .populate([{ "path": "users", "select": "is_crew stagename name surname email", "model": "User", "populate": { "path": "members", "select": "stagename name surname email", "model": "User"}}])
      .exec()        
    } catch (error) {
      return res.json({error:error, message:"Performance do not exists"});
    }
    logger.info("perf");
    logger.info(perf);
    if (!perf) return res.json({error:error, message:"Performance do not exists"});
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
    logger.info(messagetext);
    try {
      logger.info("mySendMailer 1");
      await mySendMailer({
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
      })          
      return res.json({error:false, message: req.__("Messagge sent")});
    } catch (error) {
      res.json({error:error, message:"SendMailer error"});
    }
    message = {bcc: "Gianluca Del Gobbo <g.delgobbo@avnode.org>"};
    for (var a=0;a<perf.users.length;a++) {
      if (perf.users[a].is_crew) {
        logger.info("crew")
        for (var b=0;b<perf.users[a].members.length;b++) {
          if (!message.to) {
            message.to = perf.users[a].members[b].stagename+" <"+perf.users[a].members[b].email+">";
          } else {
            if (!message.cc) message.cc = [];
            message.cc.push(perf.users[a].members[b].stagename+" <"+perf.users[a].members[b].email+">");
          }
          }
      } else {
        logger.info("single")
        if (!message.to) {
          message.to = perf.users[a].stagename+" <"+perf.users[a].email+">";
        } else {
          if (!message.cc) message.cc = [];
          message.cc.push(perf.users[a].stagename+" <"+perf.users[a].email+">");
        }
      }
    }
    messagetext = "Dear "+perf.users[0].stagename+",\nwe got this booking request, are you interested?\n\n---------\n"+req.body.request+"\n--------------";
    try {
      logger.info("mySendMailer 2");
      mySendMailer({
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
      })  
    } catch (error) {
      res.json({error:error, message:"SendMailer error"});
    }
    /* program.save(err => {
      res.json({res: err ? err : true});
    }); */
  } else {
    res.json({error:true, message:"Performance do not exists"});
  }
}

router.updateSubscription = (req, res) => {
  //logger.info("updateSubscription");

/*   const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

  // 1b. Import the PayPal SDK client that was created in `Set up the Server SDK`.
  // * PayPal HTTP client dependency
  const payPalClient = require('./paypalClient');
  
  // 2. Set up your server to receive a call from the client
  export default async function handleRequest(req, res) {
  
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
            if (program.subscriptions[a].packages[b].name == req.body.package_name) {
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
    Models.Program
    .findOne({_id: req.body.id/* , members:req.user.id */})
    .select({schedule: 1, call: 1, event: 1})
    .populate([{ "path": "status", "select": "name", "model": "Category"},{ "path": "performance", "select": "title", "model": "Performance"},{ "path": "reference", "select": "stagename name surname email mobile", "model": "User"}])
    .exec((err, sub) => {
      //logger.info(sub);
      Models.Event
      .findOne({_id: sub.event})
      .select({program: 1, organizationsettings: 1})
      .exec((err, event) => {
        /* logger.info(event.organizationsettings.call.calls[sub.call].email);
        event.program.forEach((program, index) => {
          logger.info(program);
          if (program.subscription_id == req.body.id) {
            //event.program[index].schedule.status = req.body.status;
            program.status = req.body.status;
          }
          logger.info(program);
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
          //logger.info("sub.save");
          //logger.info(sub.call);
          //logger.info(sub.status);
          //event.save(function(err){
            if(!err) {
              if (sub.call >= 0 && event.organizationsettings.call && event.organizationsettings.call.calls && event.organizationsettings.call.calls[sub.call] && event.organizationsettings.call.calls[sub.call].email) {
                const auth = {
                  user: event.organizationsettings.call.calls[sub.call].emailuser,
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
                  subject: req.__("Submission UPDATES") + " | " + sub.performance.title + " | " + event.organizationsettings.call.calls[sub.call].title,
                  text: email
                };
                //logger.info("pre gMailer")
                gMailer({auth:auth, mail:mail}, function (err, result){
                  //logger.info("gMailer");
                  //logger.info(err);
                  //logger.info("gMailer");
                  //logger.info(result);
                  if (err) {
                    logger.info("Email sending failure");
                    res.json({error: true, msg: "Email sending failure", err: err});
                  } else {
                    logger.info("Email sending OK");
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
    logger.info("formData");
    logger.info(formData);
  
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
    var req = https.request(options, function (resres) {
      var result = '';
      resres.on('data', function (chunk) {
        result += chunk;
      });
      resres.on('end', function (err) {
        res.json(err);
      });
      resres.on('error', function (err) {
        res.json(err);
      })
    });
    
    // req error
    req.on('error', function (err) {
      logger.info(err);
    });
    
    //send request witht the postData form
    req.write(postData);
    req.end();

    axios.post('https://ml.avnode.net/subscribe', formData)
    .then((response) => {
        logger.info("Newsletter");
        logger.info(response);
        res.json({message:"User is saved"});
    });
    //logger.info(mailinglists.join(','));  }
  //}
}

export default router;
