import createRouter from "../../router.js";
const router = createRouter();

import config  from 'getconfig';
import helpers from '../../../utilities/helpers.js';
import { setStatsAndActivity, setStatsAndActivitySingle } from '../../../utilities/userstats.js';

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

router.getDelete = async (req, res) => {
  logger.info("getDelete");
  logger.info(req.params.sez);
  logger.info(config.cpanel[req.params.sez].model);
  if (!config.cpanel[req.params.sez] || !req.params.id) {
    return res.status(404).send({ message: "API_NOT_FOUND" });
  }
  const id = req.params.id;
  const model = config.cpanel[req.params.sez].model;
  let data;
  try {
    data = await Models[model].findById(id).lean().exec();
    if (!data) {
      logger.info("DOC_NOT_FOUND");
      return res.status(404).send({ message: `DOC_NOT_FOUND` });
    }
    if (req.query.delete!="1") {
      logger.info("MISSING_PARAMETER");
      return res.status(404).send({ message: `MISSING_PARAMETER` });
    }
    logger.info("getDelete");
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ message: `${JSON.stringify(err)}` });
  }

  let results;
  switch (req.params.sez) {
    case "galleries" :
      results = await deleteGallery(data, res);
      break;
    case "news" :
      results = await deleteNews(data, res);
      break;
    case "videos" :
      results = await deleteVideo(data, res);
      break;
    case "performances" :
      results = await deletePerformance(data, res, req);
      break;
    case "events" :
      results = await deleteEvent(data, res);
      break;
    case "profile" :
      results = await deleteProfile(data, res);
      break;
    default :
    return res.status(400).send({ message: "Invalid section" });
  }
  if (!results) return; // If `safeExecute` already handled errors, stop execution
  return res.json(results);
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
  } catch (error) {
    logger.error(`❌ ${errorMessage}:`, error);
    if(exit && res) return res.status(500).send({ message: `${JSON.stringify(error)}` });
    return null;
  }
};

async function deleteGallery(data, res) {
  let results = {};
  results.Galleries = await safeExecute(
    Models["Gallery"].deleteOne({ _id: data._id }),
    "Error deleting Gallery",
    res,
    true
  );
  results.Performance = await safeExecute(
    Models["Performance"].updateMany( {_id: { $in: data.performances}}, { $pullAll: {galleries: [data._id] } }),
    "Error updating Performance after Gallery delete",
    res,
    false
  );
  results.Event = await safeExecute(
    Models["Event"].updateMany( {_id: { $in: data.events}}, { $pullAll: {galleries: [data._id] } }),
    "Error updating Event after Gallery delete",
    res,
    false
  );
  results.User = await safeExecute(
    Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {galleries: [data._id] } }),
    "Error updating Users after Gallery delete",
    res,
    false
  );
  results.setStatsAndActivity = await safeExecute(
    setStatsAndActivity({_id: { $in: data.users}}),
    "Error updating Users Stats",
    res,
    false
  );
  return results;
}

async function deleteNews(data, res) {
  let results = {};
  results.News = await safeExecute(
    Models["News"].deleteOne({ _id: data._id }),
    "Error deleting News",
    res,
    true
  );
  results.User = await safeExecute(
    Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {news: [data._id] } }),
    "Error updating Users after News delete",
    res,
    false
  );
  results.setStatsAndActivity = await safeExecute(
    setStatsAndActivity({_id: { $in: data.users}}),
    "Error updating Users Stats",
    res,
    false
  );
  return results;
}

async function deleteVideo(data, res) {
  let results = {};
  results.Videos = await safeExecute(
    Models["Video"].deleteOne({ _id: data._id }),
    "Error deleting Video",
    res,
    true
  );
  results.Performance = await safeExecute(
    Models["Performance"].updateMany( {_id: { $in: data.performances}}, { $pullAll: {videos: [data._id] } }),
    "Error updating Performances after Video delete",
    res,
    false
  );
  results.Event = await safeExecute(
    Models["Event"].updateMany( {_id: { $in: data.events}}, { $pullAll: {videos: [data._id] } }),
    "Error updating Events after Video delete",
    res,
    false
  );
  results.User = await safeExecute(
    Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {videos: [data._id] } }),
    "Error updating Users after Video delete",
    res,
    false
  );
  results.setStatsAndActivity = await safeExecute(
    setStatsAndActivity({_id: { $in: data.users}}),
    "Error updating Users Stats",
    res,
    false
  );
  return results;
}

async function deletePerformance(data, res, req) {
  logger.info("getDelete deletePerformance");
  logger.info(data);
  let results = {};
  if ((!data.bookings || !data.bookings.length) && (!data.galleries || !data.galleries.length) && (!data.videos || !data.videos.length)) {
    results.Performance = await safeExecute(
      Models["Performance"].deleteOne({_id: data._id}),
      "Error deleting Performance",
      res,
      true
    );
    if (!results.Performance) return;
    results.User = await safeExecute(
      Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {performances: [data._id] } }),
      "Error updating Users after Performance delete",
      res,
      false
    );
    results.setStatsAndActivity = await safeExecute(
      setStatsAndActivity({_id: { $in: data.users}}),
      "Error updating Users Stats",
      res,
      false
    );
    return results;
  } else {
    logger.info("getDelete 4");
    let errors = [];
    if (data.bookings && data.bookings.length) errors.push({error: "Performance is booked and can not be deleted", bookings: data.bookings});
    if (data.galleries && data.galleries.length) errors.push({error: "Performance owns galleries and can not be deleted", galleries: data.galleries});
    if (data.videos && data.videos.length) errors.push({error: "Performance owns videos and can not be deleted", videos: data.videos});
    return res.json(errors);
  }
}

async function deleteEvent(data, res) {
  let results = {};
  if ((!data.program || !data.program.length) && (!data.galleries || !data.galleries.length) && (!data.videos || !data.videos.length)) {
    results.Event = await safeExecute(
      Models["Event"].deleteOne({ _id: data._id }),
      "Error deleting Event",
      res,
      true
    );
    results.User = await safeExecute(
      Models["User"].updateMany( {_id: { $in: data.users}}, { $pullAll: {videos: [data._id] } }),
      "Error updating Users after Event delete",
      res,
      false
    );
    results.setStatsAndActivity = await safeExecute(
      setStatsAndActivity({_id: { $in: data.users}}),
      "Error updating Users Stats",
      res,
      false
    );
    return results;
  } else {
    logger.info("getDelete 4");
    let errors = [];
    if (data.schedule && data.schedule.length) errors.push({error:req.__("Event have a program and can not be deleted"), bookings: data.bookings});
    if (data.galleries && data.galleries.length) errors.push({error:req.__("Event own galleries and can not be deleted"), galleries: data.galleries});
    if (data.videos && data.videos.length) errors.push({error:req.__("Event own videos and can not be deleted"), videos: data.videos});
    return res.json(errors);
  }
}

async function deleteProfile(data, res) {
  let results = {};
  if (!data.activity || data.activity === 0) {
    logger.info("getDelete 3");
    if (data.is_crew == 1) {
      results.Crew = await safeExecute(
        Models["User"].deleteOne({ _id: data._id }),
        "Error deleting Crew",
        res,
        true
      );
      if (data.members && data.members.length) {
        results.User = await Models["User"].updateMany( {_id: { $in: data.members}}, { $pullAll: {crews: [data._id] } });
        results.User = await safeExecute(
          Models["User"].updateMany( {_id: { $in: data.members}}, { $pullAll: {crews: [data._id] } }),
          "Error updating Users after Event delete",
          res,
          false
        );
      }
      results.setStatsAndActivity = await safeExecute(
        setStatsAndActivity({_id: data._id}),
        "Error updating Users Stats",
        res,
        false
      );
      return results;
    } else if (data.is_crew == 0) {
      logger.info("getDelete 6");
      results.User = await safeExecute(
        Models["User"].deleteOne({ _id: data._id }),
        "Error deleting User",
        res,
        true
      );
      return results;
    }
  } else {
    logger.info("getDelete 8");
    let errors = [];
    if (data.activity != 0) errors.push({error:req.__("Performer is involved in some activities and can not be deleted"), activity: data.activity});
    res.json(errors);
  }
}

export default router;
