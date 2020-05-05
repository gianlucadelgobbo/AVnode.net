const router = require('../../router')();
let config = require('getconfig');
let slugify = require('slugify');

const mongoose = require('mongoose');
const Models = {
  'Category': mongoose.model('Category'),
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Video': mongoose.model('Video'),
  'VenueDB': mongoose.model('VenueDB'),
  'AddressDB': mongoose.model('AddressDB')
}
const logger = require('../../../utilities/logger');

router.setStatsAndActivity = function(query) {
  logger.debug('setStatsAndActivity');
  logger.debug(query);
  return new Promise(function (resolve, reject) {
    //let query = JSON.parse('{"q": '+req.body.q+'}').q;
    Models['User'].
    find(query).
    exec((err, e) => {
      logger.debug('setStatsAndActivity');
      logger.debug(query);
      logger.debug(e.length);
      var promises = [];
      for (var item=0; item<e.length; item++) promises.push(router.setStatsAndActivitySingle({_id: e[item]._id}));
      Promise.all(
        promises
      ).then( (resultsPromise) => {
        setTimeout(function() {
          logger.debug('resultsPromise');
          logger.debug(resultsPromise);
          resolve(resultsPromise);
        }, 1000);
      });

    });
  });
}

router.setStatsAndActivitySingle = function(query) {
  logger.debug('setStatsAndActivitySingle');
  logger.debug(query);
  return new Promise(function (resolve, reject) {
    //let query = JSON.parse('{"q": '+req.body.q+'}').q;
    Models['User'].
    findOne(query).
    exec((err, e) => {
      var myids = [e._id];
      logger.debug('setStatsAndActivity start');
      logger.debug(myids);
      Promise.all([
        Models['User'].find({"members": {$in: myids}/* , "is_public": true */}).select("_id"),
        Models['User'].find({"crews": {$in: myids}/* , "is_public": true */}).select("_id"),
        Models['Event'].find({"users": {$in: myids}, "is_public": true}).select("_id"),
        Models['Event'].find({"partners.users": {$in: myids}, "is_public": true}).select("_id"),
        Models['Performance'].find({"users": {$in: myids}, "is_public": true}).select("_id"),
        Models['Performance'].find({"users": {$in: myids}, "is_public": true, "type": {"$nin":["5be8708afc39610000000099", "5be8708afc396100000001a1", "5be8708afc3961000000011c"]}}).select("_id"),
        Models['Performance'].find({"users": {$in: myids}, "is_public": true, "type": {"$in":["5be8708afc39610000000099", "5be8708afc396100000001a1", "5be8708afc3961000000011c"]}}).select("_id"),
        Models['Gallery'].find({"users": {$in: myids}, "is_public": true}).select("_id"),
        Models['Video'].find({"users": {$in: myids}, "is_public": true}).select("_id"),
        Models['News'].find({"users": {$in: myids}, "is_public": true}).select("_id"),
        Models['Footage'].find({"users": {$in: myids}, "is_public": true}).select("_id"),
        Models['Playlist'].find({"users": {$in: myids}, "is_public": true}).select("_id"),

        Models['Performance'].countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc39610000000017"}), // lightsinstallation
        Models['Performance'].countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc39610000000016"}), // mapping
        Models['Performance'].countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc39610000000014"}), // vjset
        Models['Performance'].countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc39610000000099"}), // workshop
        Models['Performance'].countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc3961000000011b"}), // avperformance
        Models['Performance'].countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc3961000000011c"}), // projectshowcase
        Models['Performance'].countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc3961000000011d"}), // djset
        Models['Performance'].countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc3961000000019f"}), // videoinstallation
        Models['Performance'].countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc396100000001a1"}), // lecture

        Models['Event'].countDocuments({"users": {$in: myids}, "is_public": true, createdAt:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Models['Event'].countDocuments({"partners.users": {$in: myids}, "is_public": true, createdAt:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Models['Performance'].countDocuments({"users": {$in: myids}, "is_public": true, "type": {"$nin":["5be8708afc39610000000099", "5be8708afc396100000001a1", "5be8708afc3961000000011c"]}, createdAt:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Models['Performance'].countDocuments({"users": {$in: myids}, "is_public": true, "type": {"$in":["5be8708afc39610000000099", "5be8708afc396100000001a1", "5be8708afc3961000000011c"]}, createdAt:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Models['Gallery'].countDocuments({"users": {$in: myids}, "is_public": true, createdAt:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Models['Video'].countDocuments({"users": {$in: myids}, "is_public": true, createdAt:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Models['News'].countDocuments({"users": {$in: myids}, "is_public": true, createdAt:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Models['Footage'].countDocuments({"users": {$in: myids}, "is_public": true, createdAt:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Models['Playlist'].countDocuments({"users": {$in: myids}, "is_public": true, createdAt:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}})

      ]).then( ([
        crews,
        members,
        events,
        partnerships,
        performances,
        performances_only,
        learnings,
        galleries,
        videos,
        news,
        footage,
        playlists,

        lightsinstallation,
        mapping,
        vjset,
        workshop,
        avperformance,
        projectshowcase,
        djset,
        videoinstallation,
        lecture,

        recent_events,
        recent_partnerships,
        recent_performances,
        recent_learnings,
        recent_galleries,
        recent_videos,
        recent_news,
        recent_footage,
        recent_playlists
      ]) => {
        if (e.members) e.members = members;
        if (e.crews) e.crews = crews;
        e.events = events;
        e.performances = performances;
        e.performances_only = performances_only;
        e.learnings = learnings;
        e.partnerships = partnerships;
        e.galleries = galleries;
        e.videos = videos;
        e.news = news;
        e.footage = footage;
        e.playlists = playlists;

        e.stats = {};
        if (e.members && e.members.length) e.stats.members = e.members.length;
        if (e.crews && e.crews.length) e.stats.crews = e.crews.length;
    
        if (e.performances_only && e.performances_only.length) e.stats.performances = e.performances_only.length;
        if (e.learnings && e.learnings.length) e.stats.learnings = e.learnings.length;
        if (e.events && e.events.length) e.stats.events = e.events.length;
        if (e.partnerships && e.partnerships.length) e.stats.partnerships = e.partnerships.length;
        if (e.footage && e.footage.length) e.stats.footage = e.footage.length;
        if (e.playlists && e.playlists.length) e.stats.playlists = e.playlists.length;
        if (e.videos && e.videos.length) e.stats.videos = e.videos.length;
        if (e.galleries && e.galleries.length) e.stats.galleries = e.galleries.length;
        if (e.news && e.news.length) e.stats.news = e.news.length;

        e.stats["lights-installation"] = lightsinstallation;
        e.stats["mapping"] = mapping;
        e.stats["vj-set"] = vjset;
        e.stats["workshop"] = workshop;
        e.stats["av-performance"] = avperformance;
        e.stats["project-showcase"] = projectshowcase;
        e.stats["dj-set"] = djset;
        e.stats["video-installation"] = videoinstallation;
        e.stats["lecture"] = lecture;

        e.stats.recent = {};
        e.stats.recent.events = recent_events;
        e.stats.recent.partnerships = recent_partnerships;
        e.stats.recent.performances = recent_performances;
        e.stats.recent.learnings = recent_learnings;
        e.stats.recent.galleries = recent_galleries;
        e.stats.recent.videos = recent_videos;
        e.stats.recent.news = recent_news;
        e.stats.recent.footage = recent_footage;
        e.stats.recent.playlists = recent_playlists;

        e.activity = router.getActivity(e.stats);
        e.activity_as_performer = router.getActivityAsPerformer(e.stats);
        e.activity_as_organization = router.getActivityAsOrganization(e.stats);

        delete e.performances_only;
        delete e.learnings;

        logger.debug(e);
        e.save((err) => {
          if (err) {
            setTimeout(function() {
              resolve(err);
            }, 1000);
          } else {
            setTimeout(function() {
              resolve(e.stats);
            }, 1000);
          }
        });
      });
    });
  });
}


router.mySlugify = function (model, str, cb) {
  if (str) {
    slugify.extend({'|': ' '})
    slugify.extend({'+': 'and'})
    slugify.extend({'@': 'at'})
    slugify.extend({'†': ''})
    /* slugify.extend({'\\': ''})
    slugify.extend({"‘": "'"})
    slugify.extend({"’": "'"})
    slugify.extend({"“": "\\\""})
    slugify.extend({"”": "\\\""})
    slugify.extend({"†": "-"})
    slugify.extend({"•": "-"})
    slugify.extend({"…": "..."}) */
  
    let slug = slugify(str, {
      replacement: '-',  // replace spaces with replacement character, defaults to `-`
      remove: /[*~.()[\]{\\}'‘’"“”…!:/]/g, // remove characters that match regex, defaults to `undefined`
      lower: true,      // convert to lower case, defaults to `false`
      strict: false,     // strip special characters except replacement, defaults to `false`
    }).replace(/[^a-z0-9 -]/g, "");
    model.countDocuments({slug: slug}, function (err, count) {
      if (count) {
        router.mySlugify(model, slug+"_1", cb);
      } else {
        cb(slug);
      }
    });
  } else {
    cb(str);
  }
}

router.editable = function(req, data, id) {
  if (!req.user) {
    return false;
  } else {
    let meandcrews = req.user.crews && req.user.crews.length ? req.user.crews.map((item)=>{return item.toString()}) : [];
    meandcrews.push(req.user._id.toString());
    const editable = (req.user.is_admin || req.user.crews.indexOf(id)!==-1 || id == req.user._id || (data.users && data.users.map((item)=>{return item._id.toString()}).some(v=> meandcrews.indexOf(v) !== -1)));
    logger.debug('editable');
    logger.debug(editable);
    /* logger.debug(id);
    logger.debug(data);
    if (data.users) logger.debug(data.users.map((item)=>{return item._id.toString()}));
    logger.debug(meandcrews);
    logger.debug((data.users && data.users.map((item)=>{return item._id.toString()}).some(v=> meandcrews.indexOf(v) !== -1)));
     */return editable;
  }
}

router.getActivity = (stats) => {
  let activity = 0;
  activity+= (stats.performances ? stats.performances * 100 : 0);
  activity+= (stats.learnings ? stats.learnings       * 100 : 0);
  activity+= (stats.events ? stats.events             * 50 : 0);
  //activity+= (stats.footage ? stats.footage           * 1 : 0);
  //activity+= (stats.playlists ? stats.playlists       * 2 : 0);
  activity+= (stats.videos ? stats.videos             * 3 : 0);
  activity+= (stats.galleries ? stats.galleries       * 1 : 0);
  activity+= (stats.news ? stats.news                 * 1 : 0);
  if (activity > 0) activity+= (stats.partnerships ? stats.partnerships * 5 : 0);

  // AMPLIFY FOR RECENT ACTIVITIES
  activity+= (stats.recent.performances ? stats.recent.performances * 1000 : 0);
  activity+= (stats.recent.learnings ? stats.recent.learnings       * 1000 : 0);
  activity+= (stats.recent.events ? stats.recent.events             * 500 : 0);
  //activity+= (stats.recent.footage ? stats.recent.footage           * 10 : 0);
  //activity+= (stats.recent.playlists ? stats.recent.playlists       * 20 : 0);
  activity+= (stats.recent.videos ? stats.recent.videos             * 30 : 0);
  activity+= (stats.recent.galleries ? stats.recent.galleries       * 10 : 0);
  activity+= (stats.recent.news ? stats.recent.news                 * 10 : 0);
  if (activity > 0) activity+= (stats.recent.partnerships ? stats.recent.partnerships * 50 : 0);

  return activity;
}

router.getActivityAsPerformer = (stats) => {
  let activity_as_performer = 0;
  activity_as_performer+= (stats.performances ? stats.performances * 100 : 0);
  activity_as_performer+= (stats.learnings ? stats.learnings       * 100 : 0);
  //activity_as_performer+= (stats.footage ? stats.footage           * 1 : 0);
  //activity_as_performer+= (stats.playlists ? stats.playlists       * 1 : 0);

  activity_as_performer+= (stats.recent.performances ? stats.recent.performances * 1000 : 0);
  activity_as_performer+= (stats.recent.learnings ? stats.recent.learnings * 1000 : 0);
  //activity_as_performer+= (stats.recent.footage ? stats.recent.footage           * 10 : 0);
  //activity_as_performer+= (stats.recent.playlists ? stats.recent.playlists       * 10 : 0);
  return activity_as_performer;
}

router.getActivityAsOrganization = (stats) => {
  let activity_as_organization = 0;
  activity_as_organization+= (stats.events ? stats.events             * 10 : 0);
  if (activity_as_organization > 0) activity_as_organization+= (stats.videos ? stats.videos             * 1 : 0);
  if (activity_as_organization > 0) activity_as_organization+= (stats.galleries ? stats.galleries       * 1 : 0);
  if (activity_as_organization > 0) activity_as_organization+= (stats.news ? stats.news                 * 1 : 0);
  if (activity_as_organization > 0) activity_as_organization+= (stats.partnerships ? stats.partnerships * 1 : 0);

  activity_as_organization+= (stats.recent.events ? stats.recent.events             * 100 : 0);
  if (activity_as_organization > 0) activity_as_organization+= (stats.recent.videos ? stats.recent.videos             * 10 : 0);
  if (activity_as_organization > 0) activity_as_organization+= (stats.recent.galleries ? stats.recent.galleries       * 10 : 0);
  if (activity_as_organization > 0) activity_as_organization+= (stats.recent.news ? stats.recent.news                 * 10 : 0);
  if (activity_as_organization > 0) activity_as_organization+= (stats.recent.partnerships ? stats.recent.partnerships * 10 : 0);

  return activity_as_organization;
}



module.exports = router;
