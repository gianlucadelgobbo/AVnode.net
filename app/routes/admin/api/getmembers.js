import createRouter from "../../router.js";
const router = createRouter();
//
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


// MEMBERS GET, ADD, REMOVE
router.getMembers = async (req, res) => {
  try {
    const users = await Models.User
    .find({$or:[
      { slug : { "$regex": req.params.q, "$options": "i" } },
      { stagename : { "$regex": req.params.q, "$options": "i" } },
      { name : { "$regex": req.params.q, "$options": "i" } },
      { surname : { "$regex": req.params.q, "$options": "i" } }
    ],is_crew: false})
    .lean()
    .select({'stagename':1})
    //.select({'_id':1, 'stagename':1, 'name':1, 'surname':1, 'email': 1})
    //.collation({locale: "en" })
    .sort({'stagename': 1})
    .exec();
    logger.info(users);
    return res.json(users);
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
  }
}

router.addMember = async (req, res) => {
  logger.info("addMember");
  var query = {_id: req.params.id};
  let crew;
  try {
    //if (req.user.is_admin) query.members = req.user._id;
    crew = await Models["User"]
    .findOne(query)
    .select({_id:1, stats:1, stagename:1, members:1})
    .populate({ "path": "members", "select": "addresses", "model": "User"})
    .exec();
    if (!crew) {
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
    } else if (crew.members.map((item)=>{return item._id.toString()}).indexOf(req.params.member)!==-1) {
      logger.info("USER_IS_ALREADY_IN");
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
  logger.info("USER_IS_ALREADY_IN");
  try {
    crew.members.push(req.params.member);
    logger.info("crew.members");
    logger.info(crew.members);
    logger.info(crew.members.length);
    crew.stats.members = crew.members.length;
    logger.info(crew);
    await crew.save()
  } catch (err) {
    logger.info("USER_01");
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  let member;
  try {
    var query = {_id: req.params.member};
    member = await Models["User"]
    .findOne(query)
    .select({_id:1, stats:1, crews:1})
    //.populate({ "path": "members", "select": "addresses", "model": "User"})
    .exec()
  } catch (err) {
    logger.info("USER_02");
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    member.crews.push(req.params.id);
    logger.info("member.crews");
    logger.info(member.crews);
    logger.info(member.crews.length);
    member.stats.crews = member.crews.length;
    await member.save();
  } catch (err) {
    logger.info("USER_03");
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  logger.info("USER_04");
  req.params.sez = 'crews';
  req.params.form = 'members';
  return dataprovider.getData(req, res, "json");
}

router.removeMember = async (req, res) => {
  var query = {_id: req.params.id};
  let crew;
  //if (req.user.is_admin) query.members = req.user._id;
  logger.info(query);
  try {
    //if (req.user.is_admin) query.members = req.user._id;
    crew = await Models["User"]
    .findOne(query)
    .select({_id:1, stagename:1, stats:1, members:1})
    .populate({ "path": "members", "select": "addresses", "model": "User"})
    .exec();
    if (!crew) {
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
    } else if (crew.members.map((item)=>{return item._id.toString()}).indexOf(req.params.member)===-1) {
      return res.status(404).send({
        "message": "MEMBER_IS_NOT_A_MEMBER",
        "name": "MongoError",
        "stringValue":"\"MEMBER_IS_NOT_A_MEMBER\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"MEMBER_IS_NOT_A_MEMBER",
          "name":"MongoError",
          "stringValue":"\"MEMBER_IS_NOT_A_MEMBER\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (crew.members.length===1) {
      return res.status(404).send({
        "message": "LEAST_ONE_MEMBER_IS_REQUIRED",
        "name": "MongoError",
        "stringValue":"\"LEAST_ONE_MEMBER_IS_REQUIRED\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"LEAST_ONE_MEMBER_IS_REQUIRED",
          "name":"MongoError",
          "stringValue":"\"LEAST_ONE_MEMBER_IS_REQUIRED\"",
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
    crew.members.splice(crew.members.map((item)=>{return item._id.toString()}).indexOf(req.params.member), 1);
    logger.info("crew.members");
    logger.info(crew.members);
    logger.info(crew.members.length);
    crew.stats.members = crew.members.length;
    await crew.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  var query = {_id: req.params.member};
  let member;
  try {
    member = await Models["User"]
    .findOne(query)
    .select({_id:1, stats:1, crews:1})
    //.populate({ "path": "members", "select": "addresses", "model": "User"})
    .exec()
    member.crews.splice(member.crews.indexOf(req.params.id), 1);
    logger.info("member.crews");
    logger.info(member.crews);
    logger.info(member.crews.length);
    member.stats.crews = member.crews.length;
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    await member.save()
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
  try {
    req.params.sez = 'crews';
    req.params.form = 'members';
    dataprovider.getData(req, res, "json");
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    return res.status(404).send({ message: err });
  }
}

export default router;
