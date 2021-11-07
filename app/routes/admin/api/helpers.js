const router = require('../../router')();
let config = require('getconfig');
let slugify = require('slugify');
let oembed = require('oembed-parser');

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

router.getCountries = (req, res) => {
  const allCountries = require('countries-list');
  let convert = [];
  for (var item in allCountries.countries) {
    convert.push( {"value": item, "label": allCountries.countries[item].name})
  }
  convert.sort((a,b)=>{
    if ( a.label < b.label ){
      return -1;
    }
    if ( a.label > b.label ){
      return 1;
    }
    return 0;
  });
  return convert;
}

router.getLanguages = (req, res) => {
  const allLanguages = require('countries-list');
  let convert = [];
  for (var item in allLanguages.languages) {
    convert.push( {"value": item, "label": allLanguages.languages[item].name})
  }
  convert.sort((a,b)=>{
    if ( a.label < b.label ){
      return -1;
    }
    if ( a.label > b.label ){
      return 1;
    }
    return 0;
  });
  return convert;
}

router.setStatsAndActivity = function(query) {
  logger.debug('setStatsAndActivity');
  //logger.debug(query);
  return new Promise(function (resolve, reject) {
    //let query = JSON.parse('{"q": '+req.body.q+'}').q;
    Models['User'].
    find(query).
    exec((err, e) => {
      logger.debug('setStatsAndActivity');
      //logger.debug(query);
      //logger.debug(e.length);
      var promises = [];
      for (var item=0; item<e.length; item++) promises.push(router.setStatsAndActivitySingle({_id: e[item]._id}));
      Promise.all(
        promises
      ).then( (resultsPromise) => {
        setTimeout(function() {
          //logger.debug('resultsPromise');
          //logger.debug(resultsPromise);
          resolve(resultsPromise);
        }, 1000);
      });

    });
  });
}

router.getServerpath = storage => {
  // Set Folder and create if do not exist
  const d = new Date();
  let month = d.getMonth() + 1;
  let serverpath = `${global.appRoot}${storage}${d.getFullYear()}/`;
  month = month < 10 ? "0" + month : month;
  if (!fs.existsSync(serverpath)) fs.mkdirSync(serverpath);
  serverpath += month;
  if (!fs.existsSync(serverpath)) fs.mkdirSync(serverpath);
  return serverpath;
};

var http = require('http');
var https = require('https');
var fs = require('fs');

router.download = (url, dest, cb) => {
  var file = fs.createWriteStream(dest);
  var h = url.indexOf("https")===0 ? https : http;
  h.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

router.myTrim = (str, l) => {
  str = str.split("\n")[0].trim();
  if (str.length>100) {
    var ta = str.split(" ");
    var t = "";
    var index = 0;
    while ((t+ta[index]+" ").length<100) {
      t = t+ta[index]+" ";
      index++;
    }
    str = t.trim();
  }
  return str;
};

router.myExternalUrl = function(req, cb) {
  logger.debug('myExternalUrl');
  if (req.params.sez == 'videos' && req.body.externalurl) {
    oembed.extract(req.body.externalurl, {maxwidth:1920, maxheight:1080}).then((oembed) => {
      logger.debug(oembed);
      const uuid = require("uuid");
      const imageUtil = require("../../../utilities/image");
      req.body.media = {
        externalurl: req.body.externalurl,
        encoded: 1
      };
      if(!oembed.title) {
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        parser.parseString(oembed.html.split("</script>")[1], function (err, result) {
          logger.debug(result);
          if (result && result.div && result.div.blockquote && result.div.blockquote[0] && result.div.blockquote[0].a && result.div.blockquote[0].a[0] && result.div.blockquote[0].a[0]._)
            req.body.title = result.div.blockquote[0].a[0]._;
          if (!req.body.title) req.body.title = uuid.v4();
          if (result && result.div && result.div.blockquote && result.div.blockquote[0] && result.div.blockquote[0].p && result.div.blockquote[0].p[0])
            req.body.abouts = [{
              "is_primary" : false,
              "lang" : "en",
              "abouttext" : result.div.blockquote[0].p[0]
            }];
          if (req.body.title.length>100) {
            req.body.title = router.myTrim(req.body.title, 100);
          }
          if (oembed.html) req.body.media.iframe = oembed.html;
          if (oembed.duration) req.body.media.duration = oembed.duration*1000;
          if (oembed.height) req.body.media.height = oembed.height;
          if (oembed.width) req.body.media.width = oembed.width;
          //if (req.body.title) req.body.is_public = 1; 
          delete req.body.externalurl;
          cb(null)
        });
      } else {
        req.body.title = oembed.title;
        if (req.body.title.length>100) {
          req.body.title = router.myTrim(req.body.title, 100);
        }
        if (oembed.description) req.body.abouts = [{
          "is_primary" : false,
          "lang" : "en",
          "abouttext" : oembed.description
        }];
        if (oembed.html) req.body.media.iframe = oembed.html;
        if (oembed.duration) req.body.media.duration = oembed.duration*1000;
        if (oembed.height) req.body.media.height = oembed.height;
        if (oembed.width) req.body.media.width = oembed.width;
        //if (req.body.title) req.body.is_public = 1; 
        delete req.body.externalurl;
        if (oembed.thumbnail_url) {
          let thumbnail_file = oembed.thumbnail_url.substring(oembed.thumbnail_url.lastIndexOf("/")+1);
          
          let glacier_filename = uuid.v4()+"."+thumbnail_file.substring(thumbnail_file.lastIndexOf(".")+1);
          let glacier_file = router.getServerpath("/glacier/videos_previews/")+"/"+glacier_filename;
          req.body.media.preview  = glacier_file.replace(global.appRoot,"");
          router.download(oembed.thumbnail_url, glacier_file, (err) => {
            imageUtil.resizer(
              [{path: glacier_file}],
              config.cpanel.videos.forms.video.components.media.config,
              (resizeerr, info) => {
                cb(null)
              }
            )
          });
        } else {
          cb(null)
        }
      }
    }).catch((err) => {
      cb(err);
    });
  } else {
    cb(null);
  }
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
        e.learningslearnings = learnings;
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
        if (e.learningslearnings && e.learningslearnings.length) e.stats.learnings = e.learningslearnings.length;
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
        delete e.learningslearnings;

        //logger.debug(e);
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
    slugify.extend({'>': '-'})
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
    let meandcrews = req.user.crews && req.user.crews.length ? req.user.crews.map((item)=>{return item._id.toString()}) : [];
    meandcrews.push(req.user._id.toString());
    const is_editable = 
      (req.user.is_admin || 
      meandcrews.indexOf(id.toString())!==-1 || 
      id == req.user._id || 
      (data.users && data.users.map((item)=>{return item._id.toString()}).some(v=> meandcrews.indexOf(v) !== -1)));
    /* logger.debug(id);
    logger.debug(data);
    if (data.users) logger.debug(data.users.map((item)=>{return item._id.toString()}));
    logger.debug(meandcrews);
    logger.debug((data.users && data.users.map((item)=>{return item._id.toString()}).some(v=> meandcrews.indexOf(v) !== -1)));
     */
    return is_editable;
    //return false;
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
