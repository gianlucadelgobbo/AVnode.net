import createRouter from "../router.js";
const router = createRouter();

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const Event = mongoose.model('Event');
const Program = mongoose.model('Program');
const Performance = mongoose.model('Performance');
import dataprovider from '../../utilities/dataprovider.js';

import { mySendMailer } from '../../utilities/mailer.js';


import { logger, requestLogger, errorLogger } from '../../utilities/logger.js';
import { title } from "process";
import { error } from "console";



router.get('/', async (req, res) => {
  if (!req.user && req.isApi) return res.send({error: error, msg: {errors: {login: { message: req.__('To participate to the call for proposal you have to be logged in.')}}}})

  var participateMenu = [
    {label:req.__('Active Calls'),slug:"calls"},        // 0
    {label:req.__('Terms'),slug:"terms"},               // 1
    {label:req.__('Artwork'),slug:"performance"},       // 2
    {label:req.__('Topics'),slug:"topics"},             // 3
    {label:req.__('Availability'),slug:"availability"}, // 4
    {label:req.__('Packages'),slug:"packages"},         // 5
    {label:req.__('Summary'),slug:"summary"},           // 6
    {label:req.__('Submit'),slug:"submit"}              // 7
  ];
  var slugsMenu = participateMenu.map(item =>{return item.slug})
  
  logger.info("GETGETGETGETGET");
  logger.info("req.query.api");
  logger.info(req.query.api);
  logger.info(req.query.code);
  //delete req.session.call;
  logger.info("req.session.call");
  //logger.info(req.session.call);
  const data = await Event.
  findOne({slug: req.params.slug}).
  select({title: 1, organizationsettings: 1}).
  populate({path: 'organizationsettings.call.calls.admitted', select: 'name'}).
  lean().
  exec();

  let ids = req.user ? [req.user._id, ...req.user.crews.map(item => item._id)] : [];

  const performances = await Performance.
  find({users: {$in:ids}}).
  select({slug: 1, title: 1}).
  populate([{path: 'type', select: {name: 1}},{path: 'users', select: {stagename: 1, members: 1}}]).
  lean().
  exec();
  logger.info("performances");
  //logger.info(performances);
  const userIds = new Set();
  const seen = new Set(); // Tracks encountered IDs

  performances.forEach(performance => {
      performance.users.forEach(user => {
          const userId = user._id.toString(); // Normalize to string
          if (!seen.has(userId)) {
              seen.add(userId);
              userIds.add(userId);
          }

          if (user.members && user.members.length > 0) {
              user.members.forEach(memberId => {
                  const memberIdStr = memberId.toString(); // Normalize to string
                  if (!seen.has(memberIdStr)) {
                      seen.add(memberIdStr);
                      userIds.add(memberIdStr);
                  }
              });
          }
      });
  });

  let authors = [...userIds]; // Convert Set to Array

  logger.info("authors");
  //logger.info(authors);

  const subscriptions = await Program.
  find({"subscriptions.subscriber_id": {$in:authors}, event:data._id}).
  select({"event": 1,
      "call": 1,
      "topics": 1,
      "performance": 1,
      "reference": 1,
      "status": 1,
      "subscriptions": 1}).
  exec();
  logger.info("subscriptions");
  //logger.info(subscriptions);

  //subscriptions.type.subscriber_id
  /*let ids = [];
  if (req.user) ids = [req.user._id].concat(req.user.crews);
  //logger.info(performances);
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
  if (req.session.call.index!==undefined) {
    slugsMenu = participateMenu.map(item =>{return item.slug})
    /* logger.info(data.organizationsettings.call.calls[req.session.call.index]);
    logger.info("slugsMenu");
    logger.info(slugsMenu.indexOf('topics'));
    data.organizationsettings.call.calls[req.session.call.index].topics = []
    data.organizationsettings.call.calls[req.session.call.index].availability = false
    data.organizationsettings.call.calls[req.session.call.index].packages = [] */
    if (!data.organizationsettings.call.calls[req.session.call.index].topics.length && slugsMenu.indexOf('topics')!==-1) participateMenu.splice(slugsMenu.indexOf('topics'), 1)
    slugsMenu = participateMenu.map(item =>{return item.slug})
    
    if (!data.organizationsettings.call.calls[req.session.call.index].availability && slugsMenu.indexOf('availability')!==-1) participateMenu.splice(slugsMenu.indexOf('availability'), 1)
    slugsMenu = participateMenu.map(item =>{return item.slug})
    if (!data.organizationsettings.call.calls[req.session.call.index].packages.length && slugsMenu.indexOf('packages')!==-1) participateMenu.splice(slugsMenu.indexOf('packages'), 1)
    slugsMenu = participateMenu.map(item =>{return item.slug})
    logger.info("participateMenu");
    logger.info(participateMenu);
    logger.info(data.organizationsettings.call.calls[req.session.call.index].availability);
    logger.info(slugsMenu);
  }
  if (req.isApi) {
    res.json({
      call: req.session.call,
      code: req.query.code,
      performances: performances,
      subscriptions: subscriptions,
      participateMenu: participateMenu,
      dett: data,
      user: req.user,
      msg: msg      
    });
  } else {
    res.render('events/participate', {
      title: data.title,
      //canonical: res.locals.canonical,
//canonical: (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl.split("?")[0],
      //canonical: res.locals.canonical,
//canonical: (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
      canonical: res.locals.canonical,
      dett: data,
      performances: performances,
      subscriptions: subscriptions,
      call: req.session.call,
      code: req.query.code,
      participateMenu: participateMenu,
      msg: msg
    });
  }
});

router.post('/', async (req, res) => {
  logger.info("req.params");
  logger.info(req.params);
  logger.info("req.body");
  logger.info(req.body);
    //let myasync = true;
  logger.info('POSTPOSTPOSTPOSTPOST');
  if (!req.user) return res.send({error: error, msg: {errors: {login: { message: req.__('To participate to the call for proposal you have to be logged in.')}}}})
  //logger.info('fetchEvent'+req.params.slug);
  let event;
  try {
    event = await Event.
    findOne({slug: req.params.slug}).
    populate({path: 'organizationsettings.call.calls.admitted', select: 'name'}).
    exec();
  } catch (error) {
    return res.send({error: error, msg: {errors: {event: { message: req.__('Event not found.')}}}})
  }
  if (!event) return res.send({error:true, msg: {errors: {event: { message: req.__('Event not found.')}}}});

  logger.info("req.body.performance");
  logger.info(req.body.performance);
  let performance;
  try {
    performance = await Performance.
    findOne({_id: req.body.performance}).
    populate({ "path": "users", "select": "stagename", "model": "UserShow"}).
    exec();
  } catch (error) {
    return res.send({error: error, msg: {errors: {performance: { message: req.__('Performance not found.')}}}})
  }
  if (!performance) return res.send({error: true, msg: {errors: {performance: { message: req.__('Performance not found.')}}}});

  logger.info("event");
  logger.info(event);
  let save = {
    event:              event._id,
    call:               req.body.call,
    topics:             req.body.topics,
    performance:        performance._id,
    status:             "5c38c57d9d426a9522c15ba5",
    reference:          req.user._id,
    subscriptions:      []
  };
  logger.info("save");
  //logger.info(req.body.subscriptions);
  for (var a=0; a<req.body.subscriptions.length; a++) {
    if (req.body.subscriptions[a].subscriber_id){
      var sub
      if (req.body.subscriptions[a].packages && req.body.subscriptions[a].packages.length && req.body.subscriptions[a].packages[0].personal) {
        sub = JSON.parse(JSON.stringify(req.body.subscriptions[a]));
        sub.packages = req.body.subscriptions[a].packages;
      } else {
        var packages = []; 
        for (var b=0; b<req.body.subscriptions[a].packages.length; b++) {
          var pack = JSON.parse(JSON.stringify(event.organizationsettings.call.calls[req.body.index].packages[req.body.subscriptions[a].packages[b].id]));
          pack.option = req.body.subscriptions[a].packages[b].option;
          packages.push(pack);
        }
        sub = JSON.parse(JSON.stringify(req.body.subscriptions[a]));
        sub.packages = packages;
      }
      save.subscriptions.push(sub);
    }
  }
  logger.info("save 2");
  //logger.info(save.subscriptions);
  let subsub;
  try {
    subsub = Program.create(save);
  } catch (error) {
    return res.send({error: error, msg: {errors: {program: { message: req.__('Unable to submit the proposal, please try again.')}}}})
  }
  if (!event.program) event.program = [];
  event.program.push({subscription_id: subsub._id, performance : req.body.performance});
  try {
    event.save()            
  } catch (error) {
    return res.send({error: error, msg: {errors: {event: { message: req.__('Unable to submit the proposal, please try again.')}}}})
  }
  // saved!
  // MAILER

  req.body.subscriptions.forEach(subscription => {
    const availability = subscription.availabilityDates;
    if (availability?.start && availability?.end) {
      subscription.days = getDaysBetween(availability.start, availability.end);
    } else {
      subscription.days = []; // fallback
    }
  });

  const selectedIds = [].concat(req.body.topics).map(id => String(id).trim());

  const allTopics = JSON.parse(JSON.stringify(event.organizationsettings.call.calls[req.body.call].topics));
  
  const selectedNames = allTopics
    .filter(t => selectedIds.includes(t._id))
    .map(t => t.name);

  console.log("selectedTopicNames:", selectedNames);

  try {
    await mySendMailer({
      __: req.__,
      template: 'participate',
      message: {
        to: req.user.stagename+" <"+req.user.email+">",
        cc: [event.organizationsettings.call.calls[req.body.call].title+" <"+event.organizationsettings.call.calls[req.body.call].email+">"],
        from: event.organizationsettings.call.calls[req.body.call].title+" <"+event.organizationsettings.call.calls[req.body.call].email+">"
      },
      email_content: {
        site:    (res.locals.isLocal ? "http" : "https")+"://"+req.headers.host,
        imghead: (res.locals.isLocal ? "http" : "https")+"://"+req.headers.host + event.organizationsettings.call.calls[req.body.call].imghead,
        colBkg: event.organizationsettings.call.calls[req.body.call].colBkg,
        imgalt:  event.organizationsettings.call.calls[req.body.call].imgalt,
        html_sign:  event.organizationsettings.call.calls[req.body.call].html_sign,
        text_sign:  event.organizationsettings.call.calls[req.body.call].text_sign,
        title:   event.organizationsettings.call.calls[req.body.call].title + " | " + req.__("Call Submission"),
        subject: performance.title + " | " + event.organizationsettings.call.calls[req.body.call].title + " | " + req.__("Call Submission"),
        block_1:  req.__("We’ve received a request to participate to") + " <b>" + event.organizationsettings.call.calls[req.body.call].title + "</b> "+req.__("from")+" <b>"+req.user.stagename+"</b>",
        block_1_plain:  req.__("We’ve received a request to participate to") + " " + event.organizationsettings.call.calls[req.body.call].title + " "+req.__("from")+" "+req.user.stagename+"",
        user: req.user,
        event: event,
        performance: performance,
        topics: selectedNames,
        subscriptions: req.body.subscriptions,
        call: req.body.call,
        block_2:  req.__("You will receive a feedback on your proposal as soon."),
        block_3:  req.__("Thanks."),
        link:  "",
        link_plain: ""/* 
        link:  "<a href=\""+(res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0]+"\">"+(res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0]+"</a>",
        link_plain: (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0] */
      }
    })
  } catch (error) {
    logger.info("Email sending failure");
    logger.info(error);
    return res.send({error: error, msg: {errors: {mySendMailer: { message: req.__('Unable to submit the proposal, please try again.')}}}})
  }
  res.send({error: false, msg: req.__('Proposal, sent.')});
});

function getDaysBetween(startDateStr, endDateStr) {
  const days = [];
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

/*
router.post('/', async (req, res) => {
  var participateMenu = [
    {label:req.__('Active Calls'),slug:"calls"},        // 0
    {label:req.__('Terms'),slug:"terms"},               // 1
    {label:req.__('Artwork'),slug:"performance"},       // 2
    {label:req.__('Topics'),slug:"topics"},             // 3
    {label:req.__('Availability'),slug:"availability"}, // 4
    {label:req.__('Packages'),slug:"packages"},         // 5
    {label:req.__('Summary'),slug:"summary"},           // 6
    {label:req.__('Submit'),slug:"submit"}              // 7
  ];
  var slugsMenu = participateMenu.map(item =>{return item.slug})

  logger.info(req.session.call);
  if ((req.session.call && req.session.call.saved) || !req.body || !req.session.call) {
    if (req.body && req.body.step) delete req.body.step;
    delete req.session.call;
    //res.redirect((res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0]);
    res.redirect(res.locals.canonical);
  } else {
    let myasync = true;
    logger.info('POSTPOSTPOSTPOSTPOST');
    //logger.info('fetchEvent'+req.params.slug);
    let data;
    try {
      data = await Event.
      findOne({slug: req.params.slug}).
      populate({path: 'organizationsettings.call.calls.admitted', select: 'name'}).
      exec();
    } catch (error) {
      return next(error);
    }
    if (req.session.call.index!==undefined) {
      slugsMenu = participateMenu.map(item =>{return item.slug})
      logger.info(data.organizationsettings.call.calls[req.session.call.index]);
      logger.info("slugsMenu");
      logger.info(slugsMenu.indexOf('topics'));
      data.organizationsettings.call.calls[req.session.call.index].topics = []
      data.organizationsettings.call.calls[req.session.call.index].availability = false
      data.organizationsettings.call.calls[req.session.call.index].packages = []
      if (!data.organizationsettings.call.calls[req.session.call.index].topics.length && slugsMenu.indexOf('topics')!==-1) participateMenu.splice(slugsMenu.indexOf('topics'), 1)
        slugsMenu = participateMenu.map(item =>{return item.slug})
        if (!data.organizationsettings.call.calls[req.session.call.index].availability && slugsMenu.indexOf('availability')!==-1) participateMenu.splice(slugsMenu.indexOf('availability'), 1)
        slugsMenu = participateMenu.map(item =>{return item.slug})
        if (!data.organizationsettings.call.calls[req.session.call.index].packages.length && slugsMenu.indexOf('packages')!==-1) participateMenu.splice(slugsMenu.indexOf('packages'), 1)
        slugsMenu = participateMenu.map(item =>{return item.slug})
      }
      let msg
      logger.info("msg");
      logger.info(msg);
      if (data && typeof req.body.step!='undefined') {
        logger.info(participateMenu[parseInt(req.body.step)]);
        
        switch (participateMenu[parseInt(req.body.step)].slug) {
          case 'calls' :
            logger.info('case 0');
            if (!req.user.name) {
              if (!msg || !msg.e) msg = {e:[]};
              msg.e.push({name:'index', m:req.__('Warning: You have no name available. Please add your name in your profile and come back.')+" <a href=\"/admin/profile/"+req.user._id+"/private\">"+req.__("ADD NOW")+"</a>"});
            }
            if (!req.user.surname) {
              if (!msg || !msg.e) msg = {e:[]};
              msg.e.push({name:'index', m:req.__('Warning: You have no surname available. Please add your surname in your profile and come back.')+" <a href=\"/admin/profile/"+req.user._id+"/private\">"+req.__("ADD NOW")+"</a>"});
            }
            if (!req.user.email) {
              if (!msg || !msg.e) msg = {e:[]};
              msg.e.push({name:'index', m:req.__('Warning: You have no email available. We need your email for all the communications. Please add an email and come back.')+" <a href=\"/admin/profile/"+req.user._id+"/private\">"+req.__("ADD NOW")+"</a>"});
            }
            var results = req.user.mobile.reduce((results, item) => {
              if (item.url) results.push(item.url); // modify is a fictitious function that would apply some change to the items in the array
              return results
            }, [])
            if (!results.length) {
              if (!msg || !msg.e) msg = {e:[]};
              msg.e.push({name:'index', m:req.__('Warning: You have no mobile phone available. We need your mobile phone in case of urgent issue. Please add a mobile phone and come back.')+" <a href=\"/admin/profile/"+req.user._id+"/private\">"+req.__("ADD NOW")+"</a>"});
            }
            if (!msg) {
              if (data && typeof req.body.index!='undefined') {
                myasync = false;
                let ids = [req.user._id].concat(req.user.crews);
                let performances;
                try {
                  performances = await dataprovider.getPerformanceByIds(req, ids);
                  console.log(performances);
                } catch (error) {
                  console.error("Failed to fetch performances:", error);
                }
                logger.info(performances);
                
                let admitted = {};
                var admittedCat = data.organizationsettings.call.calls[req.body.index].admitted.map(a => a._id.toString());
                logger.info('admittedCat '+admittedCat);
                for (let item in admittedCat) {
                  for (let perf in performances) {
                    logger.info('performances[perf].type ')
                    logger.info( performances[perf].type);
                    if (performances[perf].type && performances[perf].type._id) {
                      //var result = performances[perf].categories.map(a => a._id.toString());
                      var result = performances[perf].type._id.toString();
                      if (result.indexOf(admittedCat[item]) !== -1) {
                        admitted[performances[perf]._id.toString()] = performances[perf];
                      }
                    }
                  }
                }
                let admittedA = [];
                for (let perf in admitted) {
                  logger.info(admitted[perf].type);
                  admittedA.push(admitted[perf]);
                }
                logger.info('performances '+performances.length);
                logger.info('admitted '+admittedA.length);
                //logger.info(admitted);
                req.session.call.index = parseInt(req.body.index);
                if (admittedA.length) {
                  req.session.call.step = parseInt(req.body.step)+1;
                  req.session.call.admitted = admittedA;
                } else {
                  msg = {e:[{name:'index', m:req.__('Warning: You need at least one performance of this types to participate to the call selected: <b>'+ data.organizationsettings.call.calls[req.body.index].admitted.map(a => a.name.toString()).join(", ") +'</b>. Please create a performance and come back.')+" <a href=\"/admin/performances\">"+req.__("CREATE YOUR PERFORMANCE NOW")+"</a>"}]};
                  logger.info(msg);
                }
  
                if (req.isApi) {
                  res.json(data);
                } else {
                  logger.info('STOCAZZO ');
                  logger.info(msg);
                  res.render('events/participate', {
                    title: data.title,
                    canonical: res.locals.canonical,
  //canonical: (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
                    dett: data,
                    call: req.session.call,
                    participateMenu: participateMenu,
                    user: req.user,
                    msg: msg
                  });
                }
              } else {
                msg = {e:[{name:'index', m:req.__('Please select a call')}]};
              }  
            }
            break;
          case 'terms' :
            logger.info('case 1');  
            if (data && req.body.accept=='1' && req.body.confirm_personal_data=='1') {
              req.session.call.step++;
            } else {
              if (req.body.accept!='1') {
                if (!msg || !msg.e) msg = {e:[]};
                msg.e.push({name:'accept',m:req.__('Please accept the terms and conditions to go forward')});
              }
              if (req.body.confirm_personal_data!='1') {
                if (!msg || !msg.e) msg = {e:[]};
                msg.e.push({name:'confirm_personal_data',m:req.__('Please confirm your personal data to go forward')});
              }
            }
            break;
          case 'performance' :
            if (data && typeof req.body.performance!='undefined') {
              req.session.call.step = parseInt(req.body.step)+1;
              req.session.call.performance = parseInt(req.body.performance);
              let perfpeoples = [];
              let allsubscriptions = [];
              logger.info("req.session.call.admitted[req.session.call.performance].users");
              //logger.info(req.session.call.admitted[req.session.call.performance].users);
              for (var b=0;b<req.session.call.admitted[req.session.call.performance].users.length;b++) {
                if (req.session.call.admitted[req.session.call.performance].users[b].members && req.session.call.admitted[req.session.call.performance].users[b].members.length){
                  //logger.info(call.admitted[call.performance].users[b].members);
                  for (var c=0;c<req.session.call.admitted[req.session.call.performance].users[b].members.length;c++) {
                    perfpeoples.push(req.session.call.admitted[req.session.call.performance].users[b].members[c]._id);
                    allsubscriptions.push({subscriber_id: req.session.call.admitted[req.session.call.performance].users[b].members[c]._id,stagename: req.session.call.admitted[req.session.call.performance].users[b].members[c].stagename});
                  }
                } else {
                  perfpeoples.push(req.session.call.admitted[req.session.call.performance].users[b]._id);
                  allsubscriptions.push({subscriber_id: req.session.call.admitted[req.session.call.performance].users[b]._id,stagename: req.session.call.admitted[req.session.call.performance].users[b].stagename});
                }          
              }
              logger.info("perfpeoples");
              logger.info({"subscriptions.subscriber_id":{$in:perfpeoples}});
              myasync = false;
              let subscriptions = await Program.find({"subscriptions.subscriber_id":{$in:perfpeoples}, event: req.session.call.event._id}).
              lean().exec();
              logger.info("subscriptions");
              logger.info(subscriptions.count);
              let subscriptionsfound = [];
              for (var b=0;b<subscriptions.length;b++) {
                subscriptionsfound = subscriptionsfound.concat(subscriptions[b].subscriptions);
                //logger.info(subscriptions[b].subscriptions);
                //logger.info(subscriptionsfound);
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
              logger.info("allsubscriptions");
              //logger.info(allsubscriptions);
              if (req.isApi) {
                res.json({
                  title: data.title,
                  canonical: res.locals.canonical,
    //canonical: (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
                  dett: data,
                  call: req.session.call,
                  participateMenu: participateMenu,
                  user: req.user,
                  msg: msg
                });
              } else {
                res.render('events/participate', {
                  title: data.title,
                  canonical: res.locals.canonical,
    //canonical: (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
                  dett: data,
                  call: req.session.call,
                  participateMenu: participateMenu,
                  user: req.user,
                  msg: msg
                });
              }
            } else {
              msg = {e:[{name:'accept',m:req.__('Please select a performance to go forward')}]}
            }
            break;
          case 'topics' :
            if (data && req.body.topics && req.body.topics.length) {
              req.session.call.step = parseInt(req.body.step)+1;
              req.session.call.topics = req.body.topics;
            } else {
              msg = {e:[{name:'accept',m:req.__('Please select at least 1 topic to go forward')}]}
            }
            break;
          case 'availability' :
            logger.info("req.body.subscriptions");
            logger.info(req.body.subscriptions);
            logger.info(req.body.subscriptions.filter(item => item.subscriber_id));
            logger.info(req.body.subscriptions.filter(item => item.subscriber_id).length);
            if (data && req.body.subscriptions && req.body.subscriptions.length && req.body.subscriptions.filter(item => item.subscriber_id).length) {
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
                      if (req.session.call.subscriptions[b].stagename.replace(new RegExp("'", 'g'),"%27") === req.body.subscriptions[a].stagename.replace(new RegExp("'", 'g'),"%27") && people.indexOf(req.body.subscriptions[a].subscriber_id)===-1){
                        people.push(req.body.subscriptions[a].subscriber_id);
                        req.session.call.subscriptions[b].subscriber_id = req.body.subscriptions[a].subscriber_id;
                        req.session.call.subscriptions[b].days = req.body.subscriptions[a].days;
                      }
                    }
                  }
                }
              } else {
                msg = {e:[{name:'accept',m:req.__('Please select at least 1 day for all the people availables to go forward')}]};
              }
            } else {
              msg = {e:[{name:'accept',m:req.__('Please select at least 1 person to go forward')}]};
            }
            break;
          case 'packages' :
            if (data && req.body.subscriptions && req.body.subscriptions.length) {
              for (var a=0; a<req.body.subscriptions.length; a++) {
                if (req.body.subscriptions[a].packages && req.body.subscriptions[a].packages !== 'null' && req.session.call.subscriptions[a].freezed != 'true'){
                  req.session.call.subscriptions[a].packages = req.body.subscriptions[a].packages;
                  var alternative = []
                  var alternative_find = false
                  for (var c=0; c<data.organizationsettings.call.calls[req.session.call.index].packages.length; c++) {
                    if (data.organizationsettings.call.calls[req.session.call.index].packages[c].alternative) {
                      alternative_find = true;
                      if (alternative.indexOf(data.organizationsettings.call.calls[req.session.call.index].packages[c].alternative_name)===-1) {
                        alternative.push(data.organizationsettings.call.calls[req.session.call.index].packages[c].alternative_name)
                      }
                    }
                  }
                  console.log("stocazzissimo")
                  console.log(req.body.subscriptions[a].packages)
                  console.log(alternative)
                  for (var b=0; b<req.body.subscriptions[a].packages.length; b++) {
                    if (alternative_find && alternative.indexOf(data.organizationsettings.call.calls[req.session.call.index].packages[req.body.subscriptions[a].packages[b].id].alternative_name)!==-1){
                      alternative.splice(alternative.indexOf(data.organizationsettings.call.calls[req.session.call.index].packages[req.body.subscriptions[a].packages[b].id].alternative_name))
                    }
                    console.log(alternative)
                    if (data.organizationsettings.call.calls[req.session.call.index].packages[req.body.subscriptions[a].packages[b].id].allow_options && !req.body.subscriptions[a].packages[b].option ){
                      msg = {e:[{name:'accept',m:req.__('Please select at least 1 option for the packages')+" "+data.organizationsettings.call.calls[req.session.call.index].packages[req.body.subscriptions[a].packages[b].id].name}]}
                    }
                  }
                  if (alternative.length){
                    if (msg && msg.e) {
                      msg.e.push({name:'accept',m:req.__('Please select at least 1 of the required packages:')+" "+alternative.join(", ")})
                    } else {
                      msg = {e:[{name:'accept',m:req.__('Please select at least 1 of the required packages:')+" "+alternative.join(", ")}]}
                    }
                  }
              }
              }
              if (!msg) req.session.call.step = parseInt(req.body.step)+1;
            } else {
              msg = {e:[{name:'accept',m:req.__('Please select at least 1 package to go forward')}]}
            }
            break;
          case 'summary' :
            myasync = false;
            // SAVE
            //logger.info('req.session.call.index');
            //logger.info(req.session.call.index);
            logger.info(req.session.call.admitted[req.session.call.performance]);
            req.session.call.save = {
              event:        req.session.call.event._id,
              call:         req.session.call.index,
              topics:       req.session.call.topics,
              performance:  req.session.call.admitted[req.session.call.performance]._id,
              performance_categories:  req.session.call.admitted[req.session.call.performance].type,
              //performance_categories:  req.session.call.admitted[req.session.call.performance].type,filter(function (el) {return el.ancestor.slug=="type";})[0]._id,
              status:       "5c38c57d9d426a9522c15ba5",
              reference:    req.user._id,
              subscriptions:[]
            };
            for (var a=0; a<req.session.call.subscriptions.length; a++) {
              if (req.session.call.subscriptions[a].subscriber_id){
                var sub
                if (req.session.call.subscriptions[a].packages && req.session.call.subscriptions[a].packages.length && req.session.call.subscriptions[a].packages[0].personal) {
                  sub = JSON.parse(JSON.stringify(req.session.call.subscriptions[a]));
                  sub.packages = req.session.call.subscriptions[a].packages;
                } else {
                  var packages = []; 
                  for (var b=0; b<req.session.call.subscriptions[a].packages.length; b++) {
                    var pack = JSON.parse(JSON.stringify(data.organizationsettings.call.calls[req.session.call.index].packages[req.session.call.subscriptions[a].packages[b].id]));
                    pack.option = req.session.call.subscriptions[a].packages[b].option;
                    packages.push(pack);
                  }
                  sub = JSON.parse(JSON.stringify(req.session.call.subscriptions[a]));
                  sub.packages = packages;
                }
                req.session.call.save.subscriptions.push(sub);
              }
            }
            //logger.info('req.session.call.save');
            //logger.info(req.session.call.save);
            //logger.info(req.session.call.save);
            let subsub;
            try {
              subsub = Program.create(req.session.call.save);
            } catch (err) {
              msg = {e:[{name:'index', m:req.__('Unable to submit the proposal, please try again.')},{name:'index', m:err}]};
              res.render('events/participate', {
                title: data.title,
                canonical: res.locals.canonical,
  //canonical: (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
                dett: data,
                call: req.session.call,
                participateMenu: participateMenu,
                user: req.user,
                msg: msg
              });
            }
            if (!data.program) data.program = [];
            data.program.push({subscription_id: subsub._id, performance : req.session.call.admitted[req.session.call.performance]._id});
            try {
              data.save()            
            } catch (err) {
              msg = {e:[{name:'index', m:req.__('Unable to submit the proposal, please try again.')},{name:'index', m:err}]};
              res.render('events/participate', {
                title: data.title,
                canonical: res.locals.canonical,
  //canonical: (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
                dett: data,
                call: req.session.call,
                participateMenu: participateMenu,
                user: req.user,
                msg: msg
              });
            }
            // saved!
            // MAILER
            try {
              await mySendMailer({
                template: 'participate',
                message: {
                  to: req.user.stagename+" <"+req.user.email+">",
                  cc: [data.organizationsettings.call.calls[req.session.call.index].title+" <"+data.organizationsettings.call.calls[req.session.call.index].email+">"],
                  from: data.organizationsettings.call.calls[req.session.call.index].title+" <"+data.organizationsettings.call.calls[req.session.call.index].email+">"
                },
                email_content: {
                  site:    (res.locals.isLocal ? "http" : "https")+"://"+req.headers.host,
                  imghead: (res.locals.isLocal ? "http" : "https")+"://"+req.headers.host + data.organizationsettings.call.calls[req.session.call.index].imghead,
                  colBkg: data.organizationsettings.call.calls[req.session.call.index].colBkg,
                  imgalt:  data.organizationsettings.call.calls[req.session.call.index].imgalt,
                  html_sign:  data.organizationsettings.call.calls[req.session.call.index].html_sign,
                  text_sign:  data.organizationsettings.call.calls[req.session.call.index].text_sign,
                  title:   data.organizationsettings.call.calls[req.session.call.index].title + " | " + req.__("Call Submission"),
                  subject: req.session.call.admitted[req.session.call.performance].title + " | " + data.organizationsettings.call.calls[req.session.call.index].title + " | " + req.__("Call Submission"),
                  block_1:  req.__("We’ve received a request to participate to") + " <b>" + data.organizationsettings.call.calls[req.session.call.index].title + "</b> "+req.__("from")+" <b>"+req.user.stagename+"</b>",
                  block_1_plain:  req.__("We’ve received a request to participate to") + " " + data.organizationsettings.call.calls[req.session.call.index].title + " "+req.__("from")+" "+req.user.stagename+"",
                  user: req.user,
                  dett: data,
                  call: req.session.call,
                  block_2:  req.__("You will receive a feedback on your proposal as soon."),
                  block_3:  req.__("Thanks."),
                  link:  "",
                  link_plain: ""
                  //link:  "<a href=\""+(res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0]+"\">"+(res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0]+"</a>",
                  //link_plain: (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0]
                }
              })
              req.session.call.step = parseInt(req.body.step)+1;
              req.session.call.saved = true;
            } catch (err) {
              logger.info("Email sending failure");
              logger.info(err);
              msg = {e:[{name:'index', m:req.__('Unable to submit the proposal, please try again.')},{name:'index', m:err}]};
            }
            if (req.isApi) {
              res.json({
                dett: data,
                call: req.session.call,
                participateMenu: participateMenu,
                user: req.user,
                msg: msg
              });
            } else {
              res.render('events/participate', {
                title: data.title,
                canonical: res.locals.canonical,
  //canonical: (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
                dett: data,
                call: req.session.call,
                participateMenu: participateMenu,
                user: req.user,
                msg: msg
              });
            }
        }
      } else {
        msg = {e:[{name:'index', m:req.__('Unknow error')}]};
      }
  
      if (myasync) {
        if (req.isApi) {
          res.json(data);
        } else {
          logger.info('JUST BEFORE RENDER');
          //logger.info(req.session.call.step);
          //logger.info(req.session.call);  
          logger.info(msg);
          res.render('events/participate', {
            title: data.title,
            canonical: res.locals.canonical,
  //canonical: (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl.split("?")[0],
            dett: data,
            call: req.session.call,
            participateMenu: participateMenu,
            user: req.user,
            msg: msg
          });
        }
      }
    }
  });
  
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
                  logger.info("GETGETGETGETGETGET");
                  logger.info(req.session.call);

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
                logger.info("POSTPOSTPOSTPOSTPOST");
                logger.info(req.body);
                logger.info(req.body.step);
                logger.info(typeof req.body.step);
                if (dett && typeof req.body.step!='undefined') {
                  var msg;
                  switch (parseInt(req.body.step)) {
                    case 0 :
                      if (dett && typeof req.body.index!='undefined') {
                        req.session.call.step = parseInt(req.body.step)+1;
                        req.session.call.index = parseInt(req.body.index);
                      } else {
                        msg = {e:[{name:"index",m:req.__("Please select a call")}]}
                      }
                      break;
                    case 1 :
                      if (dett && req.body.accept=='1') {
                        req.session.call.step = parseInt(req.body.step)+1;
                      } else {
                        msg = {e:[{name:"accept",m:req.__("Please accept the terms and conditions to go forward")}]}
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
                        msg = {e:[{name:"accept",m:req.__("Please select a performance to go forward")}]}
                      }
                      break;
                    case 3 :
                      if (dett && req.body.topics.length) {
                        req.session.call.step = parseInt(req.body.step)+1;
                        req.session.call.topics = req.body.topics;
                      } else {
                        msg = {e:[{name:"accept",m:req.__("Please select at least 1 topic to go forward")}]}
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
                        msg = {e:[{name:"accept",m:req.__("Please select at least 1 person to go forward")}]}
                      }
                      break;
                  }
                  logger.info(req.session.call);
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

export default router;
