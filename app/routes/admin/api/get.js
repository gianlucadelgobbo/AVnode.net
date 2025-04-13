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
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Video': mongoose.model('Video'),
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
      return res.json({error: true, msg: req.__("USER NOT FOUND")});
    } else if (req.user._id.toString() !== user._id.toString() /*&& !req.user.is_admin*/) {
      logger.info("EMAIL IS NOT YOUR");     
      return res.json({error: true, msg: req.__("EMAIL IS NOT YOUR")});
    }
  } catch (err) {
    logger.info("MAIL SEARCH ERROR");
    return res.json({error: true, msg: req.__("MAIL SEARCH ERROR")});
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
        return res.json({error: true, msg: req.__(err.message)});
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
            site:    res.locals.host,
            title:    req.__("Email Confirm"),
            subject:  req.__("Email Confirm")+' | AVnode.net',
            block_1:  req.__("We’ve received a request to add this new email")+": "+user.emails[item].email,
            button:   req.__("Click here to confirm"),
            block_2:  req.__("If you didn’t make the request, just ignore this message. Otherwise, you add the email using this link:"),
            block_3:  req.__("Thanks."),
            link:     res.locals.host+'/verify/email/'+user.emails[item].confirm,
            html_sign: "The AVnode.net Team",
            text_sign:  "The AVnode.net Team"
          }
        });

      } catch (err) {
        logger.info("Email sending failure");
        logger.info(err);
        return res.json({error: true, msg: req.__("Confirmation email sending failure, please try later"), err: err});
      }
      logger.info("Email sending OK");
      return res.json({error: false, msg: req.__("Confirmation Email sending success, please check your inbox and confirm")});
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
      if (req.isApi) {
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
  if (config.cpanel[req.params.sez]) {
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
        res.status(404).render('404', {currentUrl: req.originalUrl, user: req.user, title:req.__("404: Page not found"), titleicon:"icon-warning"});
      }
    }
  } else {
    if (view == "json") {
      res.status(404).send({ message: `API_NOT_FOUND` });
    } else {
      res.status(404).render('404', {currentUrl: req.originalUrl, user: req.user, title:req.__("404: Page not found"), titleicon:"icon-warning"});
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

    //console.log("✅ Successfully built category tree:", send);
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
  if (req.isApi) {
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
  if (req.isApi) {
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
    if (req.isApi) {
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

export default router;
