import createRouter from "../../router.js";
const router = createRouter();
//
import config  from 'getconfig';
import { setStatsAndActivity, setStatsAndActivitySingle } from '../../../utilities/userstats.js';
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

// AUTHORS GET, ADD, REMOVE
router.getUsers = async (req, res) => {
  var find = {$or:[
    { slug : { "$regex": req.params.q, "$options": "i" } },
    { stagename : { "$regex": req.params.q, "$options": "i" } },
    { name : { "$regex": req.params.q, "$options": "i" } },
    { surname : { "$regex": req.params.q, "$options": "i" } }
  ]};
  if (req.query.is_crew) find.is_crew = true;
  try {
    const users = await Models.User
    .find(find)
    .lean()
    .select({'stagename':1})
    .sort({'stagename': 1})
    .exec();
    res.json(users);    
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
  }
}

router.addUser = async (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  let item;
  try {
    //if (req.user.is_admin) query.members = req.user._id;
    item = await Models[config.cpanel[req.params.sez].model]
    .findOne(query)
    .select({_id:1, stagename:1, stats:1, users:1})
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
    } else if (item.users.indexOf(req.params.user)!==-1) {
      return res.status(404).send({
        "message": "USER_IS_ALREADY_IN",
        "name": "MongoError",
        "stringValue":"\"USER_IS_ALREADY_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_IS_ALREADY_IN",
          "name":"MongoError",
          "stringValue":"\"USER_IS_ALREADY_IN\"",
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
    item.users.push(req.params.user);
    await item.save();
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  let user;
  try {
    var query = {_id: req.params.user};
    var select = {_id:1, stats:1, crews:1}
    select[req.params.sez] = 1;
    user = await Models["User"]
    .findOne(query)
    .select(select)
    //.populate({ "path": "members", "select": "addresses", "model": "User"})
    .exec()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    user[req.params.sez].push(req.params.id);
    await user.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  await setStatsAndActivity(query);

  req.params.form = 'public';
  return dataprovider.getData(req, res, "json");
}

router.removeUser = async (req, res) => {
  var query = {_id: req.params.id};
  //if (req.user.is_admin) query.users = {$in: [req.user._id].concat(req.user.crews)};
  let item;
  try {
    item = await Models[config.cpanel[req.params.sez].model]
    .findOne(query)
    .select({_id:1, stagename:1, stats:1, users:1,})
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
    } else if (item.users.indexOf(req.params.user)===-1) {
      return res.status(404).send({
        "message": "USER_IS_NOT_IN",
        "name": "MongoError",
        "stringValue":"\"USER_IS_NOT_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_IS_NOT_IN",
          "name":"MongoError",
          "stringValue":"\"USER_IS_NOT_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (item.users.length===1) {
      return res.status(404).send({
        "message": "LEAST_ONE_AUTHOR_IS_REQUIRED",
        "name": "MongoError",
        "stringValue":"\"LEAST_ONE_AUTHOR_IS_REQUIRED\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"LEAST_ONE_AUTHOR_IS_REQUIRED",
          "name":"MongoError",
          "stringValue":"\"LEAST_ONE_AUTHOR_IS_REQUIRED\"",
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
    item.users.splice(item.users.indexOf(req.params.user), 1);
    //return res.json(item);
    await item.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  let user;
  var query = {_id: req.params.user};
  var select = {_id:1, stats:1, crews:1}
  select[req.params.sez] = 1;
  try {
    user = await Models["User"]
    .findOne(query)
    .select(select)
    //.populate({ "path": "members", "select": "addresses", "model": "User"})
    .exec()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    user[req.params.sez].splice(user[req.params.sez].indexOf(req.params.id), 1);
    await user.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  await setStatsAndActivity(query)
  req.params.form = 'public';
  return dataprovider.getData(req, res, "json");
}

export default router;
