const router = require('../router')();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = mongoose.model('Event');
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
  populate({path: 'organizationsettings.call.calls.admitted', select: 'name'}).
  exec((err, data) => {
    logger.debug('routes/events/participate err:' + err);
    logger.debug(err);
    //logger.debug(data);
    let ids = [];
    if (req.user) ids = [req.user._id].concat(req.user.crews);
    logger.debug(ids);
    //logger.debug(performances);
    if (err || data === null) {
      //return next(err);
    }
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
    let tosave = {};
    
    if (req.session.call.step == 6) {
      tosave = {
        event: req.session.call.event._id,
        performance: req.session.call.admitted[req.session.call.performance]._id,
        user: req.user._id,
        call_id: req.session.call.index,
        topics: req.session.call.topics,
        subscriptions: req.session.call.subscriptions
      };
    }
    logger.debug('events/participateaaaaaaa');
    logger.debug(req.session.call);
    logger.debug(data.title);
    logger.debug(tosave);

    res.render('events/participate', {
      title: data.title,
      dett: data,
      call: req.session.call,
      participateMenu: participateMenu,
      user: req.user,
      msg: null,
      tosave: tosave
    });
  });
});

router.post('/', (req, res) => {
  let myasync = true;
  logger.debug('POSTPOSTPOSTPOSTPOST');
  logger.debug('fetchEvent'+req.params.slug);  
  Event.
  findOne({slug: req.params.slug}).
  populate({path: 'organizationsettings.call.calls.admitted', select: 'name'}).
  exec((err, data) => {
    logger.debug('routes/events/participate err:' + err);
    if (err || data === null) {
      return next(err);
    }
    logger.debug('data.organizationsettings.call:');
    logger.debug(data.organizationsettings.call);
    logger.debug('session.call');
    logger.debug(req.session.call);
    logger.debug('req.body');
    logger.debug(req.body);
    if (data && typeof req.body.step!='undefined') {
      var msg;
      switch (parseInt(req.body.step)) {
        case 0 :
          logger.debug('case 0');
          if (data && typeof req.body.index!='undefined') {
            let ids = [req.user._id].concat(req.user.crews);
            myasync = false;
            logger.debug("req.user");
            logger.debug(req.user);
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
          logger.debug('STOCAZZO');  
          logger.debug(req.body);  
          let subscriptions = [];
          if (data && req.body.subscriptions && req.body.subscriptions.length) {
            for (var a=0; a<req.body.subscriptions.length; a++) {
              if (req.body.subscriptions[a].subscriber_id){
                subscriptions.push(req.body.subscriptions[a]);
              }
            }
          }
          req.session.call.subscriptions = req.body.subscriptions;
          if (subscriptions.length) {
            let days = true;

            for (var a=0; a<subscriptions.length; a++) {
              if (!subscriptions[a].days || !subscriptions[a].days.length) {
                days = false;
              }
            }
            if (days) {
              req.session.call.step = parseInt(req.body.step)+1;
              req.session.call.subscriptions = req.body.subscriptions;
            } else {
              msg = {e:[{name:'accept',m:__('Please select at least 1 day for all the people availables to go forward')}]};
            }
          } else {
            msg = {e:[{name:'accept',m:__('Please select at least 1 person to go forward')}]};
          }
          logger.debug(req.session.call);  
          break;
        case 5 :
          if (data && req.body.subscriptions && req.body.subscriptions.length) {
            req.session.call.step = parseInt(req.body.step)+1;
            for (var a=0; a<req.body.subscriptions.length; a++) {
              if (req.body.subscriptions[a].packages && req.body.subscriptions[a].packages.length){
                req.session.call.subscriptions[a].packages = req.body.subscriptions[a].packages;
              }
            }
          } else {
            msg = {e:[{name:'accept',m:__('Please select at least 1 person to go forward')}]}
          }
          break;
      }
    } else {
      msg = {e:[{name:'index', m:__('Unknow error')}]};
    }
    if (myasync) {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        logger.debug('STOCAZZO ');
        logger.debug(msg);
        res.render('events/participate', {
          title: data.title,
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
