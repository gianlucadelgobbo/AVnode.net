import createRouter from "../../router.js";
const router = createRouter();

import dataprovider from "../../../utilities/dataprovider.js";

import mongoose from 'mongoose';
const Models = {
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'Video': mongoose.model('Video')
}
import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';

// VIDEOS GET, ADD, REMOVE
router.getVideos = async (req, res) => {
  var select, find;
  if (req.query.vjtv) {
    find = {"categories.0":{$exists:true},"media.externalurl":{$exists:false},"media.duration": {$gt:60000}, "media.encoded": 1, $or:[
      { slug : { "$regex": req.params.q, "$options": "i" } },
      { title : { "$regex": req.params.q, "$options": "i" } }
    ]};
    select = {'title':1, 'slug':1, "categories": 1,"media.duration": 1}
  } else {
    find = {$or:[
      { slug : { "$regex": req.params.q, "$options": "i" } },
      { title : { "$regex": req.params.q, "$options": "i" } }
    ]};
    select = {'title':1}
  }
  try {
    const video = await Models.Video
    .find(find)
    .lean()
    .select(select)
    .sort({'title': 1})
    .exec();
    return res.json(video);    
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
  }
}

router.addVideo = async (req, res) => {
  logger.info("addVideo");
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  if (req.params.sez == "events" || req.params.sez == "performances") {
    let model = req.params.sez == "events" ? Models['Event'] : Models['Performance'];
    let item;
    try {
      item = await model
      .findOne(query)
      .select({_id:1, title:1, stats:1, videos:1})
      //.populate({ "path": "users", "select": "stagename", "model": "User"})
      .exec();
      if (!item) {
        return res.status(404).send({
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
      } else if (item.videos.map((item)=>{return item.toString()}).indexOf(req.params.video)!==-1) {
        return res.status(404).send({
          "message": "VIDEO_IS_ALREADY_IN",
          "name": "MongoError",
          "stringValue":"\"VIDEO_IS_ALREADY_IN\"",
          "kind":"Date",
          "value":null,
          "path":"id",
          "reason":{
            "message":"VIDEO_IS_ALREADY_IN",
            "name":"MongoError",
            "stringValue":"\"VIDEO_IS_ALREADY_IN\"",
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
      logger.info("addVideo");
      logger.info(item);
      item.videos.push(req.params.video);
      await item.save()
    } catch (err) {
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });      
    }
    var query = {_id: req.params.video};
    var select = {_id:1}
    select[req.params.sez] = 1
    let video;
    try {
      video = await Models["Video"]
      .findOne(query)
      .select(select)
      //.populate({ "path": "members", "select": "addresses", "model": "User"})
      .exec()
    } catch (err) {
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });      
    }
    try {
      if (!video[req.params.sez]) video[req.params.sez] = [];
      video[req.params.sez].push(req.params.id);
      await video.save()
    } catch (err) {
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });
    }
    req.params.form = 'videos';
    return dataprovider.getData(req, res, "json");            
  } else {
    return res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

router.removeVideo = async (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  let model;
  if (req.params.sez == "events" || req.params.sez == "performances") {
    model = req.params.sez == "events" ? Models['Event'] : Models['Performance'];
  } else {
    return res.status(404).send({ message: `API_NOT_FOUND` });
  }
  logger.info(model);
  let item
  try {
    item = await model
    .findOne(query)
    .select({_id:1, videos:1})
    //.populate({ "path": "users", "select": "stagename", "model": "User"})
    .exec();
    logger.info(req.params.video)
    logger.info(item.videos)
    if (!item) {
      return res.status(404).send({
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
    } else if (item.videos.map((item)=>{return item.toString()}).indexOf(req.params.video)===-1) {
      return res.status(404).send({
        "message": "VIDEO_IS_NOT_IN",
        "name": "MongoError",
        "stringValue":"\"VIDEO_IS_NOT_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"VIDEO_IS_NOT_IN",
          "name":"MongoError",
          "stringValue":"\"VIDEO_IS_NOT_IN\"",
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
    item.videos.splice(item.videos.map((item)=>{return item.toString()}).indexOf(req.params.video), 1);
    //return res.json(item);
    await item.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  var query = {_id: req.params.video};
  var select = {_id:1, events:1}
  //select[req.params.sez] = 1;
  let video;
  try {
    video = await Models["Video"]
    .findOne(query)
    .select(select)
    //.populate({ "path": "members", "select": "addresses", "model": "User"})
    .exec()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    video.events.splice(video.events.map((item)=>{return item.toString()}).indexOf(req.params.id), 1);
    await video.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  //req.params.sez = 'events';
  req.params.form = 'videos';
  return dataprovider.getData(req, res, "json");            
}

export default router;
