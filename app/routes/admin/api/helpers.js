import createRouter from "../../router.js";
const router = createRouter();
import config from 'getconfig';
import mongoose from 'mongoose';

import slugify from 'slugify';
import {extract} from '@extractus/oembed-extractor';

import http from 'http';
import https from 'https';
import fs from 'fs';


const Models = {
  'Category': mongoose.models.Category, // Use models.Category instead of mongoose.model
  'User': mongoose.models.User,
  'Performance': mongoose.models.Performance,
  'Event': mongoose.models.Event,
  'Footage': mongoose.models.Footage,
  'Gallery': mongoose.models.Gallery,
  'News': mongoose.models.News,
  'Playlist': mongoose.models.Playlist,
  'Video': mongoose.models.Video,
  'VenueDB': mongoose.models.VenueDB,
  'AddressDB': mongoose.models.AddressDB
};

import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';
import { countries as defaultCountries } from 'countries-list';
const allCountries = defaultCountries;
const allLanguages = defaultCountries;

router.getCountries = (req, res) => {
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

/* router.setStatsAndActivity = function(query) {
  logger.info('setStatsAndActivity');
  logger.info(query);
  return new Promise(function (resolve, reject) {
    //let query = JSON.parse('{"q": '+req.body.q+'}').q;
    Models['User'].
    find(query).
    exec((err, e) => {
      logger.info('setStatsAndActivity');
      //logger.info(query);
      //logger.info(e.length);
      var promises = [];
      for (var item=0; item<e.length; item++) promises.push(router.setStatsAndActivitySingle({_id: e[item]._id}));
      Promise.all(
        promises
      ).then( (resultsPromise) => {
        setTimeout(function() {
          //logger.info('resultsPromise');
          //logger.info(resultsPromise);
          resolve(resultsPromise);
        }, 1000);
      });

    });
  });
} */
router.setStatsAndActivity = async function(query) {
  logger.info('setStatsAndActivity');
  logger.info(query);
  
  try {
    const users = await Models['User'].find(query).exec(); // Async/await version
    logger.info('setStatsAndActivity - Users Found:', users.length);

    // Process each user with setStatsAndActivitySingle
    const promises = users.map(user => router.setStatsAndActivitySingle({_id: user._id}));

    // Wait for all promises to complete
    const results = await Promise.all(promises);

    return results;
  } catch (error) {
    logger.info('Error in setStatsAndActivity:', error);
    throw error; // Ensure error propagates
  }
};
router.getServerpath = storage => {
  // Set Folder and create if do not exist
  const d = new Date();
  let month = d.getMonth() + 1;
  let serverpath = `${config.appRoot}${storage}${d.getFullYear()}/`;
  month = month < 10 ? "0" + month : month;
  if (!fs.existsSync(serverpath)) fs.mkdirSync(serverpath);
  serverpath += month;
  if (!fs.existsSync(serverpath)) fs.mkdirSync(serverpath);
  return serverpath;
};

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

router.myExternalUrl = async function(req, cb) {
  logger.info('myExternalUrl');

  // Ensure the request has a valid video external URL
  if (req.params.sez !== 'videos' || !req.body.externalurl) {
    return cb(null);
  }

  try {
    const oembed = await extract(req.body.externalurl, { maxwidth: 1920, maxheight: 1080 });
    logger.info(oembed);

    req.body.media = {
      externalurl: req.body.externalurl,
      encoded: 1
    };

    if (!oembed.title) {
      if (oembed.html) {
        const htmlPart = oembed.html.split("</script>")[1];

        if (htmlPart) {
          const parser = new xml2js.Parser();
          parser.parseString(htmlPart, function (err, result) {
            if (err) {
              logger.info("XML Parsing Error:", err);
              return cb(err);
            }

            // Extract Title from Blockquote
            if (
              result?.div?.blockquote?.[0]?.a?.[0]?._ &&
              typeof result.div.blockquote[0].a[0]._ === 'string'
            ) {
              req.body.title = result.div.blockquote[0].a[0]._;
            } else {
              req.body.title = uuid.v4(); // Fallback title
            }

            // Extract Description from Blockquote
            if (result?.div?.blockquote?.[0]?.p?.[0]) {
              req.body.abouts = [{
                "is_primary": false,
                "lang": "en",
                "abouttext": result.div.blockquote[0].p[0]
              }];
            }

            req.body.title = req.body.title.length > 100 ? router.myTrim(req.body.title, 100) : req.body.title;
            req.body.media.iframe = oembed.html || '';
            req.body.media.duration = oembed.duration ? oembed.duration * 1000 : null;
            req.body.media.height = oembed.height || null;
            req.body.media.width = oembed.width || null;

            delete req.body.externalurl;
            cb(null);
          });
        } else {
          return cb(new Error("Failed to parse oEmbed HTML content"));
        }
      } else {
        return cb(new Error("oEmbed response missing 'title' and 'html'"));
      }
    } else {
      req.body.title = oembed.title.length > 100 ? router.myTrim(oembed.title, 100) : oembed.title;
      req.body.abouts = oembed.description
        ? [{ "is_primary": false, "lang": "en", "abouttext": oembed.description }]
        : [];

      req.body.media.iframe = oembed.html || '';
      req.body.media.duration = oembed.duration ? oembed.duration * 1000 : null;
      req.body.media.height = oembed.height || null;
      req.body.media.width = oembed.width || null;

      delete req.body.externalurl;

      if (oembed.thumbnail_url) {
        let thumbnailFile = oembed.thumbnail_url.split("/").pop();
        let glacierFilename = `${uuid.v4()}.${thumbnailFile.split(".").pop()}`;
        let glacierFile = router.getServerpath("/glacier/videos_previews/") + "/" + glacierFilename;

        req.body.media.preview = glacierFile.replace(config.appRoot, "");

        // Download and process the image
        router.download(oembed.thumbnail_url, glacierFile, (err) => {
          if (err) {
            logger.info("Thumbnail Download Error:", err);
            return cb(err);
          }

          imageUtil.resizer(
            [{ path: glacierFile }],
            config.cpanel.videos.forms.video.components.media.config,
            (resizeErr) => {
              if (resizeErr) {
                logger.info("Image Resize Error:", resizeErr);
                return cb(resizeErr);
              }
              cb(null);
            }
          );
        });
      } else {
        cb(null);
      }
    }
  } catch (err) {
    logger.info("oEmbed Extraction Error:", err);
    cb(err);
  }
};


router.setStatsAndActivitySingle = async function(query) {
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


// Ensure this is at the top before it's used in router.post('/')
router.mySlugify = async (Model, name) => {
  if (!name) return null;

  try {
    // Normalize slug
    let slug = name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9\-]/g, '') // Remove special characters
      .replace(/-+/g, '-'); // Remove multiple hyphens

    let exists = await Model.exists({ slug });
    let counter = 1;

    while (exists) {
      let newSlug = `${slug}-${counter}`;
      exists = await Model.exists({ slug: newSlug });
      if (!exists) {
        slug = newSlug;
        break;
      }
      counter++;
    }

    return slug;
  } catch (err) {
    console.error("🔥 Error in mySlugify:", err);
    throw err;
  }
};


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
    /* logger.info(id);
    logger.info(data);
    if (data.users) logger.info(data.users.map((item)=>{return item._id.toString()}));
    logger.info(meandcrews);
    logger.info((data.users && data.users.map((item)=>{return item._id.toString()}).some(v=> meandcrews.indexOf(v) !== -1)));
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



export default router;
