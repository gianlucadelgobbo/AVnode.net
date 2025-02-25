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
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Video': mongoose.model('Video'),
  'Program': mongoose.model('Program'),
  'Emailqueue': mongoose.model('Emailqueue')
}
import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';

// GALLERIES GET, ADD, REMOVE
router.getGalleries = async (req, res) => {
  try {
    const galleries = await Models.Gallery
    .find({$or:[
      { slug : { "$regex": req.params.q, "$options": "i" } },
      { title : { "$regex": req.params.q, "$options": "i" } }
    ]})
    .lean()
    .select({'title':1})
    .sort({'title': 1})
    .exec();
    res.json(galleries);    
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
  }
}

router.addGallery = async (req, res) => {
  logger.info("addGallery");
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  if (req.params.sez == "events" || req.params.sez == "performances") {
    let model = req.params.sez == "events" ? Models['Event'] : Models['Performance'];
    let item;
    try {
      item = await model
      .findOne(query)
      .select({_id:1, title:1, stats:1, galleries:1})
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
      } else if (item.galleries.map((item)=>{return item.toString()}).indexOf(req.params.gallery)!==-1) {
        return res.status(404).send({
          "message": "GALLERY_IS_ALREADY_IN",
          "name": "MongoError",
          "stringValue":"\"GALLERY_IS_ALREADY_IN\"",
          "kind":"Date",
          "value":null,
          "path":"id",
          "reason":{
            "message":"GALLERY_IS_ALREADY_IN",
            "name":"MongoError",
            "stringValue":"\"GALLERY_IS_ALREADY_IN\"",
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
      item.galleries.push(req.params.gallery);
      await item.save();
    } catch (err) {
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });
    }
    let gallery;
    try {
      var query = {_id: req.params.gallery};
      var select = {_id:1}
      select[req.params.sez] = 1
      gallery = await Models["Gallery"]
      .findOne(query)
      .select(select)
      //.populate({ "path": "members", "select": "addresses", "model": "User"})
      .exec()
    } catch (err) {
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });      
    }
    try {
      if (!gallery[req.params.sez]) gallery[req.params.sez] = [];
      gallery[req.params.sez].push(req.params.id);
      await gallery.save()
    } catch (err) {
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });
    }
    req.params.form = 'galleries';
    dataprovider.getData(req, res, "json");            
  } else {
    return res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

router.removeGallery = async (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  if (req.params.sez == "events" || req.params.sez == "performances") {
    let model = req.params.sez == "events" ? Models['Event'] : Models['Performance'];
    let item
    try {
      item = await model
      .findOne(query)
      .select({_id:1, galleries:1,})
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
      } else if (item.galleries.map((item)=>{return item.toString()}).indexOf(req.params.gallery)===-1) {
        return res.status(404).send({
          "message": "GALLERY_IS_NOT_IN",
          "name": "MongoError",
          "stringValue":"\"GALLERY_IS_NOT_IN\"",
          "kind":"Date",
          "value":null,
          "path":"id",
          "reason":{
            "message":"GALLERY_IS_NOT_IN",
            "name":"MongoError",
            "stringValue":"\"GALLERY_IS_NOT_IN\"",
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
      item.galleries.splice(item.galleries.map((item)=>{return item.toString()}).indexOf(req.params.gallery), 1);
      //res.json(item);
      await item.save()
    } catch (err) {
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });
    }
    var query = {_id: req.params.gallery};
    var select = {_id:1, events:1}
    let gallery;
    //select[req.params.sez] = 1;
    try {
      gallery = await Models["Gallery"]
      .findOne(query)
      .select(select)
      //.populate({ "path": "members", "select": "addresses", "model": "User"})
      .exec()
    } catch (err) {
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });
    }          
    try {
      gallery.events.splice(gallery.events.map((item)=>{return item.toString()}).indexOf(req.params.id), 1);
      await gallery.save()
    } catch (err) {
      logger.info(`${JSON.stringify(err)}`);
      return res.status(404).send({ message: err });      
    }  
    req.params.form = 'galleries';
    return dataprovider.getData(req, res, "json");            
  } else {
    return res.status(404).send({ message: `API_NOT_FOUND` });
  }
}

export default router;
