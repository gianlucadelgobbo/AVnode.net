const router = require('../../router')();
let config = require('getconfig');

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
  'Video': mongoose.model('Video')
}
const logger = require('../../../utilities/logger');

router.postData = (req, res) => {
  logger.debug('req.body');
  logger.debug(req.body);
  logger.debug('req.params');
  logger.debug(req.params);
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms.new) {
    let select = config.cpanel[req.params.sez].forms.new.select;
    let selectaddon = config.cpanel[req.params.sez].forms.new.selectaddon;
    let post = {};
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
                    res.status(400).json(err);
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
                            res.status(400).json(err);
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
                        res.status(500).json({ error: `${JSON.stringify(err)}` });
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
              res.status(204).json({ error: `DOC_NOT_FOUND` });
            }
          } else {
            res.status(500).json({ error: `${JSON.stringify(err)}` });
          }
        });
      } else {
        logger.debug('create err');
        logger.debug(err);
        res.status(400).json(err);
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
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
  /* var obj = {
    subscriptions: req.body.subscriptions.filter(item => item.subscriber_id!=""),
    reference: req.body.reference
  }
  Models.Program.findOneAndUpdate({_id: req.body.program}, obj, {upsert: false}, function(err){
    logger.debug(err);
    res.json({err:err} || {success: true});
  }); */
  Models.Program.findOne({_id: req.body.program})
  .exec((err, program) => {
    logger.debug(req.body);
    var subscriptions = req.body.subscriptions.filter(item => item.subscriber_id!="" && item.freezed!="1");
    var subscriptions_freezed = req.body.subscriptions.filter(item => item.subscriber_id!="" && item.freezed=="1").map(item => {return item.subscriber_id.toString()});
    logger.debug("subscriptions");
    logger.debug(subscriptions);
    logger.debug("subscriptions_freezed");
    logger.debug(subscriptions_freezed);
    for (var item=0;item<subscriptions.length;item++) {
      subscriptions[item].packages = JSON.parse("["+subscriptions[item].packages+"]");
    }
    for (var item=0;item<program.subscriptions.length;item++) {
      logger.debug("program.subscriptions");
      logger.debug(program.subscriptions[item].subscriber_id);
      if (subscriptions_freezed.indexOf(program.subscriptions[item].subscriber_id.toString())!=-1) {
        program.subscriptions[item].freezed = true;
        subscriptions.push(program.subscriptions[item]);
      }
    }
    logger.debug("subscriptions");
    logger.debug(subscriptions);
    program.reference = req.body.reference;
    program.subscriptions = subscriptions;
    program.save(function(err){
      //logger.debug(err);
      if (err) {
        res.json(err);
      } else {
        res.json({success: true});
      }
    });  
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
    res.render('admindev/events/acts-edit-sub', {call: sub}, function(err, body) {
      res.json(body);
    });
  });
}

router.linkPartner = (req, res) => {
  logger.debug(req.body);
  Models.User
  .findOne({_id: req.body.id, is_crew: true},'_id partner_owner', (err, partner) => {
    partner.partner_owner = req.body.partner_owner;
    partner.partner_data = {delegate: req.body.delegate};
    logger.debug(partner);
    partner.save(err => {
      res.json(true);
    });
});
}

router.unlinkPartner = (req, res) => {
  logger.debug(req.body);
  Models.User
  .findOne({_id: req.body.id, is_crew: true, partner_owner: req.body.owner},'_id event partner_owner members', (err, partner) => {
    logger.debug(partner);
    if (partner.members && partner.members.length) {
      partner.partner_owner = undefined;
      partner.save(err => {
        res.json(true);
      });
    } else {
      partner.remove(err => {
        res.json(true);
      });
    }
  });
}

router.updatePartnerships = (req, res) => {
  logger.debug(req.body);

  Models.User
  .findOne({_id: req.body.partner},'partnerships', (err, partner) => {
    var toadd = true;
    for (var a=0;a<partner.partnerships.length;a++) {
      logger.debug(partner.partnerships[a]);
      for (var b=0;b<partner.partnerships[a].events.length;b++) {
        if(partner.partnerships[a].events[b].toString() === req.body.event) {
          partner.partnerships[a].events.splice(b, 1);
/*           if(!partner.partnerships[a].events.length) {
            partner.partnerships.splice(a, 1);
          }
 */        }
      }
      if (req.body.category && partner.partnerships[a].category.toString() === req.body.category) {
        partner.partnerships[a].events.push(req.body.event);
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
    if (req.body.category && toadd) {
      var partnership = {
        category: req.body.category,
        events: [req.body.event]
      }
      partner.partnerships.push(partnership);
    }
    partner.stats.partnerships = 0;
    for (var a=0;a<partner.partnerships.length;a++) {
      partner.stats.partnerships+=partner.partnerships[a].events.length;
    }


    partner.save(err => {



      Models.Event
      .findOne({_id: req.body.event},'partnerships', (err, event) => {
        event.partners = req.body.partnerships;
        for (var a=0;a<event.partners.length;a++) {
          logger.debug(event.partners[a].users);
        }
    
    
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
      //console.log(resultsPromisePerf);
      var promisesPerfSave = [];
      for (var a=0;a<resultsPromisePerf.length;a++) {
        /* console.log("program[a]");
        console.log(program[a].performance);
        console.log("resultsPromisePerf[a]");
        console.log(resultsPromisePerf[a]);
        console.log(resultsPromisePerf[a]._id); */
        if (resultsPromisePerf[a].bookings.length) {
          let notfound = true;
          for (var b=0;b<resultsPromisePerf[a].bookings.length;b++) {
            if (resultsPromisePerf[a].bookings[b].event && resultsPromisePerf[a].bookings[b].event.toString()==program[a].event) {    
              resultsPromisePerf[a].bookings[b].schedule = program[a].schedule;
              notfound = false;
            }
          }
          if (notfound) resultsPromisePerf[a].bookings.push({event:program[a].event,schedule: program[a].schedule});
        } else {
          resultsPromisePerf[a].bookings = [{event:program[a].event,schedule: program[a].schedule}];
        }
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

          console.log("req.body.event");
          console.log(req.body.event);
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


router.updateSubscription = (req, res) => {
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
    console.log(req.body);
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
  } else if (req.body.id && req.body.subscriber_id && (req.body.hotel || req.body.hotel_room)) {
    console.log(req.body);
    Models.Program
    .findOne({_id: req.body.id/* , members:req.user.id */})
    //.select({schedule: 1, call: 1, event: 1})
    //.populate([{ "path": "status", "select": "name", "model": "Category"},{ "path": "performance", "select": "title", "model": "Performance"},{ "path": "reference", "select": "stagename name surname email mobile", "model": "User"}])
    .exec((err, program) => {
      for (var a=0;a<program.subscriptions.length;a++) {
        if (program.subscriptions[a].subscriber_id == req.body.subscriber_id) {
          for (var b=0;b<program.subscriptions[a].packages.length;b++) {
            if (program.subscriptions[a].packages[b].name == "Accommodation") {
              console.log(program.subscriptions[a].packages[b]);

              if (req.body.hotel) program.subscriptions[a].packages[b].option_selected = req.body.hotel;
              if (req.body.hotel_room) program.subscriptions[a].packages[b].option_value = req.body.hotel_room;
              console.log(program.subscriptions[a].packages[b]);
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
        const auth = {
          user: event.organizationsettings.call.calls[sub.call].email,
          pass: event.organizationsettings.call.calls[sub.call].emailpassword
        };
        const status = {
          "5c38c57d9d426a9522c15ba5": "to be evaluated" ,
          "5be8708afc3961000000019e": "accepted - waiting for payment" ,
          "5be8708afc39610000000013": "accepted" ,
          "5be8708afc39610000000097": "to be completed" ,
          "5be8708afc3961000000011a": "not_accepted" ,
          "5be8708afc39610000000221": "refused from user"
        };
        let email = "Ciao " + sub.reference.name +",\n"+"your submisstion to the call for proposals "+event.organizationsettings.call.calls[sub.call].title+" with "+sub.performance.title+" changed the status from " + sub.status.name + " to " + status[req.body.status] + ".";
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
        sub.status = req.body.status;
        sub.save(function(err){
          //event.save(function(err){
            gmailer.gMailer({auth:auth, mail:mail}, function (err, result){
              res.json({err:err, res:result});
              /* if (err) {
                logger.debug("Email sending failure");
                res.json({error: true, msg: "Email sending failure"});
              } else {
                logger.debug("Email sending OK");
                res.json({error: false, msg: "Email sending success"});
              } */
            });
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
