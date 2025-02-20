import createRouter from "../../router.js";
const router = createRouter();

import config  from 'getconfig';
import helpers from '../../../utilities/helpers.js';
import dataprovider from "../../../utilities/dataprovider.js";

import mongoose from 'mongoose';
const Models = {
  'Category': mongoose.model('Category'),
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'EventShow': mongoose.model('EventShow'),
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
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

import {mySendMailer} from '../../../utilities/mailer.js';

router.sendEmailVerification = async (req, res) => {
  logger.info("sendEmailVerification");
  logger.info(req.headers.host);
  //import uid from 'uuid';
  //import mongoose from 'mongoose';
  const User = mongoose.model('User');
  //User.findOne({"emails.email": req.params.email}, "emails", (err, user) => {
  let user;
  try {
    user = await User.findOne({"_id": req.user._id}).select("emails");
    if (!user) {
      logger.info("USER NOT FOUND");     
      return res.json({error: true, msg: __("USER NOT FOUND")});
    } else if (req.user._id.toString() !== user._id.toString() /*&& !req.user.is_admin*/) {
      logger.info("EMAIL IS NOT YOUR");     
      return res.json({error: true, msg: __("EMAIL IS NOT YOUR")});
    }
  } catch (err) {
    logger.info("MAIL SEARCH ERROR");
    return res.json({error: true, msg: __("MAIL SEARCH ERROR")});
  }
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
      user.emails[item].confirm = setIdentifier();
      logger.info(user.emails[item]);
      logger.info(user);
      try {
        await user.save();
      } catch (err) {
        logger.info("Save failuresssss");
        logger.info(err);
        return res.json({error: true, msg: __(err.message)});
      }
      logger.info("Save success");
      logger.info("mySendMailer");
      try {
        await mySendMailer({
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
        });

      } catch (err) {
        logger.info("Email sending failure");
        logger.info(err);
        return res.json({error: true, msg: __("Confirmation email sending failure, please try later"), err: err});
      }
      logger.info("Email sending OK");
      return res.json({error: false, msg: __("Confirmation Email sending success, please check your inbox and confirm")});
    }
  }
  if(nothingToDo) {
    logger.info("Nothing to do");
    return res.json({error: true, msg: "Nothing to do"});          
  }
}

router.getCountries = async (req, res) => {
  res.json(helpers.getCountries());
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
    let data;
    try {
      data = await Models["Program"]
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
  logger.info("getList");
  if (config.cpanel[req.params.sez] && req.params.id) {
    const select = req.query.pure ? config.cpanel[req.params.sez].list.select : Object.assign(config.cpanel[req.params.sez].list.select, config.cpanel[req.params.sez].list.selectaddon);
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].list.populate;
    const ids = [req.params.id].concat(req.user.crews.map(u => {return u._id.toString()}));
    const query =  req.params.sez == "crews" || req.params.sez == "partners" ? {members: req.params.id} : {users:{$in: ids}};
    let data;
    try {
      data = await Models[config.cpanel[req.params.sez].list.model]
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


router.getEmailqueue = async (req, res) => {
  logger.info('/mailer/'+req.params.id);
  logger.info("getEmailqueue");
  logger.info("req.body");
  var ids = req.user.crews.map(item => {return item._id});
  logger.info(ids);
  logger.info(req.body);
  logger.info("req.params");
  logger.info(req.params);

  let data;
  var query = {$or:[{organization: {$in: ids}}, {user: req.user._id}]};
  if (req.params.event) query.event = req.params.event;
  var populate = [
    {path: "organization", select: {stagename:1, slug:1}, model:"UserShow"},
    {path: "user", select: {stagename:1, slug:1}, model:"UserShow"},
    {path: "event", select: {title:1, slug:1}, model:"EventShow"}
  ];
  try {
    data = await Models.Emailqueue.
    find(query).
    //sort({stagename: 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    populate(populate).
    exec()  
  } catch (err) {
    return res.status(500).send({ message: `${JSON.stringify(err)}` });
  }
  logger.info("data");
  logger.info(data);
  if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
    return res.json(data);
  } else {
    return res.render('admin/emailqueue', {
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
}

router.getPartners = async (req, res) => {
  logger.info('/organizations/'+req.params.id);
  //logger.info(req.user.crews.map(item => {return item._id}));
  var crews = req.user.crews.map(item => {return item._id});
  let event
  let data
  let categories
  var populate = [
    {path: "users", select: {stagename:1}, model:"UserShow"},
    {path: "partners.users", select: {stagename:1}, model:"UserShow"},
    {path: "partners.category", select: {name:1, slug:1}, model:"Category"}
  ];
  try {
    categories = await Models.Category.
    find({ancestor: "5be8708afc396100000001eb"}).
    lean().
    exec();
    if (!categories) {
      logger.info("categories error 1");
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });    
    }
  } catch (err) {
    logger.info("categories error 2");
    logger.info(`${JSON.stringify(err)}`);
    return res.status(500).send({ message: `${JSON.stringify(err)}` });
  }
  try {
    event = await Models.Event.
    //find({"users": req.params.id}).
    findOne({_id: req.params.id}).
    populate(populate).
    select({title: 1, slug: 1, partners:1, users:1}).
    exec();
    if (!event) {
      logger.info("event error");
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });    
    }
  } catch (err) {
    logger.info("event error");
    logger.info(`${JSON.stringify(err)}`);
    return res.status(500).send({ message: `${JSON.stringify(err)}` });
  }

  var populate = [
    { "path": "partners.partner", "select": "stagename", "model": "User"}
  /* 
    {path: "members", select: {stagename:1, gender:1, name:1, surname:1, email:1, emails:1, phone:1, mobile:1, lang:1, skype:1, slug:1, social:1, web:1}, model:"UserShow"},
    {path: "partnerships", select: {title:1, slug:1}, model:"EventShow"},
    {path: "partnerships.category", select: {name:1, slug:1}, model:"Category"}
  */];
  //const query = {"partner_owner.owner": {$in: event.users.map(item =>{return item._id})}};
  const query = {"_id": {$in: event.users.map(item =>{return item._id})}};
  try {
    data = await Models.User.
    find(query).
    lean().
    sort({stagename: 1}).
    populate(populate).
    exec();
    if (!data) {
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });    
    }
  } catch (err) {
    return res.status(500).send({ message: `${JSON.stringify(err)}` });
  }
  var partners = []
  for (var item in data) {
    partners = partners.concat(data[item].partners);
  }   
  if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
    return res.json(data);
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
      return res.json(data);
    } else {
      return res.render('admin/events_partners', {
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
router.performanceAddEvent = async (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  let item;
  try {
    item = await Models['Performance']
    .findOne(query)
    .select({_id:1, title:1, stats:1, bookings:1})
    //.populate({ "path": "users", "select": "stagename", "model": "User"})
    .exec();
    if (!item) {
      return res.status(404).send({
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
      return res.status(404).send({
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
    }
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });  
  }
  try {
    item.bookings.push({event:req.params.event});
    await item.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  var query = {_id: req.params.event};
  var select = {_id:1, program:1}
  let event;
  try {
    event = await Models["Event"]
    .findOne(query)
    .select(select)
    //.populate({ "path": "members", "select": "addresses", "model": "User"})
    .exec();
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    event.program.push({performance:req.params.id});
    await event.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    query = {event: req.params.event, performance: req.params.id};
    program = await Models["Program"]
    .findOne(query)
    .exec();
    if (!program) {
      program = {};
      program.performance = req.params.id;
      program.reference = req.user._id;
      program.event = req.params.event;
      program.status = "5be8708afc39610000000013";
      try {
        program = await Models["Program"]
        .create(program);
        req.params.sez = 'events';
        req.params.form = 'program';
        return dataprovider.getData(req, res, "json");            
      } catch (err) {
        logger.info(`${JSON.stringify(err)}`);
        return res.status(404).send({ message: err });
      }
    }
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  req.params.sez = 'events';
  req.params.form = 'program';
  return dataprovider.getData(req, res, "json");            
}

router.performanceRemoveEvent = async (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  let item;
  try {
    item = await Models['Performance']
    .findOne(query)
    .select({_id:1, bookings:1,})
    //.populate({ "path": "users", "select": "stagename", "model": "User"})
    .exec();
    if (!item) {
      return res.status(404).send({
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
      return res.status(404).send({
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
    }
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    item.bookings.splice(item.bookings.map((item)=>{return item.event.toString()}).indexOf(req.params.event), 1);
    //res.json(item);
    await item.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });   
  }
  var query = {_id: req.params.event};
  var select = {_id:1, program:1}
  //select[req.params.sez] = 1;
  let event;
  try {
    event = await Models["Event"]
    .findOne(query)
    .select(select)
    //.populate({ "path": "members", "select": "addresses", "model": "User"})
    .exec()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    event.program.splice(event.program.map((item)=>{return item.performance.toString()}).indexOf(req.params.id), 1);
    await event.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    query = {event: req.params.event, performance: req.params.id};
    program = await Models["Program"]
    .findOneAndDelete(query);
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }

  req.params.sez = 'events';
  req.params.form = 'program';
  return dataprovider.getData(req, res, "json");            
}

router.eventGetFreezed = (req, res) => {
  console.log("eventGetFreezed")
  var populate = [
    { 
      "path": "program.performance", "select": "id title image slug duration price paypal users is_public stats abouts galleries videos bookings", "model": "Performance",  
      "populate": [
        { "path": "users", "select": "stagename slug stats addresses members organizationData gender image abouts web social performances", "model": "UserShow"
          //, "populate": [
          //{ "path": "performances", "select": "title slug image users", "model": "Performance", "populate": [
          //  { "path": "users", "select": "stagename slug stats addresses members organizationData gender image abouts web social performances", "model": "UserShow"},
          //  { "path": "bookings", "populate":{ "path": "performance", "select": "title slug image users", "model": "Performance"}}
          //]}
        //]
        },
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
        console.log("program_freezed")
        console.log(event.is_freezed)
        console.log(event.advanced.performers)
        //event.is_freezed = true;
        //2event.program_freezed = JSON.parse(JSON.stringify(event.advanced));
        //event.program_freezed.programmenotscheduled.forEach(function (item) {
        //  item.id = item._id;
        //  delete item._id;
        //});

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

router.removeAddressEvents = async (req, res, newaddr, cb) => {
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
              /* if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
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
              if (events[a].program[b].schedule.venue && events[a].program[b].schedule.venue.name == req.query.name *//*  && events[a].program[b].schedule.venue.location.country === req.query.country && events[a].program[b].schedule.venue.location.locality === req.query.locality *//* ) { */
                
                
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
/*                 if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
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
        var b=0; */
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
/*        if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
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
      dataprovider.getData(req, res, "json");
    });
  });

  //Models[config.cpanel[req.params.sez].model].update( query , { $pull: {"medias": {"slug": req.params.image } } }, function(err){
  //  req.params.form = 'public';
  //  dataprovider.getData(req, res, "json");
  //});

}
  
router.removeFootage = (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.members = req.user._id;
  logger.info(query);
  Models["Playlist"]
  .findOne(query)
  .select({_id:1, title:1, stats:1, footage:1})
  .populate({ "path": "footage", "select": "title", "model": "Footage"})
  .exec((err, playlist) => {
    if (err) {
      logger.info(`${JSON.stringify(err)}`);
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
      logger.info("playlist.footage");
      logger.info(playlist.footage);
      logger.info(playlist.footage.length);
      playlist.stats.footage = playlist.footage.length;

      playlist.save(function(err){
        if (err) {
          logger.info(`${JSON.stringify(err)}`);
          res.status(404).send({ message: err });
        } else {
          var query = {_id: req.params.footage};
          Models["Footage"]
          .findOne(query)
          .select({_id:1, stats:1, playlists:1})
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, footage) => {
            footage.playlists.splice(footage.playlists.indexOf(req.params.id), 1);
            logger.info("footage.playlists");
            logger.info(footage.playlists);
            logger.info(footage.playlists.length);
            footage.stats.playlists = footage.playlists.length;
            footage.save(function(err){
              if (err) {
                logger.info(`${JSON.stringify(err)}`);
                res.status(404).send({ message: err });
              } else {
                req.params.sez = 'playlists';
                req.params.form = 'public';
                dataprovider.getData(req, res, "json");
              }
            });
          });
        }
      });
    }
  });
}


const safeExecute = async (operation, errorMessage, res = null, exit = false) => {
  try {
    const result = await operation;
    if (!result) {
      logger.error(`❌ ${errorMessage}:`);
      if(exit && res) return res.status(500).send({ message: `${JSON.stringify(errorMessage)}` });
      return null;
    }
    return result;
  } catch (err) {
    logger.error(`❌ ${errorMessage}:`, error);
    if(exit && res) return res.status(500).send({ message: `${JSON.stringify(error)}` });
    return null;
  }
};

router.getOwnresIds = (req, res,cb) => {
  Models.User
  .findById(req.params.id)
  .select({crews:1})
  .exec((err, data) => {
    if (data._id) data.crews.push(data._id);
    cb(data.crews);
  });
}

router.getSlug = async (req, res) => {
  try {
    const model = await Models[config.cpanel[req.params.sez].model];
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

router.getEmail = async (req, res) => {
  logger.info("getEmail", req.params.email);
  try {
    const user = await safeExecute(
      Models["User"].findOne({ $or: [{ "email": req.params.email }, { "emails.email": req.params.email }] }).select("_id").exec(),
      "Error fetching user by email",
      res,
      true
    );

    return res.json({ email: req.params.email, exist: user !== null });
  } catch (err) {
    logger.error(error);
  }
};



router.getCategories = async (req, res) => {
  if (req.params.rel == "performances" && req.params.q == "type") {
    router.getPerfCategories(req, res, (result) => {
      res.json(result);
    });
  } else {
    let conta = 0;
    try {
      let category = await Models.Category.findOne({slug: req.params.q, rel: req.params.rel })
      .select({name:1 , slug:1})
      .exec();
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
    } catch (err) {
      logger.info(`${JSON.stringify(err)}`);
    }
  }
}

router.getPerfCategories = async (req, res) => {
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
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });
    } else if (!item) {
      return res.status(404).send({
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
      return res.status(404).send({
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
          return res.status(404).send({ message: err });
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
                return res.status(404).send({ message: err });
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
                        return res.status(404).send({ message: err });
                      } else {
                        req.params.sez = 'events';
                        req.params.form = 'program';
                        dataprovider.getData(req, res, "json");            
                      }
                    });
                  } else {
                    req.params.sez = 'events';
                    req.params.form = 'program';
                    dataprovider.getData(req, res, "json");            
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
