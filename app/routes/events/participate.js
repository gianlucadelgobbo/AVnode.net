const router = require('../router')();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const Event = mongoose.model('Event');
const Program = mongoose.model('Program');
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
    if (!req.session.call || (req.query.step && req.query.step.toString() === '0') || req.session.call.saved) {
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
    const msg = null;
  
    res.render('events/participate', {
      title: data.title,
      //canonical: (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl.split("?")[0],
      canonical: (req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
      dett: data,
      call: req.session.call,
      code: req.query.code,
      participateMenu: participateMenu,
      user: req.user,
      msg: msg
    });
  });
});

router.post('/', (req, res) => {
  logger.debug(req.session.call);
  if ((req.session.call && req.session.call.saved) || !req.body || !req.session.call) {
    if (req.body && req.body.step) delete req.body.step;
    delete req.session.call;
    res.redirect((req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0]);
  } else {
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
      let msg
      logger.debug("msg");
      logger.debug(msg);
      if (data && typeof req.body.step!='undefined') {
        //logger.debug(req.user);
        switch (parseInt(req.body.step)) {
          case 0 :
            logger.debug('case 0');
            if (!req.user.name) {
              if (!msg || !msg.e) msg = {e:[]};
              msg.e.push({name:'index', m:__('Warning: You have no name available. Please add your name in your profile and come back.')+" <a href=\"/admin/profile/"+req.user._id+"/private\">"+__("ADD NOW")+"</a>"});
            }
            if (!req.user.surname) {
              if (!msg || !msg.e) msg = {e:[]};
              msg.e.push({name:'index', m:__('Warning: You have no surname available. Please add your surname in your profile and come back.')+" <a href=\"/admin/profile/"+req.user._id+"/private\">"+__("ADD NOW")+"</a>"});
            }
            if (!req.user.email) {
              if (!msg || !msg.e) msg = {e:[]};
              msg.e.push({name:'index', m:__('Warning: You have no email available. We need your email for all the communications. Please add an email and come back.')+" <a href=\"/admin/profile/"+req.user._id+"/private\">"+__("ADD NOW")+"</a>"});
            }
            var results = req.user.mobile.reduce((results, item) => {
              if (item.url) results.push(item.url); // modify is a fictitious function that would apply some change to the items in the array
              return results
            }, [])
            if (!results.length) {
              if (!msg || !msg.e) msg = {e:[]};
              msg.e.push({name:'index', m:__('Warning: You have no mobile phone available. We need your mobile phone in case of urgent issue. Please add a mobile phone and come back.')+" <a href=\"/admin/profile/"+req.user._id+"/private\">"+__("ADD NOW")+"</a>"});
            }
            if (!msg) {
              if (data && typeof req.body.index!='undefined') {
                let ids = [req.user._id].concat(req.user.crews);
                myasync = false;
                dataprovider.getPerformanceByIds(req, ids, (err, performances) =>{
                  logger.debug(performances);
                
                  let admitted = {};
                  var admittedCat = data.organizationsettings.call.calls[req.body.index].admitted.map(a => a._id.toString());
                  for (let item in admittedCat) {
                    for (let perf in performances) {
                      if (performances[perf].type) {
                        //var result = performances[perf].categories.map(a => a._id.toString());
                        var result = performances[perf].type.toString();
                        if (result.indexOf(admittedCat[item]) !== -1) {
                          admitted[performances[perf]._id.toString()] = performances[perf];
                        }
                      }
                    }
                  }
                  let admittedA = [];
                  for (let perf in admitted) {
                    logger.debug(admitted[perf].type);
                    admittedA.push(admitted[perf]);
                  }
                  logger.debug('performances '+performances.length);
                  logger.debug('admitted '+admittedA.length);
                  logger.debug(admitted);
                  req.session.call.index = parseInt(req.body.index);
                  if (admittedA.length) {
                    req.session.call.step = parseInt(req.body.step)+1;
                    req.session.call.admitted = admittedA;
                  } else {
                    msg = {e:[{name:'index', m:__('Warning: You need at least one performance of this types to participate to the call selected: <b>'+ data.organizationsettings.call.calls[req.body.index].admitted.map(a => a.name.toString()).join(", ") +'</b>. Please create a performance and come back.')+" <a href=\"/admin/performances\">"+__("CREATE YOUR PERFORMANCE NOW")+"</a>"}]};
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
                      canonical: (req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
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
            }
            break;
          case 1 :
            logger.debug('case 1');  
            if (data && req.body.accept=='1' && req.body.confirm_personal_data=='1') {
              req.session.call.step++;
            } else {
              if (req.body.accept!='1') {
                if (!msg || !msg.e) msg = {e:[]};
                msg.e.push({name:'accept',m:__('Please accept the terms and conditions to go forward')});
              }
              if (req.body.confirm_personal_data!='1') {
                if (!msg || !msg.e) msg = {e:[]};
                msg.e.push({name:'confirm_personal_data',m:__('Please confirm your personal data to go forward')});
              }
            }
            break;
          case 2 :
            if (data && typeof req.body.performance!='undefined') {
              req.session.call.step = parseInt(req.body.step)+1;
              req.session.call.performance = parseInt(req.body.performance);
              let perfpeoples = [];
              let allsubscriptions = [];
              logger.debug("req.session.call.admitted[req.session.call.performance].users");
              //logger.debug(req.session.call.admitted[req.session.call.performance].users);
              for (var b=0;b<req.session.call.admitted[req.session.call.performance].users.length;b++) {
                if (req.session.call.admitted[req.session.call.performance].users[b].members && req.session.call.admitted[req.session.call.performance].users[b].members.length){
                  //logger.debug(call.admitted[call.performance].users[b].members);
                  for (var c=0;c<req.session.call.admitted[req.session.call.performance].users[b].members.length;c++) {
                    perfpeoples.push(req.session.call.admitted[req.session.call.performance].users[b].members[c]._id);
                    allsubscriptions.push({subscriber_id: req.session.call.admitted[req.session.call.performance].users[b].members[c]._id,stagename: req.session.call.admitted[req.session.call.performance].users[b].members[c].stagename});
                  }
                } else {
                  perfpeoples.push(req.session.call.admitted[req.session.call.performance].users[b]._id);
                  allsubscriptions.push({subscriber_id: req.session.call.admitted[req.session.call.performance].users[b]._id,stagename: req.session.call.admitted[req.session.call.performance].users[b].stagename});
                }          
              }
              logger.debug("perfpeoples");
              logger.debug({"subscriptions.subscriber_id":{$in:perfpeoples}});
              myasync = false;
              Program.find({"subscriptions.subscriber_id":{$in:perfpeoples}, event: req.session.call.event._id}).
              lean().
              exec((err, subscriptions) => {
                logger.debug("subscriptions");
                logger.debug(subscriptions.count);
                let subscriptionsfound = [];
                for (var b=0;b<subscriptions.length;b++) {
                  subscriptionsfound = subscriptionsfound.concat(subscriptions[b].subscriptions);
                  //logger.debug(subscriptions[b].subscriptions);
                  //logger.debug(subscriptionsfound);
                }
                for (var b=0;b<allsubscriptions.length;b++) {
                  for (var d=0;d<subscriptionsfound.length;d++) {
                    if (allsubscriptions[b].subscriber_id && subscriptionsfound[d].subscriber_id.toString()===allsubscriptions[b].subscriber_id.toString()) {
                      allsubscriptions[b].days = subscriptionsfound[d].days;
                      allsubscriptions[b].packages = subscriptionsfound[d].packages;
                      allsubscriptions[b].freezed = true;
                    }
                  }
                }
                for (var b=0;b<allsubscriptions.length;b++) if (!allsubscriptions[b].freezed) delete allsubscriptions[b].subscriber_id;
                req.session.call.subscriptions = allsubscriptions;
                logger.debug("allsubscriptions");
                //logger.debug(allsubscriptions);
                res.render('events/participate', {
                  title: data.title,
                  canonical: (req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
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
            logger.debug("req.body.subscriptions");
            logger.debug(req.body.subscriptions);
            if (data && req.body.subscriptions && req.body.subscriptions.length) {
              let days_check = true;
              for (var a=0; a<req.body.subscriptions.length; a++) {
                if (req.body.subscriptions[a].subscriber_id && req.body.subscriptions[a].freezed!='true'){
                  if (!req.body.subscriptions[a].days || !req.body.subscriptions[a].days.length) {
                    days_check = false;
                  }
                }
              }
              if (days_check) {
                req.session.call.step = parseInt(req.body.step)+1;
                let people = [];
                for (var a=0; a<req.body.subscriptions.length; a++) {
                  if (req.body.subscriptions[a].subscriber_id && req.body.subscriptions[a].freezed != 'true'){
                    for (var b=0; b<req.session.call.subscriptions.length; b++) {
                      if (req.session.call.subscriptions[b].stagename === req.body.subscriptions[a].stagename && people.indexOf(req.body.subscriptions[a].subscriber_id)===-1){
                        people.push(req.body.subscriptions[a].subscriber_id);
                        req.session.call.subscriptions[b].subscriber_id = req.body.subscriptions[a].subscriber_id;
                        req.session.call.subscriptions[b].days = req.body.subscriptions[a].days;
                      }
                    }
                  }
                }
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
                if (req.body.subscriptions[a].packages && req.body.subscriptions[a].packages !== 'null' && req.session.call.subscriptions[a].freezed != 'true'){
                  req.session.call.subscriptions[a].packages = req.body.subscriptions[a].packages;
                  for (var b=0; b<req.body.subscriptions[a].packages.length; b++) {
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
            //logger.debug('req.session.call.index');
            //logger.debug(req.session.call.index);
            logger.debug(req.session.call.admitted[req.session.call.performance]);
            req.session.call.save = {
              event:        req.session.call.event._id,
              call:         req.session.call.index,
              topics:       req.session.call.topics,
              performance:  req.session.call.admitted[req.session.call.performance]._id,
              performance_categories:  req.session.call.admitted[req.session.call.performance].type,/*filter(function (el) {return el.ancestor.slug=="type";})[0]._id,*/
              status:       "5c38c57d9d426a9522c15ba5",
              reference:    req.user._id,
              subscriptions:[]
            };
            for (var a=0; a<req.session.call.subscriptions.length; a++) {
              if (req.session.call.subscriptions[a].subscriber_id){
                if (req.session.call.subscriptions[a].packages && req.session.call.subscriptions[a].packages.length && req.session.call.subscriptions[a].packages[0].personal) {
                  var sub = JSON.parse(JSON.stringify(req.session.call.subscriptions[a]));
                  sub.packages = req.session.call.subscriptions[a].packages;
                } else {
                  var packages = []; 
                  for (var b=0; b<req.session.call.subscriptions[a].packages.length; b++) {
                    var pack = JSON.parse(JSON.stringify(data.organizationsettings.call.calls[req.session.call.index].packages[req.session.call.subscriptions[a].packages[b].id]));
                    pack.option = req.session.call.subscriptions[a].packages[b].option;
                    packages.push(pack);
                  }
                  var sub = JSON.parse(JSON.stringify(req.session.call.subscriptions[a]));
                  sub.packages = packages;
                }
                req.session.call.save.subscriptions.push(sub);
              }
            }
            //logger.debug('req.session.call.save');
            //logger.debug(req.session.call.save);
            //logger.debug(req.session.call.save);
            Program.create(req.session.call.save, function (err, sub) {
              if (err) {
                msg = {e:[{name:'index', m:__('Unable to submit the proposal, please try again.')},{name:'index', m:err}]};
                res.render('events/participate', {
                  title: data.title,
                  canonical: (req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
                  dett: data,
                  call: req.session.call,
                  participateMenu: participateMenu,
                  user: req.user,
                  msg: msg
                });
              } else {
                if (!data.program) data.program = [];
                data.program.push({subscription_id: sub._id, performance : req.session.call.admitted[req.session.call.performance]._id});
                data.save((err) => {
                  if (err) {
                    msg = {e:[{name:'index', m:__('Unable to submit the proposal, please try again.')},{name:'index', m:err}]};
                    res.render('events/participate', {
                      title: data.title,
                      canonical: (req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
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
                        cc: data.organizationsettings.call.calls[req.session.call.index].title+" <"+data.organizationsettings.call.calls[req.session.call.index].email+">",
                        from: data.organizationsettings.call.calls[req.session.call.index].title+" <"+data.organizationsettings.call.calls[req.session.call.index].email+">"
                      },
                      email_content: {
                        site:    (req.get('host') === "localhost:8006" ? "http" : "https")+"://"+req.headers.host,
                        imghead: (req.get('host') === "localhost:8006" ? "http" : "https")+"://"+req.headers.host + data.organizationsettings.call.calls[req.session.call.index].imghead,
                        imgalt:  data.organizationsettings.call.calls[req.session.call.index].imgalt,
                        html_sign:  data.organizationsettings.call.calls[req.session.call.index].html_sign,
                        text_sign:  data.organizationsettings.call.calls[req.session.call.index].text_sign,
                        title:   data.organizationsettings.call.calls[req.session.call.index].title + " | " + __("Call Submission"),
                        subject: req.session.call.admitted[req.session.call.performance].title + " | " + data.organizationsettings.call.calls[req.session.call.index].title + " | " + __("Call Submission"),
                        block_1:  __("We’ve received a request to participate to") + " <b>" + data.organizationsettings.call.calls[req.session.call.index].title + "</b> "+__("from")+" <b>"+req.user.stagename+"</b>",
                        block_1_plain:  __("We’ve received a request to participate to") + " " + data.organizationsettings.call.calls[req.session.call.index].title + " "+__("from")+" "+req.user.stagename+"",
                        user: req.user,
                        dett: data,
                        call: req.session.call,
                        block_2:  __("You will receive a feedback on your proposal as soon."),
                        block_3:  __("Thanks."),
                        link:  "",
                        link_plain: ""/* 
                        link:  "<a href=\""+(req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0]+"\">"+(req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0]+"</a>",
                        link_plain: (req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0] */
                      }
                    }, function (err){
                      if (err) {
                        msg = {e:[{name:'index', m:__('Unable to submit the proposal, please try again.')},{name:'index', m:err}]};
                      } else {
                        req.session.call.step = parseInt(req.body.step)+1;
                        req.session.call.saved = true;
                      }
                      res.render('events/participate', {
                        title: data.title,
                        canonical: (req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
                        dett: data,
                        call: req.session.call,
                        participateMenu: participateMenu,
                        user: req.user,
                        msg: msg
                      });
                    });
                  }
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
          //logger.debug(req.session.call.step);
          //logger.debug(req.session.call);  
          logger.debug(msg);
          res.render('events/participate', {
            title: data.title,
            canonical: (req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
            dett: data,
            call: req.session.call,
            participateMenu: participateMenu,
            user: req.user,
            msg: msg
          });
        }
      }
    });
  }
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
