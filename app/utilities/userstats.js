import mongoose from 'mongoose';
import { logger, requestLogger, errorLogger } from './logger.js';

const Models = {
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Program': mongoose.model('Program'),
  'Video': mongoose.model('Video'),
  'Order': mongoose.model('Order')
}

/* router.setStatsAndActivity = async (req, res) => {
  var promises = [];
  promises.push(helpers.setStatsAndActivitySingle({_id: req.params.id}));
  Promise.all(
    promises
  ).then( (resultsPromise) => {
    setTimeout(function() {
      //logger.info('resultsPromise');
      //logger.info(resultsPromise);
      //resolve(resultsPromise);
      res.json(resultsPromise);
    }, 1000);
  });
} */

const setStatsAndActivity = async function(query) {
  logger.info('setStatsAndActivity');
  logger.info(query);
  
  try {
    const users = await Models['User'].find(query).exec(); // Async/await version
    logger.info('setStatsAndActivity - Users Found:', users.length);

    // Process each user with setStatsAndActivitySingle
    const promises = users.map(user => setStatsAndActivitySingle({_id: user._id}));

    // Wait for all promises to complete
    const results = await Promise.all(promises);

    return results;
  } catch (error) {
    logger.info('Error in setStatsAndActivity:', error);
    throw error; // Ensure error propagates
  }
};
const setStatsAndActivitySingle = async function(query) {
  logger.info('setStatsAndActivitySingle');
  logger.info(query);

  try {
    const e = await Models['User'].findOne(query).exec();
    if (!e) throw new Error("User not found");

    let myids = [e._id];
    logger.info('setStatsAndActivity start', myids);

    const results = await Promise.all([
      Models['User'].find({ "members": { $in: myids } }).select("_id"),
      Models['User'].find({ "crews": { $in: myids } }).select("addresses"),
      Models['Event'].find({ "users": { $in: myids }, "is_public": true }).select("_id"),
      Models['Event'].find({ "partners.users": { $in: myids }, "is_public": true }).select("_id"),
      Models['Performance'].find({ "users": { $in: myids }, "is_public": true }).select("_id"),
      Models['Performance'].find({ "users": { $in: myids }, "is_public": true, "type": { "$nin": ["5be8708afc39610000000099", "5be8708afc396100000001a1", "5be8708afc3961000000011c"] } }).select("_id"),
      Models['Performance'].find({ "users": { $in: myids }, "is_public": true, "type": { "$in": ["5be8708afc39610000000099", "5be8708afc396100000001a1", "5be8708afc3961000000011c"] } }).select("_id"),
      Models['Gallery'].find({ "users": { $in: myids }, "is_public": true }).select("_id"),
      Models['Video'].find({ "users": { $in: myids }, "is_public": true }).select("_id"),
      Models['News'].find({ "users": { $in: myids }, "is_public": true }).select("_id"),
      Models['Footage'].find({ "users": { $in: myids }, "is_public": true }).select("_id"),
      Models['Playlist'].find({ "users": { $in: myids }, "is_public": true }).select("_id"),

      // ✅ Fix countDocuments() calls
      Models['Performance'].countDocuments({ "users": { $in: myids }, "is_public": true, "type": "5be8708afc39610000000017" }),
      Models['Performance'].countDocuments({ "users": { $in: myids }, "is_public": true, "type": "5be8708afc39610000000016" }),
      Models['Performance'].countDocuments({ "users": { $in: myids }, "is_public": true, "type": "5be8708afc39610000000014" }),
      Models['Performance'].countDocuments({ "users": { $in: myids }, "is_public": true, "type": "5be8708afc39610000000099" }),
      Models['Performance'].countDocuments({ "users": { $in: myids }, "is_public": true, "type": "5be8708afc3961000000011b" }),
      Models['Performance'].countDocuments({ "users": { $in: myids }, "is_public": true, "type": "5be8708afc3961000000011c" }),
      Models['Performance'].countDocuments({ "users": { $in: myids }, "is_public": true, "type": "5be8708afc3961000000011d" }),
      Models['Performance'].countDocuments({ "users": { $in: myids }, "is_public": true, "type": "5be8708afc3961000000019f" }),
      Models['Performance'].countDocuments({ "users": { $in: myids }, "is_public": true, "type": "5be8708afc396100000001a1" }),

      Models['Event'].countDocuments({ "users": { $in: myids }, "is_public": true, createdAt: { "$gte": new Date(new Date().getTime() - (365 * 3 * 24 * 60 * 60 * 1000)) } }),
      Models['Event'].countDocuments({ "partners.users": { $in: myids }, "is_public": true, createdAt: { "$gte": new Date(new Date().getTime() - (365 * 3 * 24 * 60 * 60 * 1000)) } }),
      Models['Performance'].countDocuments({ "users": { $in: myids }, "is_public": true, "type": { "$nin": ["5be8708afc39610000000099", "5be8708afc396100000001a1", "5be8708afc3961000000011c"] }, createdAt: { "$gte": new Date(new Date().getTime() - (365 * 3 * 24 * 60 * 60 * 1000)) } }),
      Models['Performance'].countDocuments({ "users": { $in: myids }, "is_public": true, "type": { "$in": ["5be8708afc39610000000099", "5be8708afc396100000001a1", "5be8708afc3961000000011c"] }, createdAt: { "$gte": new Date(new Date().getTime() - (365 * 3 * 24 * 60 * 60 * 1000)) } }),
      Models['Gallery'].countDocuments({ "users": { $in: myids }, "is_public": true, createdAt: { "$gte": new Date(new Date().getTime() - (365 * 3 * 24 * 60 * 60 * 1000)) } }),
      Models['Video'].countDocuments({ "users": { $in: myids }, "is_public": true, createdAt: { "$gte": new Date(new Date().getTime() - (365 * 3 * 24 * 60 * 60 * 1000)) } }),
      Models['News'].countDocuments({ "users": { $in: myids }, "is_public": true, createdAt: { "$gte": new Date(new Date().getTime() - (365 * 3 * 24 * 60 * 60 * 1000)) } }),
      Models['Footage'].countDocuments({ "users": { $in: myids }, "is_public": true, createdAt: { "$gte": new Date(new Date().getTime() - (365 * 3 * 24 * 60 * 60 * 1000)) } }),
      Models['Playlist'].countDocuments({ "users": { $in: myids }, "is_public": true, createdAt: { "$gte": new Date(new Date().getTime() - (365 * 3 * 24 * 60 * 60 * 1000)) } }),
    ]);

    const [
      crews, members, events, partnerships, performances,
      performances_only, learnings, galleries, videos, news, footage, playlists,
      lightsinstallation, mapping, vjset, workshop, avperformance,
      projectshowcase, djset, videoinstallation, lecture,
      recent_events, recent_partnerships, recent_performances, recent_learnings,
      recent_galleries, recent_videos, recent_news, recent_footage, recent_playlists
    ] = results;

    // ✅ You can now safely use these counts
    logger.info({ lightsinstallation, mapping, vjset, workshop });

    return {
      events,
      performances,
      lightsinstallation,
      mapping,
      vjset,
      workshop,
      recent_events,
      recent_performances
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export { setStatsAndActivity, setStatsAndActivitySingle };