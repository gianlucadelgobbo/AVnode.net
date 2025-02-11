import createRouter from "../../router.js";
const router = createRouter();

import config from 'getconfig';
import moment from 'moment';
import helpers from './helpers.js';

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
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Program': mongoose.model('Program'),
  'Video': mongoose.model('Video'),
  'Order': mongoose.model('Order')
}
import { info, debugLog, error } from '../../../utilities/logger.js';


export const postData = (req, res) => {
  debugLog("postData");
  debugLog("req.body");
  debugLog('');
  debugLog(req.body);
  debugLog("req.params");
  debugLog(req.params);
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms.new) {
    debugLog('BINGO');
    let select = Object. assign({}, config.cpanel[req.params.sez].forms.new.select);
    let selectaddon = config.cpanel[req.params.sez].forms.new.selectaddon;
    let post = {};

    helpers.myExternalUrl(req, (err) => {
      debugLog("myExternalUrl result");
      debugLog(req.body);
      if (req.params.sez == "videos" && req.body.media && req.body.media.externalurl) {
        select.image = 1;
        select.media = 1;
        //select.is_public = 1;
        select.abouts = 1;
      }
      helpers.mySlugify(Models[config.cpanel[req.params.sez].model], req.body.stagename ? req.body.stagename : req.body.title, (slug) => {
        req.body.slug = slug;
        debugLog("slug");
        debugLog(slug);
        //for (const item in select) if(req.body[item]) post[item] = req.body[item];
        // db.users.updateOne({slug:'gianlucadelgobbo'},{$unset: {oldpassword:""}});
        debugLog('select');
        debugLog(select);
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
        debugLog('postpostpostpostpostpost');
        debugLog(post);
  
        Models[config.cpanel[req.params.sez].model]
        .create(post, (err, data) => {
          if (!err) {
            debugLog('create success');
            debugLog(data);
            var id;
            if (req.params.sez==="partners") {
              id = post.partner_owner[0].owner;
            } else {
              id = req.user.id;
            }
            Models['User']
            .findById(id, req.params.sez, (err, user) => {
              debugLog('findById user');
              debugLog(user);
              if (!err) {
                if (user) {
                  if (req.params.sez==="partners") {
                    user[req.params.sez].push({
                      is_selecta: true,
                      is_active: true,
                      partner: data._id
                    });                
                  } else {
                    user[req.params.sez].push(data._id);
                    debugLog('save user');
                    debugLog(user);
                  }
                  user.save((err) => {
                    if (err) {
                      debugLog('save user err');
                      debugLog(err);
                      res.status(400).send(err);
                    } else {
                      debugLog('save user success 1');
                      if (req.params.ancestor && req.params.id) {
                        Models[config.cpanel[req.params.ancestor].model]
                        .findById(req.params.id)
                        .exec((err, ancestor) => {
                          ancestor[req.params.sez].push(data._id);
                          ancestor.save((err) => {
                            if (err) {
                              debugLog('save ancestor err');
                              debugLog(err);
                              res.status(400).send(err);
                            } else {
                              debugLog("save ancestor success");
                              debugLog(data);
                              debugLog("stocazzooooooooooo");
                              debugLog(data);
                              var cloneData = JSON.parse(JSON.stringify(data));

                              if (req.body.admitted) cloneData.admitted = req.body.admitted
                              res.json(cloneData);                    
                            }
                          });
                        });
                      } else {
                        debugLog("stocazzo");
                        debugLog(req.body.admitted);
                        var cloneData = JSON.parse(JSON.stringify(data));

                        if (req.body.admitted) cloneData.admitted = req.body.admitted;
                        debugLog(cloneData);
                        res.json(cloneData);                    
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
                          debugLog('sendsendsendsendsendsendsend');
                          debugLog(send);
                          res.json(send);
                        }
                      }); */
                    }
                  });  
                } else {
                  res.status(404).send({ message: `DOC_NOT_FOUND` });
                }
              } else {
                res.status(500).send({ message: `${JSON.stringify(err)}` });
              }
            });
          } else {
            debugLog('create err');
            debugLog(err);
            res.status(400).send(err);
          }
        });
      });
    });

    
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

export const cancelSubscription = (req, res) => {
  debugLog(req.body);
  var err = [];
  Models.Program
  .findOne({_id: req.body.id/* , members:req.user.id */},'_id, event performance', (err, sub) => {
    if (err) {
      err.push(err);
      res.json(err);
    } else {
      debugLog("sub.event");
      debugLog(sub.event);
      debugLog("sub.performance");
      debugLog(sub.performance);
      Models.Event
      .findOne({_id: sub.event, "program.subscription_id": req.body.id},'_id, program', (err, event) => {
        if (err) {
          err.push(err);
          res.json(err);
        } else {
          debugLog("event.program");
          debugLog(event.program.length);
          event.program.forEach((program, index) => {
            if (program.subscription_id == req.body.id) {
              event.program.splice(index, 1);
            }
          });
          debugLog(event.program.length);
          Models.Performance
          .findOne({_id: sub.performance},'_id, bookings', (err, performance) => {
            if (err) {
              err.push(err);
              res.json(err);
            } else {
              debugLog("performance.bookings.length");
              debugLog(performance.bookings);
              performance.bookings.forEach((booking, index) => {
                if (booking.subscription_id == req.body.id) {
                  performance.bookings.splice(index, 1);
                }
              });
              debugLog(performance.bookings.length);
              event.save(function(err){
                performance.save(function(err){
                  sub.remove(function(err){
                    debugLog("SUCCESSO!!!");
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

export const editSubscriptionSave = (req, res) => {
  debugLog("editSubscriptionSave");
  debugLog("req.body");
  debugLog(req.body);
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
            debugLog({_id: program.performance});
            for(var a=0;a<performance.bookings.length;a++){
              if (performance.bookings[a].event && performance.bookings[a].event.toString()===program.event.toString()) {
                performance.bookings[a].schedule = program.schedule;
              }
            }
            debugLog(performance.bookings);
            performance.save(function(err){
              Models.Event.findOne({"program.subscription_id": req.body.program})
              .exec((err, event) => {
                debugLog(event.program);
                for(var a=0;a<event.program.length;a++){
                  if (event.program[a].subscription_id.toString()===req.body.program.toString()) {
                    event.program[a].schedule = program.schedule;
                  }
                }
                debugLog(event.program);
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
          debugLog("subscriptions[item].packages");
          debugLog(subscriptions[item].packages);  
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

export const shareOnTelegram = (req, res) => {

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
export const setReordered = (req, res) => {
  debugLog(req.body);
  Models[req.body.model]
  .findOne({_id: req.body.id}, (err, item) => {
    if (item) {
      item[req.body.link] = req.body.obj;
      debugLog(item[req.body.link]);
      item.save(err => {
        res.json({err: err});
      });
    } else {
      res.json({err: "Item not found"});
    }
  });
}
export const setVideoCategory = (req, res) => {
  debugLog(req.body);
  Models.Video
  .findOne({_id: req.body.id},'_id, categories', (err, video) => {
    if (video) {
      video.categories = req.body.categories;
      debugLog(video);
      video.save(err => {
        res.json({err: err});
      });
    } else {
      res.json({err: "Video not found"});
    }
  });
}
export const setVideoExclude = (req, res) => {
  debugLog(req.body);
  Models.Video
  .findOne({_id: req.body.id},'_id', (err, video) => {
    if (video) {
      video.vjtv_exclude = req.body.vjtv_exclude;
      debugLog(video);
      video.save(err => {
        res.json({err: err});
      });
    } else {
      res.json({err: "Video not found"});
    }
  });
}

export const editSubscription = (req, res) => {
  debugLog(req.body);
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
    debugLog(sub);
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
      debugLog(err);
      debugLog("sub");
      res.json(body);
    });
  });
}

export const editSubscriptionPrice = (req, res) => {
  debugLog(req.body);
  Models.Program
  .findOne({_id: req.body.id/* , members:req.user.id */})
  .select({schedule: 1})
  .exec((err, sub) => {
    res.render('adminpro/events/acts-edit-sub-price', {sub: sub}, function(err, body) {
      res.json(body);
    });
  });
}

export const editSubscriptionCost = (req, res) => {
  debugLog(req.body);
  Models.Program
  .findOne({_id: req.body.id/* , members:req.user.id */})
  .select({fee: 1, technical_cost: 1, accommodation_cost: 1, transfer_cost: 1})
  .exec((err, sub) => {
    res.render('adminpro/events/acts-edit-sub-cost', {sub: sub}, function(err, body) {
      res.json(body);
    });
  });
}

export const linkPartner = (req, res) => {
  debugLog(req.body);
  Models.User
  .findOne({_id: req.body.id, is_crew: true},'_id partner_owner', (err, partner) => {
    debugLog("eq.body");
    debugLog(err || partner);
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
                debugLog("owner.partners");
                debugLog(owner.partners);
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
            debugLog("owner");
            if (!owner.partners || owner.partners.map(item => {return item.partner.toString();}).indexOf(req.body.id)===-1) {
              if (!owner.partners) owner.partners = [];
              owner.partners.push({partner: req.body.id, delegate: req.body.delegate, "is_active":true, "is_selecta":true});
              debugLog("owner.partners");
              debugLog(owner.partners.map(item => {return item.partner.toString();}).indexOf(req.body.id));
              owner.save(err => {
                res.json({err: err});
              });
            } else {
              debugLog({err: "Partner already in"});
              debugLog(owner.partners[owner.partners.map(item => {return item.partner.toString();}).indexOf(req.body.id)]);
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

export const unlinkPartner = (req, res) => {
  debugLog("unlinkPartner");
  debugLog(req.body);
  Models.User
  .findOne({_id: req.body.owner, /* is_crew: true,  */"partners.partner": req.body.id},'_id event partners', (err, user) => {
    debugLog(user.partners.length);
    if (user && user.partners && user.partners.length) {
      user.partners.splice(user.partners.map(item => {return item.partner.toString();}).indexOf(req.body.id), 1);
      debugLog(user.partners.length);
      user.save(err => {
        Models.User
        .findOne({_id: req.body.id, /* is_crew: true,  */"partner_owner.owner": req.body.owner},'_id event partner_owner', (err, partner) => {
          debugLog(partner.partner_owner.length);
          if (partner && partner.partner_owner && partner.partner_owner.length) {
            partner.partner_owner.splice(partner.partner_owner.map(item => {return item.owner.toString();}).indexOf(req.body.owner), 1);
            debugLog(partner.partner_owner.length);
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
export const setStatus = (req, res) => {
  debugLog('/partners/status/');
  debugLog(req.body);
  if (!req.body || !req.body.owner || !req.body.id || !req.body.name || req.body.value === undefined) {
    res.status(400).send("NO DATA");
  } else {
    Models.User.
    findOne({_id: req.body.owner})
    .select({partners:1})
    .exec((err, user) => {
      if (err || !user) {
        debugLog('user err');
        debugLog(err);
        res.status(400).send(err);
      } else {
        for (var a=0;a<user.partners.length;a++) {
          if (user.partners[a].partner._id.toString() === req.body.id) {
            user.partners[a][req.body.name] = req.body.value;
            debugLog(user.partners[a]);
          }
        }
        user.save((err) => {
          debugLog(err);
          if (err) {
            debugLog('save user err');
            debugLog(err);
            res.status(400).send(err);
          } else {
            debugLog("save user success 2");
            debugLog(req.body);
            res.json(req.body);                    
          }
        });
      }
    });

  }
}

export const setCategories = (req, res) => {
  debugLog('/partners/categories/');
  debugLog(req.body);
  if (!req.body || !req.body.owner || !req.body.id || !req.body.category || req.body.value === undefined) {
    res.status(400).send("NO DATA");
  } else {
    Models.User.
    findOne({_id: req.body.owner})
    .select({partners:1})
    .exec((err, user) => {
      if (err || !user) {
        debugLog('user err');
        debugLog(err);
        res.status(400).send(err);
      } else {
        for (var a=0;a<user.partners.length;a++) {
          if (user.partners[a].partner._id.toString() === req.body.id) {
            if (req.body.value==="true") {
              user.partners[a].categories.push(req.body.category)
            } else {
              debugLog("req.body.category");
              debugLog(req.body.category);
              debugLog(user.partners[a].categories.map(item => {return item.toString()}));
              user.partners[a].categories.splice(user.partners[a].categories.map(item => {return item.toString()}).indexOf(req.body.category))
            }
            debugLog(user.partners[a].categories);
          }
        }
        user.save((err) => {
          debugLog(err);
          if (err) {
            debugLog('save user err');
            debugLog(err);
            res.status(400).send(err);
          } else {
            debugLog("save user success 3");
            //debugLog(req.body);
            res.json(req.body);                    
          }
        });
      }
    });

  }
}

export const addContacts = (req, res) => {
  debugLog('/partners/contacts/add/');
  debugLog(req.body);
  Models.User.
  findOne({_id: req.body.crew})
  .exec((err, user) => {
  //select({stagename: 1, createdAt: 1, crews:1}).
    if (err || !user) {
      debugLog('user err');
      debugLog(err);
      res.status(400).send(err);
    } else {
      delete req.body.crew;
      if (req.body.index) {
        user.organizationData.contacts.splice(req.body.index, 1, req.body);
      } else {
        debugLog(user);
        debugLog("useruseruseruseruseruseruseruseruseruseruseruser");
        delete req.body.index;
        delete req.body.stagename;
        if (!user.organizationData) user.organizationData = {};
        if (!user.organizationData.contacts || !user.organizationData.contacts.length) {
          user.organizationData.contacts = [req.body];
        } else {
          user.organizationData.contacts.push(req.body);
        }
      };
      debugLog(user.organizationData.contacts[0]);
      user.save((err) => {
        debugLog(err);
        if (err) {
          debugLog('save user err');
          debugLog(err);
          res.status(400).send(err);
        } else {
          debugLog("save user success 4");
          debugLog(user.organizationData.contacts);
          res.json(user.organizationData.contacts);                    
        }
      });
    }
  });
}

export const deleteContacts = (req, res) => {
  debugLog('/partners/contacts/deleteContacts/');
  debugLog(req.body);
  Models.User.
  findOne({_id: req.body.id})
  .exec((err, user) => {
  //select({stagename: 1, createdAt: 1, crews:1}).
    debugLog('stocazzo');
    debugLog(user);
    if (err || !user) {
      debugLog('user err');
      debugLog(err);
      res.status(400).send(err);
    } else {
      debugLog(req.body.index);
      user.organizationData.contacts.splice(req.body.index, 1);
      debugLog(user.organizationData.contacts);   
      user.save((err) => {
        debugLog(err);
        if (err) {
          debugLog('save user err');
          debugLog(err);
          res.status(400).send(err);
        } else {
          debugLog("save user success 5");
          debugLog(user.organizationData.contacts);
          res.json(user.organizationData.contacts);                    
        }
      });
    }
  });
}


export const updatePartnerships = (req, res) => {
  debugLog("updatePartnerships");
  debugLog("req.body");
  debugLog(req.body);
  Models.Event
  .findOne({_id: req.body.event},'partnerships', (err, event) => {
    event.partners = req.body.partnerships;
    event.save(err => {
      if (req.body.partner) {
        Models.User
        .findOne({_id: req.body.partner},'partnerships', (err, partner) => {
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
            res.json(err);
          });
        });
      } else {
        res.json(err);
      }
    });
  });
}

export const updateProgram = (req, res) => {
  debugLog("updateProgram");
  debugLog("req.body");
  debugLog(req.body);
  var performances = [];
  var programIDS = [];
  var program = [];
  var eventProgram = [];
  var promises = [];
  var promisesPerf = [];
  if (req.body.tobescheduled && req.body.tobescheduled.length) {
    for (var a=0;a<req.body.tobescheduled.length;a++) {
      var index = programIDS.indexOf(req.body.tobescheduled[a]._id);
      debugLog("req.body.tobescheduled[a]");
      debugLog(req.body.tobescheduled[a]);
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
      debugLog("req.body.data[a]");
      debugLog(req.body.data[a]);
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
      debugLog("60ef195282f94366b0a464d260ef195282f94366b0a464d2");
      debugLog(program[a]._id);
      debugLog(program[a].schedule);
    }
    promises.push(Models.Program.findOneAndUpdate({_id: program[a]._id}, { $set: { schedule: !program[a].schedule ? [] : program[a].schedule }}, {upsert: true, useFindAndModify: false}));
  }
  debugLog("eventProgram");
  debugLog(eventProgram);
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
        debugLog("resultsPromisePerf[a].bookings")
        debugLog(resultsPromisePerf[a].title)
        debugLog(req.body.event)
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
export const contact = (req, res) => {
  debugLog("req.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.body");
  debugLog(req.body);
  if (req.body.user) {
    let message = {};

    Models.User
    .findOne({_id: req.body.user})
    .select({stagename: 1, slug:1, name:1, surname:1, email: 1, is_crew:1, is_banned:1})
    .populate([{ "path": "members", "select": "stagename name surname email", "model": "User"}])
    .exec((err, user) => {
      if (!user.is_banned) {
        debugLog(user);
        debugLog(err);
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
        debugLog(messagetext);
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
              debugLog("crew")
              for (var b=0;b<user.members.length;b++) {
                if (!message.to) {
                  message.to = user.members[b].stagename+" <"+user.members[b].email+">";
                } else {
                  if (!message.cc) message.cc = [];
                  message.cc.push(user.members[b].stagename+" <"+user.members[b].email+">");
                }
                }
            } else {
              debugLog("single")
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

export const forceEmailChange = (req, res) => {
  debugLog("forceEmailChange");
  debugLog(req.body);
  if (req.body._id) {
    let message = {};

    Models.User
    .findOne({_id: req.body._id})
    .select({stagename: 1, slug:1, name:1, surname:1, email: 1, emails:1})
    .exec((err, user) => {
      debugLog(user);
      debugLog(user.emails.map((item)=>{return item.email}).indexOf(req.body.oldemail));
      const newemail = req.body.email
      const emailindex = user.emails.map((item)=>{return item.email}).indexOf(req.body.oldemail)
      const deaultmailinglists = { flxer: false, flyer: false, livevisuals: true, updates: true };
      var keys = Object.keys(deaultmailinglists);

      var sendytopics = keys.filter(function(key) {
          return deaultmailinglists[key]
      });
      debugLog(sendytopics);
      if (emailindex == -1 && user.email != req.body.oldemail) {
        res.json({errors:{message:"Email not Found"}});
      } else {
        if (emailindex != -1) {
          debugLog(user.emails[emailindex].mailinglists);
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
          debugLog("formData");
          debugLog(formData);
                  
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
        debugLog(user);
        debugLog(err);
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
        debugLog(messagetext);
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
              debugLog("crew")
              for (var b=0;b<user.members.length;b++) {
                if (!message.to) {
                  message.to = user.members[b].stagename+" <"+user.members[b].email+">";
                } else {
                  if (!message.cc) message.cc = [];
                  message.cc.push(user.members[b].stagename+" <"+user.members[b].email+">");
                }
                }
            } else {
              debugLog("single")
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
    });
  } else {
    res.json({message:"User do not exists"});
  }
}



export const bookingRequest = (req, res) => {
  debugLog(req.body);
  if (req.body.perf) {
    let message = {};

    Models.Performance
    .findOne({_id: req.body.perf/* , members:req.user.id */})
    .select({title: 1, slug: 1})
    .populate([{ "path": "users", "select": "is_crew stagename name surname email", "model": "User", "populate": { "path": "members", "select": "stagename name surname email", "model": "User"}}])
    .exec((err, perf) => {
      debugLog(perf.users);
      debugLog(err);
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
      debugLog(messagetext);
     mySendMailer({
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
              debugLog("crew")
              for (var b=0;b<perf.users[a].members.length;b++) {
                if (!message.to) {
                  message.to = perf.users[a].members[b].stagename+" <"+perf.users[a].members[b].email+">";
                } else {
                  if (!message.cc) message.cc = [];
                  message.cc.push(perf.users[a].members[b].stagename+" <"+perf.users[a].members[b].email+">");
                }
                }
            } else {
              debugLog("single")
              if (!message.to) {
                message.to = perf.users[a].stagename+" <"+perf.users[a].email+">";
              } else {
                if (!message.cc) message.cc = [];
                message.cc.push(perf.users[a].stagename+" <"+perf.users[a].email+">");
              }
            }
          }
          messagetext = "Dear "+perf.users[0].stagename+",\nwe got this booking request, are you interested?\n\n---------\n"+req.body.request+"\n--------------";
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
      /* program.save(err => {
        res.json({res: err ? err : true});
      }); */
    });
  } else {
    res.json({message:"Performance do not exists"});
  }
}

export const updateSubscription = (req, res) => {
  //debugLog("updateSubscription");

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
      //debugLog(sub);
      Models.Event
      .findOne({_id: sub.event})
      .select({program: 1, organizationsettings: 1})
      .exec((err, event) => {
        /* debugLog(event.organizationsettings.call.calls[sub.call].email);
        event.program.forEach((program, index) => {
          debugLog(program);
          if (program.subscription_id == req.body.id) {
            //event.program[index].schedule.status = req.body.status;
            program.status = req.body.status;
          }
          debugLog(program);
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
          //debugLog("sub.save");
          //debugLog(sub.call);
          //debugLog(sub.status);
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
                  subject: __("Submission UPDATES") + " | " + sub.performance.title + " | " + event.organizationsettings.call.calls[sub.call].title,
                  text: email
                };
                //debugLog("pre gMailer")
                gMailer({auth:auth, mail:mail}, function (err, result){
                  //debugLog("gMailer");
                  //debugLog(err);
                  //debugLog("gMailer");
                  //debugLog(result);
                  if (err) {
                    debugLog("Email sending failure");
                    res.json({error: true, msg: "Email sending failure", err: err});
                  } else {
                    debugLog("Email sending OK");
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

export const updateSendy = function (req, res) {
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
    debugLog("formData");
    debugLog(formData);
  
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
      resres.on('end', function (error) {
        res.json(error);
      });
      resres.on('error', function (err) {
        res.json(err);
      })
    });
    
    // req error
    req.on('error', function (err) {
      debugLog(err);
    });
    
    //send request witht the postData form
    req.write(postData);
    req.end();

    axios.post('https://ml.avnode.net/subscribe', formData)
    .then((response) => {
        debugLog("Newsletter");
        debugLog(response);
        res.json({message:"User is saved"});
    });
    //debugLog(mailinglists.join(','));  }
  //}
}

export default router;
