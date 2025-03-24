import createRouter from "../../router.js";
const router = createRouter();

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

// PERFORMANCES GET, ADD, REMOVE
router.getPerformances = async (req, res) => {
  try {
    const performances = await Models.Performance
    .find({$or:[
      { slug : { "$regex": req.params.q, "$options": "i" } },
      { title : { "$regex": req.params.q, "$options": "i" } }
    ]})
    .lean()
    .select({'title':1})
    .sort({'title': 1})
    .exec();
    res.json(performances);    
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
  }
}

router.eventAddPerformance = async (req, res) => {
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  var query = {_id: req.params.id};
  let event;
  try {
    event = await Models['Event']
    .findOne(query)
    .select({_id:1, title:1, stats:1, program:1})
    //.populate({ "path": "users", "select": "stagename", "model": "User"})
    .exec();
    if (!event) {
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
    } else if (event.program.map((item)=>{return item.performance.toString()}).indexOf(req.params.performance)!==-1) {
      logger.info(`stocazzo`);
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
    }
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });  
  }
  let pp;
  query = {performance: req.params.performance, event: req.params.id};
  try {
    pp = await Models["Program"]
    .find(query)
    .exec()
    logger.info(pp);
    if (pp.length) {
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
    }
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });  
  }
  var programnew = {};
  programnew.performance = req.params.performance;
  programnew.reference = req.user._id;
  programnew.event = req.params.id;
  programnew.status = "5be8708afc39610000000013";
  let program;
  try {
    program = await Models["Program"]
    .create(programnew);
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    program = await Models["Program"]
    .findOne(query)
    .exec()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    event.program.push({performance:req.params.performance, subscription_id:program._id});
    await event.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  var query = {_id: req.params.performance};
  var select = {_id:1, bookings:1}
  let performance;
  try {
    performance = await Models["Performance"]
    .findOne(query)
    .select(select)
    //.populate({ "path": "members", "select": "addresses", "model": "User"})
    .exec()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    performance.bookings.push({event:req.params.id, subscription_id:program._id});
    await performance.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  req.params.sez = 'events';
  req.params.form = 'program';
  return dataprovider.getData(req, res, "json");
}

router.eventRemovePerformance = async (req, res) => {
  logger.info("eventRemovePerformance");
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  let item;
  let error;
  let errs = []
  try {
    item = await Models['Event']
    .findOne(query)
    .select({_id:1, program:1,})
    //.populate({ "path": "users", "select": "stagename", "model": "User"})
    .exec();
    if (!item) {
      error = {
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
      };
    } else if (item.program.map((item)=>{return item.performance.toString()}).indexOf(req.params.performance)===-1) {
      logger.info(`stocazzo`);
      logger.info(item);
      logger.info(item.program.map((item)=>{return item.performance.toString()}));
      error = {
        "message": "PERFORMANCE_IS_NOT_IN",
        "name": "MongoError",
        "stringValue":"\"PERFORMANCE_IS_NOT_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"PERFORMANCE_IS_NOT_IN",
          "name":"MongoError",
          "stringValue":"\"PERFORMANCE_IS_NOT_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      };
    }
    try {
      item.program.splice(item.program.map((item)=>{return item.performance.toString()}).indexOf(req.params.performance), 1);
      //return res.json(item);
      await item.save()
    } catch (err) {
      logger.info("eventRemovePerformance 2");
      logger.info(`${JSON.stringify(err)}`);
      errs.push.send({ message: err }); 
    }
  } catch (err) {
    logger.info("eventRemovePerformance 1");
    logger.info(`${JSON.stringify(err)}`);
    errs.push.send({ message: err }); 
  }

  var query = {_id: req.params.performance};
  var select = {_id:1, bookings:1}
  //select[req.params.sez] = 1;
  let performance;
  try {
    performance = await Models["Performance"]
    .findOne(query)
    .select(select)
    //.populate({ "path": "members", "select": "addresses", "model": "User"})
    .exec()
    try {
      performance.bookings.splice(performance.bookings.map((item)=>{return item.event.toString()}).indexOf(req.params.id), 1);
      await performance.save()
    } catch (err) {
      logger.info("eventRemovePerformance 4");
      logger.info(`${JSON.stringify(err)}`);
      errs.push.send({ message: err }); 
    }
  } catch (err) {
    logger.info("eventRemovePerformance 3");
    logger.info(`${JSON.stringify(err)}`);
    errs.push.send({ message: err }); 
  }
  let program
  try {
    query = {performance: req.params.performance, event: req.params.id};
    program = await Models["Program"]
    .findOneAndDelete(query)
  } catch (err) {
    logger.info("eventRemovePerformance 5");
    logger.info(`${JSON.stringify(err)}`);
    errs.push.send({ message: err }); 
    return res.status(404).send({ message: err });
  }
  if (errs) {
    logger.info("eventRemovePerformance errs");
    logger.info(`${JSON.stringify(errs)}`);
  }
  if (error) {
    return res.status(404).send(error);
  } else {
    req.params.sez = 'events';
    req.params.form = 'program';
    return dataprovider.getData(req, res, "json");            
  }
}

export default router;
