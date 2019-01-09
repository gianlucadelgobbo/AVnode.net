const router = require('../router')();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = mongoose.model('Event');
const Subscription = mongoose.model('Subscription');
const dataprovider = require('../../utilities/dataprovider');

const logger = require('../../utilities/logger');

const participateMenu = [
  __('Active calls'),           // 0
  __('Terms'),   // 1
  __('Performance'),  // 2
  __('Topics'),       // 3
  __('Availability'),           // 4
  __('Packages'),               // 5
  __('Summary'),                // 6
  __('Submit')                  // 7
];

router.get('/', (req, res) => {
  logger.debug("GETGETGETGETGET");
  //delete req.session.call;
  logger.debug(req.session.call);
  Event.
  findOne({slug: req.params.slug}).
  //select({slug: 1}).
  populate({path: 'organizationsettings.call.calls.admitted', select: 'name'}).
  exec((err, data) => {
    logger.debug(data.organizationsettings.call);
    /*let ids = [];
    if (req.user) ids = [req.user._id].concat(req.user.crews);
    //logger.debug(performances);
    if (err || data === null) {
      //return next(err);
    }
    */
    if (!req.session.call || (req.query.step && req.query.step.toString() === '0')) {
      req.session.call = {
        step: 0,
        event: {
          _id : data._id,
          slug: data.slug
        }
      };
    }
    if (req.query.step && parseInt(req.query.step, 10) < req.session.call.step) {
      req.session.call.step = parseInt(req.query.step);
    }
    const msg = !req.user.mobile || !req.user.mobile.length ? {e:[{name:'index', m:__('Warning: You have no mobile phone available. Please add a mobile phone and come back.')+" <a href=\"/admin/profile/private\">"+__("ADD MOBILE NOW")+"</a>"}]} : null;

    res.render('events/participate', {
      title: data.title,
      canonical: req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0],
      dett: data,
      call: req.session.call,
      participateMenu: participateMenu,
      user: req.user,
      msg: msg
    });
  });
});

router.post('/', (req, res) => {
  let myasync = true;
  logger.debug('POSTPOSTPOSTPOSTPOST');
  //logger.debug('fetchEvent'+req.params.slug);  
  Event.
  findOne({slug: req.params.slug}).
  populate({path: 'organizationsettings.call.calls.admitted', select: 'name'}).
  exec((err, data) => {
    if (err || data === null) {
      //logger.debug('routes/events/participate err:' + err);
      return next(err);
    }
    /*
    logger.debug('session.call');
    logger.debug(req.session.call);
    logger.debug('data.organizationsettings.call:');
    logger.debug(data.organizationsettings.call);
    logger.debug('req.body');
    logger.debug(req.body.subscriptions);
    */
    let msg = !req.user.mobile || !req.user.mobile.length ? {e:[{name:'index', m:__('Warning: You have no mobile phone available. Please add a mobile phone and come back.')+" <a href=\"/admin/profile/private\">"+__("ADD MOBILE NOW")+"</a>"}]} : null;
    logger.debug("msg");
    logger.debug(msg);
    if (data && typeof req.body.step!='undefined') {
      logger.debug(req.user);
      switch (parseInt(req.body.step)) {
        case 0 :
          logger.debug('case 0');
          if (data && typeof req.body.index!='undefined') {
            let ids = [req.user._id].concat(req.user.crews);
            myasync = false;
            dataprovider.getPerformanceByIds(req, ids, (err, performances) =>{
              logger.debug(performances);
            
              let admitted = {};
              var admittedCat = data.organizationsettings.call.calls[req.body.index].admitted.map(a => a._id.toString());
              for (let item in admittedCat) {
                for (let perf in performances) {
                  var result = performances[perf].categories.map(a => a._id.toString());
                  if (result.indexOf(admittedCat[item]) !== -1) {
                    admitted[performances[perf]._id.toString()] = performances[perf];
                  }
                }
              }
              let admittedA = [];
              for (let perf in admitted) {
                logger.debug(admitted[perf].categories);
                admittedA.push(admitted[perf]);
              }
              logger.debug('performances '+performances.length);
              logger.debug('admitted '+admittedA.length);
              //logger.debug(admitted);
              if (admittedA.length) {
                req.session.call.step = parseInt(req.body.step)+1;
                req.session.call.index = parseInt(req.body.index);
                req.session.call.admitted = admittedA;
              } else {
                msg = {e:[{name:'index', m:__('Warning: You have no performance eligible for the call selected. Please create a performance and come back.')}]};
                logger.debug('STOCAZZO 1');
                logger.debug(msg);
              }
              if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
                res.json(data);
              } else {
                logger.debug('STOCAZZO ');
                logger.debug(msg);
                res.render('events/participate', {
                  title: data.title,
                  canonical: req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0],
                  dett: data,
                  call: req.session.call,
                  participateMenu: participateMenu,
                  user: req.user,
                  msg: msg
                });
              }
            });
          } else {
            msg = {e:[{name:'index', m:__('Please select a call')}]};
          }
          break;
        case 1 :
          logger.debug('case 1');  
          if (data && req.body.accept=='1') {
            req.session.call.step++;
          } else {
            msg = {e:[{name:'accept',m:__('Please accept the terms and conditions to go forward')}]}
          }
          break;
        case 2 :
          if (data && typeof req.body.performance!='undefined') {
            req.session.call.step = parseInt(req.body.step)+1;
            req.session.call.performance = parseInt(req.body.performance);
            let perfpeoples = [];
            let allsubscriptions = [];
            for (var b=0;b<req.session.call.admitted[req.session.call.performance].users.length;b++) {
              if (req.session.call.admitted[req.session.call.performance].users[b].members){
                //console.log(call.admitted[call.performance].users[b].members);
                for (var c=0;c<req.session.call.admitted[req.session.call.performance].users[b].members.length;c++) {
                  perfpeoples.push(req.session.call.admitted[req.session.call.performance].users[b].members[c]._id);
                  allsubscriptions.push({subscriber_id: req.session.call.admitted[req.session.call.performance].users[b].members[c]._id,stagename: req.session.call.admitted[req.session.call.performance].users[b].members[c].stagename});
                }
              } else {
                perfpeoples.push(req.session.call.admitted[req.session.call.performance].users[b]._id);
                allsubscriptions.push({subscriber_id: req.session.call.admitted[req.session.call.performance].users[b]._id,stagename: req.session.call.admitted[req.session.call.performance].users[b].stagename});
              }          
            }
            console.log("perfpeoples");
            console.log(perfpeoples);
            myasync = false;
            Subscription.find({"subscriptions.subscriber_id":{$in:perfpeoples}}).
            lean().
            exec((err, subscriptions) => {
              let subscriptionsfound = [];
              for (var b=0;b<subscriptions.length;b++) {
                subscriptionsfound = subscriptionsfound.concat(subscriptions[b].subscriptions);
                console.log(subscriptions[b].subscriptions);
                console.log(subscriptionsfound);
              }
              for (var b=0;b<allsubscriptions.length;b++) {
                for (var d=0;d<subscriptionsfound.length;d++) {
                  if (subscriptionsfound[d].subscriber_id.toString()===allsubscriptions[b].subscriber_id.toString()) {
                    allsubscriptions[b].days = subscriptionsfound[d].days;
                    allsubscriptions[b].packages = subscriptionsfound[d].packages;
                  } else {
                    delete allsubscriptions[b].subscriber_id;
                  }
                }
              }
              req.session.call.subscriptions = allsubscriptions;
              console.log("allsubscriptions");
              console.log(allsubscriptions);
              res.render('events/participate', {
                title: data.title,
                canonical: req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0],
                dett: data,
                call: req.session.call,
                participateMenu: participateMenu,
                user: req.user,
                msg: msg
              });
            });
          } else {
            msg = {e:[{name:'accept',m:__('Please select a performance to go forward')}]}
          }
          break;
        case 3 :
          if (data && req.body.topics && req.body.topics.length) {
            req.session.call.step = parseInt(req.body.step)+1;
            req.session.call.topics = req.body.topics;
          } else {
            msg = {e:[{name:'accept',m:__('Please select at least 1 topic to go forward')}]}
          }
          break;
        case 4 :
          console.log("req.body.subscriptions");
          console.log(req.body.subscriptions);
          if (data && req.body.subscriptions && req.body.subscriptions.length) {
            let days_check = true;
            for (var a=0; a<req.body.subscriptions.length; a++) {
              if (req.body.subscriptions[a].subscriber_id){
                if (!req.body.subscriptions[a].days || !req.body.subscriptions[a].days.length) {
                  days_check = false;
                }
              }
            }
            if (days_check) {
              req.session.call.step = parseInt(req.body.step)+1;
              req.session.call.subscriptions = req.body.subscriptions;
            } else {
              msg = {e:[{name:'accept',m:__('Please select at least 1 day for all the people availables to go forward')}]};
            }
          } else {
            msg = {e:[{name:'accept',m:__('Please select at least 1 person to go forward')}]};
          }
          break;
        case 5 :
          if (data && req.body.subscriptions && req.body.subscriptions.length) {
            for (var a=0; a<req.body.subscriptions.length; a++) {
              if (req.body.subscriptions[a].packages && req.body.subscriptions[a].packages !== 'null'){
                req.session.call.subscriptions[a].packages = req.body.subscriptions[a].packages;
                for (var b=0; b<req.body.subscriptions[a].packages.length; b++) {
                  logger.debug('subscriptions packages');
                  logger.debug(req.body.subscriptions[a]);
                  if (data.organizationsettings.call.calls[req.session.call.index].packages[req.body.subscriptions[a].packages[b].id].allow_options && !req.body.subscriptions[a].packages[b].option ){
                    msg = {e:[{name:'accept',m:__('Please select at least 1 option of all the packages')+" "+data.organizationsettings.call.calls[req.session.call.index].packages[req.body.subscriptions[a].packages[b].id].name}]}
                  }
                }
              }
            }
            if (!msg) req.session.call.step = parseInt(req.body.step)+1;
          } else {
            msg = {e:[{name:'accept',m:__('Please select at least 1 package to go forward')}]}
          }
          break;
        case 6 :
          myasync = false;
          // SAVE
          logger.debug('req.session.call.save');
          logger.debug(req.session.call.save);
          req.session.call.save = {
            event:        req.session.call.event._id,
            call:         req.session.call.index,
            topics:       req.session.call.topics,
            performance:  req.session.call.admitted[req.session.call.performance]._id,
            reference:    req.user._id,
            subscriptions:[]
          };
          for (var a=0; a<req.session.call.subscriptions.length; a++) {
            if (req.session.call.subscriptions[a].subscriber_id){
              var packages = []; 
              for (var b=0; b<req.session.call.subscriptions[a].packages.length; b++) {
                var pack = JSON.parse(JSON.stringify(data.organizationsettings.call.calls[req.session.call.index].packages[req.session.call.subscriptions[a].packages[b].id]));
                pack.option = req.session.call.subscriptions[a].packages[b].option;
                packages.push(pack);
              }
              var sub = JSON.parse(JSON.stringify(req.session.call.subscriptions[a]));
              sub.packages = packages;
              req.session.call.save.subscriptions.push(sub);
            }
          }
          Subscription.create(req.session.call.save, function (err, sub) {
            if (err) {
              msg = {e:[{name:'index', m:__('Unable to submit the proposal, please try again.')},{name:'index', m:err}]};
              res.render('events/participate', {
                title: data.title,
                canonical: req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0],
                dett: data,
                call: req.session.call,
                participateMenu: participateMenu,
                user: req.user,
                msg: msg
              });
            } else {
              // saved!
              // MAILER
              const mailer = require('../../utilities/mailer');
              mailer.mySendMailer({
                template: 'participate',
                message: {
                  to: req.user.stagename+" <"+req.user.email+">",
                  from: data.organizationsettings.call.calls[req.session.call.index].title+" <"+data.organizationsettings.call.calls[req.session.call.index].email+">"
                },
                email_content: {
                  site:    req.protocol+"://"+req.headers.host,
                  title:   data.organizationsettings.call.calls[req.session.call.index].title + " | " + __("Call Submission"),
                  subject: data.organizationsettings.call.calls[req.session.call.index].title + " | " + __("Call Submission"),
                  block_1:  __("We’ve received a request to participate to") + " <b>" + data.organizationsettings.call.calls[req.session.call.index].title + "</b> "+__("from")+" <b>"+req.user.stagename+"</b>",
                  block_1_plain:  __("We’ve received a request to participate to") + " " + data.organizationsettings.call.calls[req.session.call.index].title + " "+__("from")+" "+req.user.stagename+"",
                  user: req.user,
                  dett: data,
                  call: req.session.call,
                  block_2:  __("You will receive a feedback on your proposal as soon."),
                  block_3:  __("Thanks."),
                  link:  "<a href=\""+req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0]+"\">"+req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0]+"</a>",
                  link_plain: req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0],
                  signature: "The AVnode.net Team"
                }
              }, function (err){
                if (err) {
                  msg = {e:[{name:'index', m:__('Unable to submit the proposal, please try again.')},{name:'index', m:err}]};
                } else {
                  req.session.call.step = parseInt(req.body.step)+1;
                }
                res.render('events/participate', {
                  title: data.title,
                  canonical: req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0],
                  dett: data,
                  call: req.session.call,
                  participateMenu: participateMenu,
                  user: req.user,
                  msg: msg
                });
              });
            }
          });
          break;
      }
    } else {
      msg = {e:[{name:'index', m:__('Unknow error')}]};
    }
/*
    logger.debug("req.user");
    logger.debug(req.user);
 */
    if (myasync) {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        logger.debug('JUST BEFORE RENDER');
        logger.debug(req.session.call.step);
        logger.debug(req.session.call);  
        logger.debug(msg);
        res.render('events/participate', {
          title: data.title,
          canonical: req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0],
          dett: data,
          call: req.session.call,
          participateMenu: participateMenu,
          user: req.user,
          msg: msg
        });
      }
    }
  });
});


/*
exports.get = function get(req, res) {
  var pathArray = req.url.split("?")[0].split("/");
  var output = (req.query.output ? req.query.output : false);
  if (pathArray[0]=="") pathArray.shift();
  if (pathArray[pathArray.length-1]=="") pathArray.pop();
  if (pathArray[pathArray.length-1].indexOf("output")!=-1) pathArray.pop();
  var passport_user = req.session.passport && req.session.passport.user ? req.session.passport.user : {};
  if (pathArray.length > 0) {
    DB.users.findOne({permalink:pathArray[0]}, function(e, result) {
      if (result) {
        switch (pathArray.length) {
          case 1 :
            res.render('performer', { userpage:true, title: result.display_name, result : result, Fnc:Fnc, user : passport_user });
            break;
          case 2 :
            if (config.sections[pathArray[1]]) {
              res.render('performer_list', { userpage:true, title: result.display_name, title2: config.sections[pathArray[1]].title, sez:pathArray[1], result : result, Fnc:Fnc, user : passport_user });

            } else {
              res.sendStatus(404);
            }
            break;
          case 3 :
            if (config.sections[pathArray[1]]) {
              DB[config.sections[pathArray[1]].coll].findOne({permalink:pathArray[2]}, function(e, dett) {
                if (dett) {
                  if (output=="json") {
                    res.send(result);
                  } else if (output=="xml") {
                    res.render('performer_dett_'+pathArray[1]+"_xml", {  layout: false, userpage:true, title: result.display_name+": "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user });
                  } else {
                    res.render('performer_dett_'+pathArray[1], { userpage:true, title: result.display_name+":  "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user });
                  }
                } else {
                  res.sendStatus(404);
                }
              });
            } else {
              res.sendStatus(404);
            }
            break;
          case 4 :
            if (config.sections[pathArray[1]] && config.sections[pathArray[1]].subsections && config.sections[pathArray[1]].subsections[pathArray[3]]) {
              DB[config.sections[pathArray[1]].coll].findOne({permalink:pathArray[2]}, function(e, dett) {
                if (dett) {
                  logger.debug("GETGETGETGETGETGET");
                  logger.debug(req.session.call);

                  if (!req.session.call){
                    req.session.call = {
                      step: 0,
                      event: {
                        _id : dett._id,
                        permalink: dett.permalink
                      },
                      //user: req.session.passport.user
                    }
                  }
                  if(typeof req.query.step!='undefined'){
                    req.session.call.step = req.query.step;
                  }
                  var subscriptions = {};

                  if (output=="json") {
                    res.send(result);
                  } else if (output=="xml") {
                    res.render('performer_dett_'+pathArray[1]+'_'+pathArray[3]+"_xml", {  layout: false, userpage:true, title: result.display_name+": "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user, call: req.session.call, subscriptions:subscriptions });
                  } else {
                    res.render('performer_dett_'+pathArray[1]+'_'+pathArray[3], {                          userpage:true, title: result.display_name+": "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user, call: req.session.call, subscriptions:subscriptions });
                  }
                } else {
                  res.sendStatus(404);
                }
              });
            } else {
              res.sendStatus(404);
            }
            break;
          default :
            res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.sendStatus(404);
  }
};

exports.post = function post(req, res) {
  var pathArray = req.url.split("/");
  var output = (req.query.output ? req.query.output : false);
  if (pathArray[0]=="") pathArray.shift();
  if (pathArray[pathArray.length-1]=="") pathArray.pop();
  if (pathArray[pathArray.length-1].indexOf("output")!=-1) pathArray.pop();
  var passport_user = req.session.passport && req.session.passport.user ? req.session.passport.user : {};
  if (pathArray.length > 0) {
    DB.users.findOne({permalink:pathArray[0]}, function(e, result) {
      if (result) {
        switch (pathArray.length) {
          case 4 :
            if (config.sections[pathArray[1]] && config.sections[pathArray[1]].subsections && config.sections[pathArray[1]].subsections[pathArray[3]]) {
              DB[config.sections[pathArray[1]].coll].findOne({permalink:pathArray[2]}, function(e, dett) {
                logger.debug("POSTPOSTPOSTPOSTPOST");
                logger.debug(req.body);
                logger.debug(req.body.step);
                logger.debug(typeof req.body.step);
                if (dett && typeof req.body.step!='undefined') {
                  var msg;
                  switch (parseInt(req.body.step)) {
                    case 0 :
                      if (dett && typeof req.body.index!='undefined') {
                        req.session.call.step = parseInt(req.body.step)+1;
                        req.session.call.index = parseInt(req.body.index);
                      } else {
                        msg = {e:[{name:"index",m:__("Please select a call")}]}
                      }
                      break;
                    case 1 :
                      if (dett && req.body.accept=='1') {
                        req.session.call.step = parseInt(req.body.step)+1;
                      } else {
                        msg = {e:[{name:"accept",m:__("Please accept the terms and conditions to go forward")}]}
                      }
                      break;
                    case 2 :
                      if (dett && typeof req.body.performance!='undefined') {
                        req.session.call.step = parseInt(req.body.step)+1;
                        for (var a=0; a<passport_user.performances.length; a++) {
                          if (passport_user.performances[a]._id==req.body.performance){
                            req.session.call.performance = passport_user.performances[a];
                            req.session.call.subscriptions = [];
                            for (var b=0; b<req.session.call.performance.users.length; b++) {
                              if (req.session.call.performance.users[b].members) {
                                for (var c=0; c<req.session.call.performance.users[b].members.length; c++) {
                                  DB.subscriptions.findOne({subscriber_id:req.session.call.performance.users[b].members[c]._id}, function(e, subscription) {
                                    if (subscription) {
                                      req.session.call.subscriptions.push(subscription);
                                    }
                                  });
                                }
                              } else {
                                DB.subscriptions.findOne({subscriber_id:req.session.call.performance.users[b]._id}, function(e, subscription) {
                                  if (subscription) {
                                    req.session.call.subscriptions.push(subscription);
                                  }
                                });

                              }
                            }
                          }
                        }

                      } else {
                        msg = {e:[{name:"accept",m:__("Please select a performance to go forward")}]}
                      }
                      break;
                    case 3 :
                      if (dett && req.body.topics.length) {
                        req.session.call.step = parseInt(req.body.step)+1;
                        req.session.call.topics = req.body.topics;
                      } else {
                        msg = {e:[{name:"accept",m:__("Please select at least 1 topic to go forward")}]}
                      }
                      break;
                    case 4 :
                      if (dett && req.body.subscriptions && req.body.subscriptions.length) {
                        req.session.call.step = parseInt(req.body.step)+1;
                        var subscriptions = [];
                        for (var a=0; a<req.body.subscriptions.length; a++) {
                          if (req.body.subscriptions[a].subscriber_id){
                            var subscriptionA = req.body.subscriptions[a];
                            subscriptions.push(subscriptionA);
                          }
                        }
                        req.session.call.subscriptions = subscriptions;
                      } else {
                        msg = {e:[{name:"accept",m:__("Please select at least 1 person to go forward")}]}
                      }
                      break;
                  }
                  logger.debug(req.session.call);
                  if (output=="json") {
                    res.send(result);
                  } else if (output=="xml") {
                    res.render('performer_dett_'+pathArray[1]+'_'+pathArray[3]+"_xml", {  layout: false, userpage:true, title: result.display_name+": "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user, call: req.session.call, msg:msg  });
                  } else {
                    res.render('performer_dett_'+pathArray[1]+'_'+pathArray[3], {                          userpage:true, title: result.display_name+": "+config.sections[pathArray[1]].title, sez:pathArray[1], result : result, dett : dett, Fnc:Fnc, user : passport_user, call: req.session.call, msg:msg  });
                  }
                } else {
                  res.sendStatus(404);
                }
              });
            } else {
              res.sendStatus(404);
            }
            break;

          default :
            res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.sendStatus(404);
  }
};
*/

module.exports = router;
