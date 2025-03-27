import mongoose from 'mongoose';

const dataprovider = {};

import config from 'getconfig';
import helpers from './helpers.js';

const Models = {
  'Category': mongoose.model('Category'),
  'User': mongoose.model('User'),
  'UserShow': mongoose.model('UserShow'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'EventShow': mongoose.model('EventShow'),
  'Program': mongoose.model('Program'),
  'Gallery': mongoose.model('Gallery'),
  'Video': mongoose.model('Video'),
  'EventFreezedPerformance': mongoose.model('EventFreezedPerformance'),
  'EventFreezedUserShow': mongoose.model('EventFreezedUserShow'),
  'EventFreezedGallery': mongoose.model('EventFreezedGallery'),
  'EventFreezedVideo': mongoose.model('EventFreezedVideo'),
  'EventFreezedProgram': mongoose.model('EventFreezedProgram'),
  'News': mongoose.model('News'),
  'Emailqueue': mongoose.model('Emailqueue')
}
import { logger, requestLogger, errorLogger } from './logger.js';

var countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'American Samoa',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'British Virgin Islands',
  'Brunei',
  'Bulgaria',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Cayman Islands',
  'Chile',
  'China',
  'Colombia',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Curaçao',
  'Cyprus',
  'Czechia',
  "Côte d'Ivoire",
  'Denmark',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Estonia',
  'Falkland Islands (Islas Malvinas)',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'Gabon',
  'Germany',
  'Ghana',
  'Greece',
  'Greenland',
  'Grenada',
  'Guam',
  'Guatemala',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Malta',
  'Martinique',
  'Mauritius',
  'Mexico',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar (Burma)',
  'Namibia',
  'Nepal',
  'Netherlands',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Nigeria',
  'Niue',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Réunion',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines',
  'San Marino',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tanzania',
  'Thailand',
  'The Bahamas',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'U.S. Virgin Islands',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Zambia',
  'Zimbabwe'
];
/*
var countries_plugin = helpers.getCountries().map(item => {return item.label});
logger.info(countries.sort().slice(0, 100))
logger.info(countries.sort().slice(100, 200))
logger.info(countries.sort().slice(200, 250))
logger.info(countries.length)
for(var b=0;b<countries.length;b++){
  if (countries_plugin.indexOf(countries[b])===-1) {
    logger.info(countries[b]);
  }
}
*/
const partners_categories = [
  {
    "_id" : ("5be8708afc396100000001e8"),
    "name" : "CO-ORGANIZER"
  },
  {
    "_id" : ("5be8708afc396100000000fe"),
    "name" : "SUPPORTED BY"
  },
  {
    "_id" : ("5be8708afc3961000000026c"),
    "name" : "IN COLLABORATION"
  },
  {
    "_id" : ("5be8708afc3961000000005e"),
    "name" : "FRIENDS / CONTENTS"
  },
  {
    "_id" : ("5be8708afc3961000000007a"),
    "name" : "TECHNICAL PARTNERS"
  },
  {
    "_id" : ("5be8708afc3961000000007b"),
    "name" : "LPM NETWORK"
  },
  {
    "_id" : ("5be8708afc396100000000e0"),
    "name" : "TOP MEDIA PARTNERS"
  },
  {
    "_id" : ("5be8708afc39610000000165"),
    "name" : "MEDIA PARTNERS"
  },
  {
    "_id" : ("5be8708afc396100000000e1"),
    "name" : "APPROVED BY"
  },
  {
    "_id" : ("5be8708afc39610000000164"),
    "name" : "ISTITUZIONI"
  },
  {
    "_id" : ("5be8708afc396100000000e2"),
    "name" : "NETWORK EVENTS"
  },
  {
    "_id" : ("63cd0ef5803a8b74799d1d7c"),
    "name" : "SCHOOLS"
  },
  {
    "_id" : ("5be8708afc396100000001eb"),
    "name" : "VENUE"
  }
];
//const partners_categories = await Models.Category.find({ type: "partner" }).lean().exec();

/**
 * Duplica il programma di un evento in `program_freezed`
 * @param {String} eventId - ID dell'evento originale
 */
/* 
db.event_freezed_users.deleteMany({});
db.event_freezed_performances.deleteMany({});
db.event_freezed_program.deleteMany({});
db.event_freezed_galleries.deleteMany({});
db.event_freezed_videos.deleteMany({});

*/
// Funzione per la gestione degli errori
function handleError(res, message, err) {
  logger.error(`❌ ${message}:`, err);
  return res.status(500).send({ message, error: err.message, });
}

// Funzione per copiare una performance in EventFreezedPerformance
async function copyFreezedPerformance(originalPerformance, eventId) {
  logger.info(`Starting copyFreezedPerformance: ${originalPerformance._id}`);

  try {
    let freezedPerformance = await Models.EventFreezedPerformance.findOne({
      performance_original: originalPerformance._id,
      event: eventId,
    });

    if (!freezedPerformance) {
      freezedPerformance = new Models.EventFreezedPerformance({
        ...originalPerformance.toObject(),
        _id: undefined,
        bookings: undefined,
        event: eventId,
        performance_original: originalPerformance._id,
        users: [],
        galleries: [],
        videos: [],
      });

      await freezedPerformance.save();

      for (const performanceUser of originalPerformance.users || []) {
        const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        logger.info(`🧠 Memory Usage Before Query: ${Math.round(usedMemory * 100) / 100} MB`);

        let performanceUserItem
        try {
          performanceUserItem = await Models.UserShow.findOne({ _id: performanceUser }).lean().exec();
        } catch (error) {
          logger.error(`❌ Error getting user ${performanceUser._id} from UserShow: ${error.message}`);
          return handleError(res, "Error getting user", error);
        }

        const usedMemoryAfter = process.memoryUsage().heapUsed / 1024 / 1024;
        logger.info(`🧠 Memory Usage After Query: ${Math.round(usedMemoryAfter * 100) / 100} MB`);
        
        try {
          const freezedPerformanceUser = await copyFreezedUser(performanceUserItem, eventId);
          freezedPerformance.users.push(freezedPerformanceUser._id);
        } catch (error) {
          logger.error(`❌ Error copying user ${performanceUserItem._id} for performance ${freezedPerformance._id}: ${error.message}`, {
            originalUser: performanceUserItem,
            eventId
          });
        }
      }
      // Copy galleries
      if (originalPerformance.galleries && Array.isArray(originalPerformance.galleries)) {
        for (const galleryUserID of originalPerformance.galleries) {
          const gallery = await Models.Gallery.findOne({ _id: galleryUserID }).lean().exec();

          const freezedGallery = await copyFreezedGallery(gallery, eventId, freezedPerformance);

          // Copy users associated with the gallery
          if (gallery.users && Array.isArray(gallery.users)) {
            for (const galleryUserID of gallery.users) {
              let galleryUser;
              try {
                galleryUser = await Models.UserShow.findOne({ _id: galleryUserID }).lean().exec();
              } catch (error) {
                logger.error(`❌ Error getting user ${galleryUserID} for Gallery ${freezedProgramItem.performance._id } from UserShow: ${error.message}`);
                return handleError(res, `❌ Error getting user ${galleryUserID} for Gallery ${freezedProgramItem.performance._id } from UserShow: ${error.message}`, error);
              }
              
              try {
                const freezedGalleryUser = await copyFreezedUser(galleryUser, eventId);
                freezedGallery.users.push(freezedGalleryUser._id);
              } catch (error) {
                logger.error(`❌ Error copying user ${galleryUserID} for gallery ${gallery._id}: ${error.message}`, {
                  originalUser: galleryUser,
                  eventId
                });
              }
            }
          }

          await freezedGallery.save();
          freezedPerformance.galleries.push(freezedGallery._id);
        }
      }

      // Copy videos
      if (originalPerformance.videos && Array.isArray(originalPerformance.videos)) {
        for (const videoOriginalID of originalPerformance.videos) {
          const video = await Models.Video.findOne({ _id: videoOriginalID }).lean().exec();
          const freezedVideo = await copyFreezedVideo(video, eventId, freezedPerformance);

          // Copy users associated with the video
          if (video.users && Array.isArray(video.users)) {
            for (const videoUserID of video.users) {
              let videoUser;
              try {
                videoUser = await Models.UserShow.findOne({ _id: videoUserID }).lean().exec();
              } catch (error) {
                logger.error(`❌ Error getting user ${videoUserID} for Video ${video._id } from UserShow: ${error.message}`);
                return handleError(res, `❌ Error getting user ${videoUserID} for Video ${video._id } from UserShow: ${error.message}`, error);
              }
              
              try {
                const freezedVideoUser = await copyFreezedUser(videoUser, eventId);
                freezedVideo.users.push(freezedVideoUser._id);
              } catch (error) {
                logger.error(`❌ Error copying freezedVideoUser ${videoUserID} for freezedVideoUser ${freezedVideoUserID._id}: ${error.message}`, {
                  originalUser: videoUser,
                  eventId
                });
                return handleError(res, `❌ Error copying freezedVideoUser ${videoUserID} for Video ${video.performance._id } from UserShow: ${error.message}`, error);
              }

            }
          }

          await freezedVideo.save();
          freezedPerformance.videos.push(freezedVideo._id);
        }
      }

      logger.info(`Created new freezedPerformance: ${freezedPerformance._id}`);
    } else {
      logger.info(`Found existing freezedPerformance: ${freezedPerformance._id}`);
    }

    logger.info(`Ending copyFreezedPerformance: ${originalPerformance._id} to ${freezedPerformance._id}`);
    return freezedPerformance;
  } catch (error) {
    logger.error(`Error in copyFreezedPerformance: ${originalPerformance._id}`, error);
    throw new Error(`Failed to copy performance: ${error.message}`);
  }
}

// Funzione per copiare un programma in EventFreezedProgram
async function copyFreezedProgram(programItem, freezedPerformance, eventId) {
  logger.info(`Starting copyFreezedProgram: ${programItem._id}`);

  try {
    let freezedProgramItem = await Models.EventFreezedProgram.findOne({
      performance: freezedPerformance._id,
      event: eventId,
    });

    if (!freezedProgramItem) {
      freezedProgramItem = new Models.EventFreezedProgram({
        ...programItem.toObject(),
        _id: undefined,
        performance: freezedPerformance._id,
        event: eventId,
      });

      await freezedProgramItem.save();
      logger.info(`Created new freezedProgramItem: ${freezedProgramItem._id}`);
    } else {
      logger.info(`Found existing freezedProgramItem: ${freezedProgramItem._id}`);
    }

    logger.info(`Ending copyFreezedProgram: ${programItem._id} to ${freezedProgramItem._id}`);
    return freezedProgramItem;
  } catch (error) {
    logger.error(`Error in copyFreezedProgram: ${programItem._id}`, error);
    throw new Error(`Failed to copy program: ${error.message}`);
  }
}

// Funzione per copiare una galleria
async function copyFreezedGallery(originalGallery, eventId, freezedPerformance) {
  logger.info(`Starting copyFreezedGallery: ${originalGallery._id}`);

  try {
    let freezedGallery = await Models.EventFreezedGallery.findOne({
      gallery_original: originalGallery._id,
      event: eventId,
    });

    if (!freezedGallery) {
      freezedGallery = new Models.EventFreezedGallery({
        ...originalGallery,
        _id: undefined,
        gallery_original: originalGallery._id,
        event: eventId,
        performance: freezedPerformance._id,
        users: [],
      });

      await freezedGallery.save();
      logger.info(`Created new freezedGallery: ${freezedGallery._id}`);
    } else {
      logger.info(`Found existing freezedGallery: ${freezedGallery._id}`);
    }

    logger.info(`Ending copyFreezedGallery: ${originalGallery._id} to ${freezedGallery._id}`);
    return freezedGallery;
  } catch (error) {
    logger.error(`Error in copyFreezedGallery: ${originalGallery._id}`, error);
    throw new Error(`Failed to copy gallery: ${error.message}`);
  }
}

// Funzione per copiare un video
async function copyFreezedVideo(originalVideo, eventId, freezedPerformance) {
  logger.info("Starting copyFreezedVideo: "+ originalVideo._id)

  let freezedVideo = await Models.EventFreezedVideo.findOne({
    video_original: originalVideo._id,
    event: eventId
  });

  if (!freezedVideo) {
    freezedVideo = new Models.EventFreezedVideo({
      ...originalVideo,
      _id: undefined,
      video_original: originalVideo._id,
      event: eventId,
      performance: freezedPerformance._id,
      users: []
    });
    await freezedVideo.save();
  }
  logger.info("Ending copyFreezedVideo freezedVideo: "+ freezedVideo._id)

  return freezedVideo;
}

// Funzione per copiare un User
async function copyFreezedUser(originalUser, eventId) {
/*   if (!originalUser) {
    logger.error(`❌ copyFreezedUser called with undefined user! EventID: ${eventId}`);
    throw new Error(`copyFreezedUser called with undefined user! EventID: ${eventId}`);
  }

  if (!originalUser._id) {
    logger.error(`❌ copyFreezedUser called with user without _id: ${JSON.stringify(originalUser)}`);
    throw new Error(`copyFreezedUser called with user without _id: ${JSON.stringify(originalUser)}`);
  }
 */
  /* if (typeof originalUser.toObject !== 'function') {
    logger.error(`❌ originalUser.toObject is not a function. Received: ${JSON.stringify(originalUser)}`);
    throw new Error(`Invalid Mongoose document received for user ${originalUser._id}`);
  } */

  logger.info(`🛠️ Starting copyFreezedUser: ${originalUser._id} for event ${eventId}`);

  try {
    let freezedUser = await Models.EventFreezedUserShow.findOne({
      user_original: originalUser._id,
      event: eventId,
    });

    if (!freezedUser) {
      logger.info(`🆕 Creating new freezedUser for ${originalUser._id}`);

      // ✅ Ensure originalUser.toObject() is valid
      let userObject;
      try {
        userObject = originalUser;
        if (!userObject || typeof userObject !== "object") {
          throw new Error("toObject() returned an invalid object");
        }
        logger.info(`✅ Successfully converted user to object for ${originalUser._id}`);
      } catch (error) {
        logger.error(`❌ originalUser.toObject() failed for user ${originalUser._id}: ${error.message}`);
        throw new Error(`Failed to convert user to object: ${error.message}`);
      }

      // ✅ Ensure destructuring is safe
      const {
        password, tokens, stats, __v, createdAt, updatedAt,
        ...userData
      } = userObject || {};  // Fallback in case of unexpected issues

      if (!userData) {
        throw new Error(`userData is undefined after destructuring for ${originalUser._id}`);
      }

      // ✅ Ensure every array field is properly initialized
      const ensureArray = (value, fieldName) => {
        if (!Array.isArray(value)) {
          logger.warn(`⚠️ Field '${fieldName}' is ${typeof value}, expected array. Replacing with [].`);
          return [];
        }
        return value;
      };

      const arrayFields = [
        'pages', 'categories', 'crews', 'members', 'performances', 'events',
        'galleries', 'videos', 'partnerships', 'news',
        'roles', 'connections', 'addresses', 'addresses_private', 'phone',
        'mobile', 'skype', 'emails', 'web', 'social', 'citizenship',
        'partner_owner', 'partners'
      ];

      // ✅ Validate all arrays and log any unexpected values
      arrayFields.forEach(field => {
        if (!(field in userData)) {
          logger.warn(`⚠️ Missing expected field '${field}' in userData`);
          userData[field] = [];
        } else {
          userData[field] = ensureArray(userData[field], field);
        }
      });

      // ✅ Debug log to catch undefined properties before saving
      Object.keys(userData).forEach(key => {
        if (userData[key] === undefined) {
          logger.warn(`⚠️ Warning: Field '${key}' is undefined in userData`);
        }
      });

      logger.info(`🔍 Validated user data before saving: ${JSON.stringify(userData, null, 2)}`);

      freezedUser = new Models.EventFreezedUserShow({
        ...userData,
        _id: undefined,
        user_original: originalUser._id,
        event: eventId,
      });

      // ✅ Try-Catch Around Save
      try {
        await freezedUser.save();
        logger.info(`✅ Successfully saved new freezedUser: ${freezedUser._id}`);
      } catch (saveError) {
        logger.error(`❌ Error saving freezedUser: ${originalUser._id} - ${saveError.message}`, saveError);
        throw new Error(`Failed to save freezedUser: ${saveError.message}`);
      }

    } else {
      logger.info(`🔄 Found existing freezedUser: ${freezedUser._id}, skipping creation.`);
    }

    logger.info(`✅ Ending copyFreezedUser: ${originalUser._id} to ${freezedUser._id}`);
    return freezedUser;

  } catch (error) {
    logger.error(`❌ Error in copyFreezedUser: ${originalUser._id} - ${error.message}`, error);
    throw new Error(`Failed to copy user: ${error.message}`);
  }
}



dataprovider.freezeEventProgram = async (req, res) => {
  logger.info("Starting freezeEventProgram");

  const eventId = req.params.id;
  try {
    logger.info(`🔄 Freezing program for event ${eventId}`);

    // 1️⃣ Retrieve the original event
    let event = await Models.Event.findById(eventId)
      .populate("program.performance")
      .exec();

    if (!event) {
      throw new Error(`Event with ID ${eventId} not found`);
    }

    logger.info(`📋 Original program found with ${event.program.length} entries`);

    const newEventProgramFreezed = [];

    // 2️⃣ Iterate over each program entry
    for (const entry of event.program) {
      if (!entry.performance) {
        logger.error(`❌ Performance missing in program entry ${entry._id}. Process aborted.`);
        throw new Error(`Performance missing in program entry ${entry._id}. Freezing process halted.`);
      }

      try {
        logger.info(`🔄 Copying performance ${entry.performance._id}`);

        const freezedPerformance = await copyFreezedPerformance(entry.performance, eventId);
/* 
        if (!freezedPerformance.users && !freezedPerformance.users.length) {
          // Copy users associated with the performance
          for (const performanceUser of entry.performance.users || []) {
            const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
            logger.info(`🧠 Memory Usage Before Query: ${Math.round(usedMemory * 100) / 100} MB`);

            let performanceUserItem
            try {
              performanceUserItem = await Models.UserShow.findOne({ _id: performanceUser }).lean().exec();
            } catch (error) {
              logger.error(`❌ Error getting user ${performanceUser._id} from UserShow: ${error.message}`);
              return handleError(res, "Error getting user", error);
            }

            const usedMemoryAfter = process.memoryUsage().heapUsed / 1024 / 1024;
            logger.info(`🧠 Memory Usage After Query: ${Math.round(usedMemoryAfter * 100) / 100} MB`);
            
            try {
              const freezedPerformanceUser = await copyFreezedUser(performanceUserItem, eventId);
              freezedPerformance.users.push(freezedPerformanceUser._id);
            } catch (error) {
              logger.error(`❌ Error copying user ${performanceUserItem._id} for performance ${freezedPerformance._id}: ${error.message}`, {
                originalUser: performanceUserItem,
                eventId
              });
            }
          }
        }
 */
        // Copy program item
        const originalProgramItem = await Models.Program.findOne({ _id: entry.subscription_id });
        if (!originalProgramItem) {
          logger.error(`❌ No originalProgramItem found for subscription_id: ${entry.subscription_id}`);
          continue;
        }

        const freezedProgramItem = await copyFreezedProgram(originalProgramItem, freezedPerformance, eventId);
        await freezedProgramItem.save();

        // Add to the new freezed program
        newEventProgramFreezed.push({
          subscription_id: freezedProgramItem._id,
          performance: freezedProgramItem.performance,
          schedule: freezedProgramItem.schedule,
        });

        await freezedPerformance.save();
      } catch (entryError) {
        logger.error(`❌ Error copying performance ${entry.performance._id}:`, entryError);
        return handleError(res, "Error copying performance", entryError);
      }
    }

    // Save the freezed program to the event
    event.program_freezed = newEventProgramFreezed;
    event.is_freezed = true;
    await event.save();

    let eventnew = await Models.Event.findById(eventId);

    logger.info(`🎉 Successfully froze program for event ${eventId}`);
    return res.send(eventnew);
  } catch (error) {
    logger.error(`🔥 Error freezing program:`, error);
    return handleError(res, "Error freezing program", error);
  }
};











dataprovider.getData = async (req, res, view) => {
  logger.info("getDatagetDatagetData")
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms[req.params.form]) {
    const id = req.params.id;
    const select = req.query.pure ? config.cpanel[req.params.sez].forms[req.params.form].select : Object.assign(config.cpanel[req.params.sez].forms[req.params.form].select, config.cpanel[req.params.sez].forms[req.params.form].selectaddon);
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].forms[req.params.form].populate;
    let data
    /* logger.info(select)
    logger.info(populate) */
    try {
      data = await Models[config.cpanel[req.params.sez].model]
      .findById(id)
      .select(select)
      .populate(populate)
      .exec();
      if (!data) {
        if (view == "json") {
          res.status(404).send({ message: `DOC_NOT_FOUND` });
        } else {
          res.status(404).render('404', {path: req.originalUrl, currentUrl: req.originalUrl, user: req.user, title:req.__("404: Page not found"), titleicon:"icon-warning"});
        }  
      } else {
        if (helpers.editable(req, data, id)) {
          let send = {_id: data._id};
          for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) send[item] = data[item];
          //logger.info(send)

          if (view == "json") {
            res.json(send);
          } else {
            if (req.params.sez == "partners" && req.body.subject && req.body.submit=="send") {
              router.addPartnersToQueque(req, res, data, () => {
                req.flash('success', { msg: req.__('Messagess added to the cue.')+'<a href="/admin/mailer"><b>'+req.__("CHECK THE CUE")+'</b></a>' });
                res.render(view, {
                  title: view,
                  scripts: [],
                  currentUrl: req.originalUrl,
                  get: req.params,
                  query: req.query,
                  body: req.body,
                  countries: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getCountries() : undefined,
                  languages: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getLanguages() : undefined,
                  msg_tmp: { }, 
                  data: send,
                  partners_categories: partners_categories
                });
              });
            } else if (req.params.sez == "events" && req.body.subject && req.body.submit=="send") {
              router.addPartnersEventToQueque(req, res, data, () => {
                req.flash('success', { msg: req.__('Messagess added to the cue.')+'<a href="/admin/mailer"><b>'+req.__("CHECK THE CUE")+'</b></a>' });
                res.render(view, {
                  title: view,
                  scripts: [],
                  currentUrl: req.originalUrl,
                  get: req.params,
                  query: req.query,
                  body: req.body,
                  countries: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getCountries() : undefined,
                  languages: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getLanguages() : undefined,
                  msg_tmp: { }, 
                  data: send,
                  partners_categories: partners_categories
                });
              });
            } else {
              res.render(view, {
                title: view,
                config: config,
                scripts: [],
                currentUrl: req.originalUrl,
                get: req.params,
                query: req.query,
                body: req.body,
                countries: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getCountries() : undefined,
                languages: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getLanguages() : undefined,
                msg_tmp: { }, 
                data: send,
                partners_categories: partners_categories
              });
            }
          }  
        } else {
          if (view == "json") {
            res.status(401).send({ message: `DOC_NOT_OWNED` });
          } else {
            res.status(401).render('401', {path: req.originalUrl, title:req.__("401: Access to the content is denied"), titleicon:"icon-warning"});
          }  
        }
      }
    } catch (err) {
      console.error(`🔥 Error in getData:`, err);
      if (view == "json") {
        res.status(500).send({ message: `${JSON.stringify(err)}` });
      } else {
        res.status(404).render('404', {path: req.originalUrl, currentUrl: req.originalUrl, user: req.user, title:req.__("404: Page not found"), titleicon:"icon-warning"});
      }
    }
  } else {
    if (view == "json") {
      res.status(404).send({ message: `API_NOT_FOUND` });
    } else {
      res.status(404).render('404', {path: req.originalUrl, currentUrl: req.originalUrl, user: req.user, title:req.__("404: Page not found"), titleicon:"icon-warning"});
    }  
  }
}

dataprovider.addPartnersToQueque = async (req, res, data, cb) => {
  var tosave = {};
  tosave.organization = req.params.id;
  if (req.params.event) tosave.event = req.params.event;
  tosave.user = req.user._id;
  tosave.subject = req.body.subject;
  tosave.messages_tosend = [];
  tosave.messages_sent = [];
  if (req.query.is_active=="1") data.partners = data.partners.filter(partner => partner.is_active == (req.query.is_active=="1"));
  if (req.query.is_event=="1") data.partners = data.partners.filter(partner => partner.is_event == (req.query.is_event=="1"));
  if (req.query.is_selecta=="1") data.partners = data.partners.filter(partner => partner.is_selecta == (req.query.is_selecta=="1"));
  //-each q in req.query.categories
  if (req.query.categories) 
    data.partners = data.partners.filter(partner => req.query.categories.some(r => partner.categories.map(item => {return item._id.toString()}).includes(r) ));
  if (req.query.nokind) 
    data.partners = data.partners.filter(partner => !partner.categories.length);

  data.partners.forEach((item, index) => {
    var message = {};
    if (!req.body.exclude) req.body.exclude = [];
    if (item.partner && item.partner.organizationData && item.partner.organizationData.contacts && item.partner.organizationData.contacts[0] && item.partner.organizationData.contacts[0].email && req.body.exclude.indexOf(item.partner._id.toString())===-1) {
      message.to_html = "";
      message.cc_html = [];

      message.from_name = req.body.from_name;
      message.from_email = req.body.from_email;
      message.user_email = req.body.user_email;
      message.user_password = req.body.user_password;
      message.subject = req.body.subject.split("[org_name]").join(item.partner.stagename);

      item.partner.organizationData.contacts.forEach((contact, cindex) => {
        if (contact.email && message.to_html == "") {
          message.to_html = (contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">"
          message.text = req.body["message_"+(contact.lang=="it" ? "it" : "en")]
          message.text = message.text.split("[name]").join(contact.name);
          message.text = message.text.split("[slug]").join(item.partner.slug);
        } else if (contact.email && message.to_html != "") {
          message.cc_html.push((contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">")
        }
      });

      if (message.to_html != "") {
        tosave.messages_tosend.push(message);
      } else {
        logger.info(item);
      }
    } else {
      logger.info(item);
    }
  });
  try {
    await Models.Emailqueue.create(tosave);
    cb()
  } catch (err) {
    logger.info("Emailqueue.create")
    cb(err)
  }
}

dataprovider.addPartnersEventToQueque = async (req, res, data, cb) => {
  var tosave = {};
  tosave.organization = data.users[0];
  if (req.params.event) tosave.event = req.params.id;
  tosave.user = req.user._id;
  tosave.subject = req.body.subject;
  tosave.messages_tosend = [];
  tosave.messages_sent = [];

  var dest = [];
  data.partners.forEach((group, index) => {
    group.users.forEach((item, index) => {
      logger.info(item);
      if (!req.body.exclude || res.body.exclude.indexOf(item._id.toString())) dest.push(item._id.toString());
    });
  });

  var populate = [{ "path": "partners.partner", "select": "stagename slug organizationData", "model": "User"}];
  //const query = {"partner_owner.owner": {$in: event.users.map(item =>{return item._id})}};
  const query = {"_id": {$in: data.users}};
  try {
    data = await Models.User.
    find(query).
    lean().
    sort({stagename: 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    populate(populate).
    exec();
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
  }
  var partners = []
  for (var item in data) {
    partners = partners.concat(data[item].partners);
  }   
  logger.info("partners");
  logger.info(partners);
  partners.forEach((item, index) => {
    var message = {};
    logger.info("req.body.exclude.indexOf(item._id.toString())===-1");
    if (item && item.partner && item.partner.organizationData && item.partner.organizationData.contacts && item.partner.organizationData.contacts[0] && item.partner.organizationData.contacts[0].email && dest.indexOf(item.partner._id.toString())!==-1) {
      message.to_html = "";
      message.cc_html = [];

      message.from_name = req.body.from_name;
      message.from_email = req.body.from_email;
      message.user_email = req.body.user_email;
      message.user_password = req.body.user_password;
      message.subject = req.body.subject.split("[org_name]").join(item.partner.stagename);

      item.partner.organizationData.contacts.forEach((contact, cindex) => {
        if (contact.email && message.to_html == "") {
          message.to_html = (contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">"
          message.text = req.body["message_"+(contact.lang=="it" ? "it" : "en")]
          message.text = message.text.split("[name]").join(contact.name);
          message.text = message.text.split("[slug]").join(item.partner.slug);
        } else if (contact.email && message.to_html != "") {
          message.cc_html.push((contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">")
        }
      });

      if (message.to_html != "") tosave.messages_tosend.push(message)
    } else {
      //logger.info(item.partner.stagename);
    }
  });
  logger.info("tosavetosavetosavetosavetosavetosave");
  //logger.info(tosave);
  try {
    await Models.Emailqueue.create(tosave);
    cb(err)
  } catch (err) {
    logger.info(`${JSON.stringify(err)}`);
    cb(err)
  }
}

dataprovider.fetchShow = async (req, section, subsection, model, populate, select, output, cb) => {
  logger.info("fetchShow");

  logger.info("req.query");
  logger.info(req.query);
  logger.info("subsection");
  logger.info(subsection);
  logger.info("slug");
  logger.info(req.params.slug);
  logger.info("model");
  logger.info(model.modelName);
  console.log("populate");
  console.log(populate);
/**/
  if ((section=="performers" || section=="organizations") &&  subsection != "show") {
    if (req.query.crews) {
      try {
        select.crews = 1;    
        logger.info("fetchShow query 1 "+model.modelName);
        const data = await model.
        findOne({slug: req.params.slug}).
        populate(populate).
        select(select).
        exec();
        var meandcrews = data.crews;
        meandcrews.push(data._id);
        let submodel = (subsection == "performances" ? Models["Performance"] : Models["EventShow"]);
        let query = populate.filter(pop => pop.path == subsection)[0].match;
        if (subsection == "partnerships") {
          query["partners.users"] = {$in: meandcrews};
        } else {
          query.users = {$in: meandcrews};
        }
        const newselect = populate.filter(pop => pop.path == subsection)[0].select;
        const newpopulate = populate.filter(pop => pop.path == subsection)[0].populate;
        const limit = populate.filter(pop => pop.path == subsection)[0].options.limit;
        const sort = populate.filter(pop => pop.path == subsection)[0].options.sort;
        //logger.info("newselect");
        //logger.info(newselect);
        //logger.info(submodel);
        //logger.info(sort);
        //const total = d && d[nolimit[0].path] && d[nolimit[0].path].length ? d[nolimit[0].path].length : 0;
        try {
          logger.info("fetchShow query 2 "+submodel.modelName);
          const total = await submodel.countDocuments(query);
          const sub = await submodel.
          find(query).
          populate(newpopulate).
          select(newselect).
          sort(sort).
          limit(limit).
          exec();
          let datadata = JSON.parse(JSON.stringify(data));
          datadata[subsection] = sub;
          cb(null, datadata, total);
        } catch (err) {
          cb(err);
        }
      } catch (err) {
        cb(err);
      }
    } else {
      const nolimit = JSON.parse(JSON.stringify(populate));
      delete nolimit[0].options;
      if (req.query.limit) {
        for(let a=0; a<populate.length;a++) {
          if (populate[a].options && populate[a].options.limit) populate[a].options.limit = parseInt(req.query.limit);
        }
      }
      try {
        logger.info("fetchShow query 3 "+model.modelName);
        const d = await model.
        findOne({slug: req.params.slug}).
        lean({ virtuals: false }).
        // C populate({path: 'crews', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
        populate(nolimit).
        select("_id").
        exec()
        try {
          const total = d && d[nolimit[0].path] && d[nolimit[0].path].length ? d[nolimit[0].path].length : 0;
          logger.info("fetchShow query 4 "+model.modelName);
          const data = await model.
          findOne({slug: req.params.slug}).
          // lean({ virtuals: true }).
          // C populate({path: 'crews', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
          populate(populate).
          select(select).
          exec()
          /* const res = Object.assign(select, data);
          //logger.info(select);
          //logger.info(Object.keys(res));
          cb(err, res, total); */
          //logger.info("res.partnershipaaaaaaab");
          if(data && data.partnerships && data.partnerships_ordered) {
            delete data.partnerships;
            //logger.info(data.partnerships);
          }
          cb(null, data, total);
        } catch (err) {
          res.json(err);
        }
      } catch (err) {
        res.json(err);
      }
    }
  } else {
    if (subsection === "program") {
      if (req.params.performance) {
        for(let a=0; a<populate.length;a++) {
          if (populate[a].path==="program.performance") {
            //populate[a].match = { "slug": req.params.performance};
            populate[a].select.abouts = 1;
            populate[a].select.bookings = 1;
            populate[a].populate.push({
              "path": "bookings.event",
              "select": {
                "title": 1,
                "image": 1,
                "schedule": 1,
                "slug": 1
              },
              "model": "EventShow"
            });
            populate[a].populate.push({
              "path": "users",
              "select": {
                "stagename": 1,
                "image": 1,
                "slug": 1,
                "abouts": 1,
                "addresses": 1,
                "web": 1,
                "social": 1
              },
              "model": "UserShow"
            });
            populate[a].populate.push({
              "path": "galleries",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "stats": 1,
                "image": 1,
                "slug": 1
              },
              "model": "Gallery"
            });
            populate[a].populate.push({
              "path": "videos",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "stats": 1,
                "media": 1,
                "slug": 1
              },
              "model": "Video"
            });
          }
          if (populate[a].path==="program_freezed.performance") {
            //populate[a].match = { "slug": req.params.performance};
            populate[a].select.abouts = 1;
            populate[a].select.bookings = 1;
            populate[a].populate.push({
              "path": "bookings.event",
              "select": {
                "title": 1,
                "image": 1,
                "schedule": 1,
                "slug": 1
              },
              "model": "EventShow"
            });
            populate[a].populate.push({
              "path": "users",
              "select": {
                "stagename": 1,
                "image": 1,
                "slug": 1,
                "abouts": 1,
                "addresses": 1,
                "web": 1,
                "social": 1
              },
              "model": "EventFreezedUserShow"
            });
            populate[a].populate.push({
              "path": "galleries",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "stats": 1,
                "image": 1,
                "slug": 1
              },
              "model": "EventFreezedGallery"
            });
            populate[a].populate.push({
              "path": "videos",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "stats": 1,
                "media": 1,
                "slug": 1
              },
              "model": "EventFreezedVideo"
            });
          }
        }
      }
      if (req.params.day) {
        /*
        const date = new Date(req.params.day);
        //logger.info(date);
        select['program.schedule.date.$'] = date;
        populate.push({
          "path": "program.schedule",
          "match": {day: req.params.day}
        }); */
      }
    }
    if (subsection === "performers") {
      if (req.params.performer) {
        for(let a=0; a<populate.length;a++) {
          if (populate[a].path==="program.performance") {
            for(let b=0; b<populate[a].populate.length;b++) {
              if (populate[a].populate[b].path==="users") {
                //populate[a].match = { "users": req.params.performer};
                populate[a].populate[b].select.abouts = 1;
                populate[a].populate[b].populate = [{
                  "path": "performances",
                  //"match": {"bookings.event.slug": "fotonica-2018"},
                  "select": {
                    "title": 1,
                    "image": 1,
                    "type": 1,
                    "bookings": 1,
                    "slug": 1
                  },
                  "model": "Performance",
                  "populate": [{
                    "path": "bookings.event",
                    "match": {"slug": req.params.slug},
                    "select": {
                      "title": 1,
                      "image": 1,
                      "slug": 1
                    },
                    "model": "EventShow"
                  }]
                }];
              }
            }
          }
        }
      }
    }
    if (section === "performances") {
      if (req.params.gallery || req.params.video) {
        for(let a=0; a<populate.length;a++) {
          if (populate[a].path==="galleries") {

            populate[a].select.medias = 1;
            populate[a].match = { "slug": req.params.gallery};           
            populate[a].populate = [{
              "path": "users",
              "select": {
                "slug": 1,
                "image": 1,
                "organizationData.logo": 1,
                "members": 1,
                "addresses.country": 1,
                "addresses.locality": 1,
                "stats": 1,
                "stagename": 1
              },
              "model": "UserShow"
            },{
              "path": "performances",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "slug": 1,
                "categories": 1,
                "stats": 1,
                "image": 1
              },
              "model": "Performance"
            },{
              "path": "events",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "slug": 1,
                "categories": 1,
                "stats": 1,
                "image": 1
              },
              "model": "Event"
            }];
          }
          if (populate[a].path==="videos") {

            populate[a].match = { "slug": req.params.video};           
            populate[a].populate = [{
              "path": "users",
              "select": {
                "slug": 1,
                "image": 1,
                "organizationData.logo": 1,
                "members": 1,
                "addresses.country": 1,
                "addresses.locality": 1,
                "stats": 1,
                "stagename": 1
              },
              "model": "UserShow"
            },{
              "path": "performances",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "slug": 1,
                "categories": 1,
                "stats": 1,
                "image": 1
              },
              "model": "Performance"
            },{
              "path": "events",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "slug": 1,
                "categories": 1,
                "stats": 1,
                "image": 1
              },
              "model": "Event"
            }];
          }
        }
      }
    }
    logger.info("CE PROVO")
    try {
     console.log("populate");
     console.log(populate);
      /*  logger.info("select");
      logger.info(select);
      logger.info("BINGOOOOOBINGOOOOOBINGOOOOO");
      logger.info("model");
      logger.info(model.modelName);
      logger.info("config.sections[section]");
      logger.info(config.sections[section]);
      logger.info({slug: req.params.sub ? req.params.sub : req.params.slug, is_public: 1});  */
      logger.info("fetchShow query 5 "+model.modelName);
      let ddd = await model.
      findOne({slug: req.params.sub ? req.params.sub : req.params.slug, is_public: 1}).
      // lean({ virtuals: true }).
      // C populate({path: 'crews', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
      populate(populate).
      select(select).
      exec()
      let data;
      
      logger.info("ddd");
      //logger.info(ddd);
      if (ddd) data = JSON.parse(JSON.stringify(ddd));
      let myres = {};
      if (data && data.organizationsettings && data.organizationsettings.call && data.organizationsettings.call.calls && data.organizationsettings.call.calls.length) {
        data.participate = true;
      }
      if (output && data) {
        for(var item in output) {
          if (data[item]) {
            if (output[item] === 1) {
              myres[item] = data[item];
            } else {
              for(var item2 in output[item]) {
                if (!myres[item]) myres[item] = {};
                if (data[item][item2]) {
                  myres[item][item2] = data[item][item2];
                }
              }
            }
          }
        }
      } else {
        myres = data;
      }
      if (myres && myres.advanced && myres.advanced.programmebydayvenue && req.params.day) {
        let programmebydayvenue = [];
        for(let a=0; a<myres.advanced.programmebydayvenue.length;a++) {
          if (myres.advanced.programmebydayvenue[a].day===req.params.day) {
            programmebydayvenue.push(myres.advanced.programmebydayvenue[a]);
          }
        }
        myres.advanced.programmebydayvenue = programmebydayvenue;
        myres.advanced.programmenotscheduled = undefined;
      }

      if (myres && myres.advanced && myres.advanced.programmebydayvenue && req.params.type) {
        for(let a=0; a<myres.advanced.programmebydayvenue.length;a++) {
          for(let b=0; b<myres.advanced.programmebydayvenue[a].rooms.length;b++) {
            let performances = [];
            for(let c=0; c<myres.advanced.programmebydayvenue[a].rooms[b].performances.length;c++) {
              if (myres.advanced.programmebydayvenue[a].rooms[b].performances[c].performance.type && myres.advanced.programmebydayvenue[a].rooms[b].performances[c].performance.type.slug===req.params.type) {
                performances.push(myres.advanced.programmebydayvenue[a].rooms[b].performances[c]);
              }
            }
            myres.advanced.programmebydayvenue[a].rooms[b].performances = performances;
          }
        }
        let a=0;
        while(a<myres.advanced.programmebydayvenue.length) {
          let b=0;
          while(b<myres.advanced.programmebydayvenue[a].rooms.length) {
            if (!myres.advanced.programmebydayvenue[a].rooms[b].performances.length) {
              myres.advanced.programmebydayvenue[a].rooms.splice(b, 1);
            } else {
              b++;
            }
          }
          if (!myres.advanced.programmebydayvenue[a].rooms.length) {
            myres.advanced.programmebydayvenue.splice(a, 1);
          } else {
            a++;
          }
        }
        myres.advanced.programmenotscheduled = undefined;
      }

      if (myres && myres.advanced && myres.advanced.programmebydayvenue && req.params.performance) {
        for(let a=0; a<myres.advanced.programmebydayvenue.length;a++) {
          for(let b=0; b<myres.advanced.programmebydayvenue[a].rooms.length;b++) {
            for(let c=0; c<myres.advanced.programmebydayvenue[a].rooms[b].performances.length;c++) {
              if (myres.advanced.programmebydayvenue[a].rooms[b].performances[c].performance.slug===req.params.performance) {
                myres.performance = myres.advanced.programmebydayvenue[a].rooms[b].performances[c].performance;
              }
            }
          }
        }
        if (myres.performance && myres.performance.bookings && myres.performance.bookings.length) {
          let a=0;
          while(a<myres.performance.bookings.length) {
            /* let b=0;
            while(b<myres.performer.performances[a].bookings.length) {
              if (!myres.performer.performances[a].bookings[b].event) {
                myres.performer.performances[a].bookings.splice(b, 1);
              } else {
                b++;
              }
            } */
            if (!myres.performance.bookings[a].event || myres.performance.bookings[a].event.slug!=req.params.slug) {
              myres.performance.bookings.splice(a, 1);
            } else {
              a++;
            }
          }
        }
        delete myres.advanced.programmebydayvenue;
        myres.advanced.programmenotscheduled = undefined;
      }
      if (myres && myres.advanced && myres.advanced.performers && myres.advanced.performers.performers && req.params.performer) {
        //logger.info("BINGOOOOOBINGOOOOO");
        for(let a=0; a<myres.advanced.performers.performers.length;a++) {
          if (myres.advanced.performers.performers[a].slug===req.params.performer) {
            myres.performer = myres.advanced.performers.performers[a];
          }
        }
        //logger.info(myres.performer);
        if (myres.performer) {
          //logger.info("myres.performer.performances")
          //logger.info(myres.performer.performances)
          myres.performer.performances = []
          //logger.info(myres.advanced.programmebydayvenue)
          /*
          let a=0;
          while(a<myres.performer.performances.length) {
            let b=0;
            while(b<myres.performer.performances[a].bookings.length) {
              if (!myres.performer.performances[a].bookings[b].event) { ///.slug != req.params.slug
                myres.performer.performances[a].bookings.splice(b, 1);
              } else {
                b++;
              }
            }
            if (!myres.performer.performances[a].bookings.length) {
              myres.performer.performances.splice(a, 1);
            } else {
              a++;
            }
          } */
        }
        delete myres.advanced.performers;
      }
      //logger.info("myres.partnershipaaaaaaa");
      if(myres && myres.partnerships && myres.partnerships_ordered) {
        delete myres.partnerships;
        //logger.info(myres.partnerships);
      }
      logger.info("fetchShow END");
      console.log(myres.users[0].stagename)
      cb(null, myres);
      //cb(err, data);
    } catch (err) {
      logger.info("ERRORERRORERRORERRORERRORERROR");
      logger.error(err);
      cb(err);
    }
  }
};

/* dataprovider.getPerformanceByIds = async (req, ids, cb) => {
  try {
    const data = await Models["Performance"].find({ users: { $in: ids } })
      .populate({ path: "type", select: "name" })
      .populate({
        path: "users",
        select: "stagename slug members",
        populate: { path: "members", select: "stagename slug" },
      })
      .select({ title: 1, categories: 1 })
      .lean(); // Optimize query by skipping Mongoose model conversion

    return cb(null, data);
  } catch (err) {
    console.error(`🔥 Error in getPerformanceByIds:`, err);
    return cb(err, null);
  }
}; */

dataprovider.getPerformanceByIds = async (req, ids) => {
  try {
    return await Models["Performance"].find({ users: { $in: ids } })
      .populate({ path: "type", select: "name" })
      .populate({
        path: "users",
        select: "stagename slug members",
        populate: { path: "members", select: "stagename slug" },
      })
      .select({ title: 1, categories: 1 })
      .lean();
  } catch (err) {
    console.error(`🔥 Error in getPerformanceByIds:`, err);
    throw err; // Allow the caller to handle the error
  }
};

/* dataprovider.getEmailById = (id, cb) => {
  Models["UserShow"]findOne({'_id':id}, "email",(err, data) => {
    //logger.info("getEmailById");  
    //logger.info(data);  
    cb(err, data);
  });
}; */

dataprovider.getJsonld = (data, req, title, section, subsection, type, res) => {
  logger.info("getJsonld")
  let jsonld = {
    "@context": "http://schema.org",
  }
  if (data && data.stagename) {
    if (subsection != "show") {
      jsonld["@type"] = "ItemList";
      jsonld.itemListElement = [];
      jsonld.name = data.stagename+" "+req.__(config.sections[section][subsection].title);
      jsonld.image = data.imageFormats.large;
      jsonld.description = req.__("The list of "+config.sections[section][subsection].title+" by")+" "+data.stagename;
      jsonld.itemListElement = [];
      for(let a=0;a<data.length;a++) {
        if (data[a].stagename) {
          if (data[a].stats.members) {
            jsonld.itemListElement.push({
              '@type': 'ListItem',
              "position": a+1,
              "url": (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            });
    
          } else {
            jsonld.itemListElement.push({
              '@type': 'ListItem',
              "position": a+1,
              "url": (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            });
          }
    
        } else {
          jsonld.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            /* "item": {
              '@type': 'CreativeWork',
              "name": data[a].title,
              "url": (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl+data[a].slug
            } */
          });
        }
      }
      /* jsonld.name = data.title;
      jsonld.description = data.description;
      jsonld.image = data.imageFormats.large; */
    } else {
      if (data.is_crew) {
        jsonld["@type"] = "PerformingGroup";
        if (data.members && data.members.length) {
          jsonld.member = [];
          for(let a=0;a<data.members.length;a++) {
            jsonld.member.push({
              '@type': 'OrganizationRole', 
              "member": {
                "@type": "Person",
                "name": data.members[a].stagename
              }
            });
          }
        }
      } else {
        jsonld["@type"] = "Person";
      }
      jsonld.name = data.stagename;
      jsonld.description = data.description;
      jsonld.image = data.imageFormats.large;
      if ((data.web && data.web.length) || (data.social && data.social.length)) {
        jsonld.sameAs = [];
        if (data.web) for(let a=0;a<data.web.length;a++) jsonld.sameAs.push(data.web[a].url);
        if (data.social) for(let a=0;a<data.social.length;a++) jsonld.sameAs.push(data.social[a].url);
      }
      if (data.addresses.length && data.addresses[0]) {
        jsonld.address = {
          "@type": "PostalAddress",
          "addressLocality": data.addresses[0].locality,
          "addressCountry": data.addresses[0].country
        }  
      }
    }
  } else if (data && data.title) {
    //logger.info("subsection");
    //logger.info(subsection);
    if (subsection != "show" && !data.performer && !data.performance) {
      jsonld["@type"] = "ItemList";
      jsonld.itemListElement = [];
      jsonld.name = data.title+" "+req.__(config.sections[section][subsection].title);
      if (type) jsonld.name+= ": "+type.name;
      if (req.params.day) jsonld.name+= ": "+req.params.day;
      jsonld.image = data.imageFormats.large;
      if (data.event) {
        jsonld.description = data.event.description;
      } else if (data.performance) {
        jsonld.description = data.performance.description;
      } else {
        jsonld.description = req.__("The "+config.sections[section][subsection].title+" of")+" "+(type ? type.name+" "+req.__("of")+" " : req.params.day ? req.params.day+" "+req.__("of")+" " : "") + data.title;
      }
      jsonld.itemListElement = [];
      for(let a=0;a<data.length;a++) {
        if (data[a].stagename) {
          if (data[a].stats.members) {
            jsonld.itemListElement.push({
              '@type': 'ListItem',
              "position": a+1,
              "url": (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            });
    
          } else {
            jsonld.itemListElement.push({
              '@type': 'ListItem',
              "position": a+1,
              "url": (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            });
          }
    
        } else {
          jsonld.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            /* "item": {
              '@type': 'CreativeWork',
              "name": data[a].title,
              "url": (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl+data[a].slug
            } */
          });
        }
      }
      /* jsonld.name = data.title;
      jsonld.description = data.description;
      jsonld.image = data.imageFormats.large; */
    } else if (subsection == "performers" && data.performer) {
      if (data.performer.is_crew) {
        jsonld["@type"] = "PerformingGroup";
        if (data.performer.members && data.performer.members.length) {
          jsonld.member = [];
          for(let a=0;a<data.performer.members.length;a++) {
            jsonld.member.push({
              '@type': 'OrganizationRole', 
              "member": {
                "@type": "Person",
                "name": data.performer.members[a].stagename
              }
            });
          }
        }
      } else {
        jsonld["@type"] = "Person";
      }
      jsonld.name = data.performer.stagename;
      jsonld.description = data.performer.description;
      jsonld.image = data.performer.imageFormats.large;
      if ((data.performer.web && data.performer.web.length) || (data.performer.social && data.performer.social.length)) {
        jsonld.sameAs = [];
        if (data.performer.web) for(let a=0;a<data.performer.web.length;a++) jsonld.sameAs.push(data.performer.web[a].url);
        if (data.performer.social) for(let a=0;a<data.performer.social.length;a++) jsonld.sameAs.push(data.performer.social[a].url);
      }
      if (data.performer.addresses && data.performer.addresses.length) {
        //logger.info(data.addresses);
        jsonld.address = {
          "@type": "PostalAddress",
          "addressLocality": data.performer.addresses[0].locality,
          "addressCountry": data.performer.addresses[0].country/* .join(", ").trim().split(",")[0].replace(" ", ", ").replace("<b>", "").replace("</b>", "") */
        }  
      }
    } else if (subsection == "program" && data.performance) {
      if (data.performance.bookings && data.performance.bookings.length) {
        for(let a=0;a<data.performance.bookings.length;a++) {
          //logger.info(data.performance.bookings[a]);
          if(data.performance.bookings[a].event._id.toString()==data._id.toString()) {
            jsonld.startDate = data.performance.bookings[a].schedule[0].starttime;
            jsonld.location = {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": data.performance.bookings[a].schedule[0].venue.location.locality,
                "addressCountry": data.performance.bookings[a].schedule[0].venue.location.country
              },
              "name": data.performance.bookings[a].schedule[0].venue.name
            };    
          }
        }
      }
      jsonld["@type"] = "CreativeWork";
      jsonld.author = [];
      if (data.performance.users) {
        for(let a=0;a<data.performance.users.length;a++) {
          if (data.performance.users[a].members && data.performance.users[a].members.length) {
            jsonld.author.push({
              '@type': 'OrganizationRole',
              "name": data.performance.users[a].stagename
            });
    
          } else {
            jsonld.author.push({
              '@type': 'Person',
              "name": data.performance.users[a].stagename
            });
          }
        }  
      }
      jsonld.name = data.title+" "+req.__("Program")+": "+data.performance.title;
      jsonld.description = data.performance.description;
      jsonld.image = data.performance.imageFormats.large;
      if ((data.performance.web && data.performance.web.length) || (data.performance.social && data.performance.social.length)) {
        jsonld.sameAs = [];
        if (data.performance.web) for(let a=0;a<data.performance.web.length;a++) jsonld.sameAs.push(data.performance.web[a].url);
        if (data.performance.social) for(let a=0;a<data.performance.social.length;a++) jsonld.sameAs.push(data.performance.social[a].url);
      }
      if (data.performance.media && data.performance.media.file && data.performance.media.width && data.performance.media.height) {
        jsonld.video = "https://"+req.headers.host+data.performance.media.file;
        jsonld.video_width = data.performance.media.width;
        jsonld.video_height = data.performance.media.height;
      }

    } else {
      if (data.schedule && data.schedule.length && data.schedule[0].venue && data.schedule[0].venue.location) {
        jsonld["@type"] = "Event";
        jsonld.startDate = data.schedule[0].starttime;
        if (data.schedule[0].venue.type == 'virtual') {
          jsonld.location = {
            "@type": "VirtualLocation",
            "url": data.schedule[0].venue.url
          }
        } else {
          jsonld.location = {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": data.schedule[0].venue.location.locality,
              "addressCountry": data.schedule[0].venue.location.country
            },
            "name": data.schedule[0].venue.name
          };  
        }
      } else {
        jsonld["@type"] = "CreativeWork";
        jsonld.author = [];
        if (data.users) {
          for(let a=0;a<data.users.length;a++) {
            if (data.users[a].members && data.users[a].members.length) {
              jsonld.author.push({
                '@type': 'OrganizationRole',
                "name": data.users[a].stagename
              });
      
            } else {
              jsonld.author.push({
                '@type': 'Person',
                "name": data.users[a].stagename
              });
            }
          }  
        }
      }
      jsonld.name = data.title;
      jsonld.description = data.description;
      jsonld.image = data.imageFormats.large;
      if ((data.web && data.web.length) || (data.social && data.social.length)) {
        jsonld.sameAs = [];
        if (data.web) for(let a=0;a<data.web.length;a++) jsonld.sameAs.push(data.web[a].url);
        if (data.social) for(let a=0;a<data.social.length;a++) jsonld.sameAs.push(data.social[a].url);
      }
      if (data.media && data.media.file && data.media.width && data.media.height) {
        jsonld.video = "https://"+req.headers.host+data.media.file;
        jsonld.video_width = data.media.width;
        jsonld.video_height = data.media.height;
      }
    }
  } else if (data && data.length) {
    jsonld["@type"] = "ItemList";
    jsonld.itemListElement = [];
    jsonld.name = title;
    jsonld.image = "/images/sez/avnode.net-"+section+".jpg";
    jsonld.description = req.__("The list of "+jsonld.name);
    jsonld.itemListElement = [];
    for(let a=0;a<data.length;a++) {
      if (data[a].stagename) {
        if (data[a].stats.members) {
          jsonld.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
          });
  
        } else {
          jsonld.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
          });
        }
  
      } else {
        jsonld.itemListElement.push({
          '@type': 'ListItem',
          "position": a+1,
          "url": (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
          /* "item": {
            '@type': 'CreativeWork',
            "name": data[a].title,
            "url": (res.locals.isLocal ? "http" : "https") + '://' + req.get('host') + req.originalUrl+data[a].slug
          } */
        });
      }
    }
    /* jsonld.name = data.title;
    jsonld.description = data.description;
    jsonld.image = data.imageFormats.large; */
  }

  //logger.info(jsonld);
  return jsonld;
};

dataprovider.fetchRandomPerformance = async (model, query, select, populate, limit, skip, sorting, cb) => {
  query.is_public = true;
  try {
    const total = await model.countDocuments(query);
    
    if (total === 0) {
      return cb(null, [], total); // Call cb with empty data if no records found
    }

    const random = Math.floor(Math.random() * total);
    
    const data = await model.find(query)
    .skip(random)
    .populate(populate)
    .limit(1)
    .select(select)
    .exec();
    cb(null, data, total); // Always call cb
  } catch (err) {
    console.error(`🔥 Error in fetchRandomPerformance (${model.modelName}):`, err);
    cb(err, null, null); // Pass error to callback
  }
};

dataprovider.fetchLists = async (model, query, select, populate, limit, skip, sorting, cb) => {
  try {
    query.is_public = true;
    
    // Log the function call for debugging
    logger.info(`FetchLists called with model: ${model.modelName}`);

    // Use Promises instead of callback
    const total = await model.countDocuments(query);
    logger.info(select)

    let data = await model.find(query)
      .populate(populate)
      .select(select)
      .limit(limit)
      .skip(skip)
      .sort(sorting)
      .exec();
    
    cb(null, data, total);
  } catch (err) {
    // 🔥 Enhanced Error Logging with File Name
    logger.error(`🔥 ERROR in fetchLists: ${err.message}`);
    logger.error(err.stack);

    cb(err);
  }
};

dataprovider.makeTextPlainToRich = (str) => {
  str=str.replace('"','&quot;');
  str=str.replace("###b###","<b>");
  str=str.replace("###/b###","</b>");
  str=str.replace('((mailto:|(news|(ht|f)tp(s?))://){1}\S+)','<a href="\0" target="_blank">\0</a>');
  str=str.replace(">mailto:", ">", str);
  //str = preg_replace('/((http(s)?:\/\/)|(www\\.))((\w|\.)+)(\/)?(\S+)?/i','<a href="\0" target="_blank">\0</a>', str);
  str=str.replace("\r\n","<br />");
  str=str.replace("\n","<br />");
  //str=$this->eraseTripleBr(str);
  //str=htmlspecialchars(str);
  //str=htmlentities(str);
  return str;	
}

dataprovider.addCat = async (req, populate, cb) => {
  try {
    if (req.params.type) {
      const cat = await Models["Category"].findOne({ slug: req.params.type }).lean(); // Use lean() for performance

      if (cat && populate[0].match) {
        populate[0].match.type = cat._id;
      }

      return cb(populate, cat);
    } else {
      return cb(populate);
    }
  } catch (err) {
    console.error(`🔥 Error in addCat:`, err);
    return cb(populate, null); // Ensure callback is always called, even on error
  }
};

dataprovider.show = (req, res, section, subsection, model) => {
  logger.info("show");
  logger.info(section);
  logger.info(subsection);
  /*logger.info("config.sections[section]");
  logger.info(config.sections[section]); */
  let populate = JSON.parse(JSON.stringify(config.sections[section][subsection].populate));
  logger.info("populate PRE");
  /* logger.info(model.modelName); */
  //logger.info(populate);
  dataprovider.addCat(req, populate, (populate, type) => {
    for(let item in populate) {
      if (req.params.page && populate[item].options && populate[item].options.limit) populate[item].options.skip = populate[item].options.limit*(req.params.page-1);
      if (populate[item].model) populate[item].model = Models[populate[item].model]
  
      if (populate[item].populate && populate[item].populate.model) populate[item].populate.model = Models[populate[item].populate.model];
      if (populate[item].populate) {
        for(let a=0;a<populate[item].populate.length;a++) {
          if (populate[item].populate[a] && populate[item].populate[a].model) populate[item].populate[a].model = Models[populate[item].populate[a].model];
        }
      }
    }
    //logger.info("populate AFTER");
    //logger.info(populate[0].match);
    const select = config.sections[section][subsection].select;
    const output = config.sections[section][subsection].output ? config.sections[section][subsection].output : false;

    dataprovider.fetchShow(req, section, subsection, model, populate, select, output, (err, data, total) => {
      logger.info("fetchShow END");

          //logger.info(data);
      if (err || !data || data === null) {
        res.status(404).render('404', {path: req.originalUrl, currentUrl: req.originalUrl, user: req.user, title:req.__("404: Page not found"), titleicon:"icon-warning"});
      } else {
        // MAP
        if (data && data.schedule && data.schedule.length && data.schedule[0].venue && data.schedule[0].venue.location) {
          const locations = data.schedule.map(obj =>{
            if (obj.venue.location.geometry && obj.venue.location.geometry.lat && obj.venue.location.geometry.lng) {
              var rObj = {
                "marker":{
                  "url":"/images/icon_marker.svg",
                  "scaledSize":{"width":46,"height":78,"f":"px","b":"px"},
                  "origin":{"x":0,"y":0},
                  "anchor":{"x":23,"y":78}
                }
              };
              rObj.lat = obj.venue.location.geometry.lat;
              rObj.lng = obj.venue.location.geometry.lng;
              return rObj;
            }
          });
          if (locations && locations.length) {
            data.locations = [];
            for (let item in locations) {
              if (locations[item]) data.locations.push(locations[item]);
            }
          }
          //logger.info("locations");
          //logger.info(locations);
          //data.schedule = undefined;
        }
        if (data && data.addresses && data.addresses.length) {
          const locations = data.addresses.map(obj =>{
            if (obj && obj.geometry && obj.geometry.lat && obj.geometry.lng) {
              var rObj = {
                "marker":{
                  "url":"/images/icon_marker.svg",
                  "scaledSize":{"width":46,"height":78,"f":"px","b":"px"},
                  "origin":{"x":0,"y":0},
                  "anchor":{"x":23,"y":78}
                }
              };
              rObj.lat = obj.geometry.lat;
              rObj.lng = obj.geometry.lng;
              return rObj;
            }
          });
          if (locations && locations.length) {
            data.locations = [];
            for (let item in locations) {
              if (locations[item]) data.locations.push(locations[item]);
            }
          }
        }
        // MAP END

        if (data && data.medias && req.params.img) {
          for (let item in data.medias) {
            if (data.medias[item].slug===req.params.img) {
              if (!req.session[data._id+"#IMG:"+data.medias[item].slug]) {
                req.session[data._id+"#IMG:"+data.medias[item].slug] = true;
                if (!data.medias[item].stats) data.medias[item].stats = {}
                data.medias[item].stats.visits = data.medias[item].stats.visits ? data.medias[item].stats.visits+1 : 1;
                model.updateOne({_id:data._id},{"medias":data.medias}, (err, raw) => {
                });
              }
              data.img = data.medias[item];
              data.img.index = item;
            }
          }
          for (let item in data.medias2) {
            if (data.medias2[item].slug===req.params.img) {
              data.img.imageFormats = data.medias2[item].imageFormats;
            }
          }
          logger.info("ecchime2")
          if (!req.user || !req.user.likes || !req.user.likes[section] || req.user.likes[section].map(function(e) { return e.id.toString(); }).indexOf((data._id+"#IMG:"+data.img.slug).toString())===-1) {
            data.liked = false;
          } else {
            data.liked = true;
          }
        } else if (data && data.galleries && data.galleries[0] && data.galleries[0].medias && req.params.img) {
          for (let item in data.galleries[0].medias) {
            if (data.galleries[0].medias[item].slug===req.params.img) {
              if (!req.session[data.galleries[0]._id+"#IMG:"+data.galleries[0].medias[item].slug]) {
                req.session[data.galleries[0]._id+"#IMG:"+data.galleries[0].medias[item].slug] = true;
                if (!data.galleries[0].medias[item].stats) data.galleries[0].medias[item].stats = {}
                data.galleries[0].medias[item].stats.visits = data.galleries[0].medias[item].stats.visits ? data.galleries[0].medias[item].stats.visits+1 : 1;
                model.updateOne({_id:data.galleries[0]._id},{"medias":data.galleries[0].medias}, (err, raw) => {
                });
              }
              data.galleries[0].img = data.galleries[0].medias[item];
              data.galleries[0].img.index = item;
            }
          }
          for (let item in data.galleries[0].medias2) {
            if (data.galleries[0].medias2[item].slug===req.params.img) {
              data.galleries[0].img.imageFormats = data.galleries[0].medias2[item].imageFormats;
            }
          }
          logger.info("ecchime3")
          if (!req.user || !req.user.likes || !req.user.likes[section] || req.user.likes[section].map(function(e) { return e.id.toString(); }).indexOf((data._id+"#IMG:"+req.params.img).toString())===-1) {
            data.liked = false;
          } else {
            data.liked = true;
          }
        } else {
          if (!req.session[data._id]) {
            req.session[data._id] = true;
            if (!data.stats) data.stats = {};
            data.stats.visits = data.stats.visits ? data.stats.visits+1 : 1;
            model.updateOne({_id:data._id},{"stats.visits":data.stats.visits});
          }  
          logger.info("ecchime4")
          if (!req.user || !req.user.likes || !req.user.likes[section] || req.user.likes[section].map(function(e) { return e.id.toString(); }).indexOf(data._id.toString())===-1) {
            data.liked = false;
          } else {
            data.liked = true;
          }
        }
        data.pages = [];
        if (total>0) {
          let limit = req.query.limit ? parseInt(req.query.limit) : config.sections[section].limit;
          let link = '/' + data.slug + '/' + subsection + '/page/';
          let page = (req.params.page ? parseFloat(req.params.page) : 1);
          let skip = (page - 1) * limit;
          data.pages = helpers.getPagination(link, skip, limit, total, "/"); 
        }
        /* let editable = false;
        if (req.user && req.user._id) {
          if (req.user.is_admin) {
            editable = true;
          } else if (data.users) {
            for(let a=0;a<data.users.length;a++) if (data.users[a]._id.toString() === req.user._id.toString() || req.user.crews.indexOf(data.users[a]._id.toString())!==-1) editable = true;
          } else if (data._id.toString() === req.user._id.toString()) {
            editable = true;
          }
        } */
        if (req.isApi) {
          //logger.info("fetchShow END");
          res.json(data);
          /* if (process.env.DEBUG) {
            res.render('json', {data: data});
          } else {
            res.json(data);
          } */
          //res.send(JSON.stringify(data, null, '\t'));
        } else if (req.query.xml) {
          res.render(section + '/fpData', {
            title: data.stagename,
            data: data,
            nextpage: req.params.page ? parseFloat(req.params.page)+1 : 2
          });
        } else {
          let title = (data.stagename ? data.stagename : data.title)
          title+= (config.sections[section] && subsection!="show" && config.sections[section][subsection] ? " "+req.__(config.sections[section][subsection].title) : "");
          if (type) title+= ": "+type.name;
          if (req.params.day) title+= ": "+req.params.day;
          if (data.performance) title+= ": "+data.performance.title;

          if (req.query.oembed) {
            res.render(section + '/oembed', {
              title: title,
              jsonld:dataprovider.getJsonld(data, req, data.stagename ? data.stagename : data.title, section, subsection, type, res),
              canonical: res.locals.canonical,
//canonical: (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl.split("?")[0],
              data: data,
              section: section,
            });
          } else {
            var scripts = [];
            if (data && data.media && data.media.file) scripts.push("video");
            if (data && data.videos && data.videos && data.videos.length && data.videos[0].media) scripts.push("video");
            res.render(section + '/' + subsection, {
              title: title,
              jsonld:dataprovider.getJsonld(data, req, data.stagename ? data.stagename : data.title, section, subsection, type, res),
              canonical: res.locals.canonical,
//canonical: (res.locals.isLocal ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl.split("?")[0],
              editable: helpers.editable(req, data, data._id),
              get: req.query,
              data: data,
              host: req.get('host'),
              scripts: scripts,
              type: type,
              pages: data.pages,
              section: section,
              path: req.originalUrl,
              nextpage: req.params.page ? parseFloat(req.params.page)+1 : 2
            });
          }
        }
      }
    });
  });
};

dataprovider.list = (req, res, section, model) => {

  if (!model) {
    res.status(404).render('404', {path: req.originalUrl, title:req.__("404: Page not found"), titleicon:"icon-warning"});
  } else {
    const page = req.params.page;
    const filter = req.params.filter;
    const sorting = req.params.sorting;
  
    let notfound = false;
  
    if (config.sections[section].categories.indexOf(filter) === -1) notfound = true;
    if (typeof config.sections[section].ordersQueries[sorting] === 'undefined') notfound = true;
    if (parseInt(page).toString()!=page.toString()) notfound = true;
  
    const skip = (page - 1) * config.sections[section].limit;
    const select = config.sections[section].list_fields;
    const populate = config.sections[section].list_populate;
  
    if (notfound) {
      res.status(404).render('404', {path: req.originalUrl, currentUrl: req.originalUrl, user: req.user, title:req.__("404: Page not found"), titleicon:"icon-warning"});
    } else {
      //const query = filter=='individuals' ? {is_crew: 0} : filter=='crews' ? {is_crew: 1} : {};
      let query = Object.assign({}, config.sections[section].categoriesQueries[filter]);
      if (req.query.country ) {
        query["addresses.country"] = new RegExp(req.query.country, "i");
      }
      dataprovider.fetchLists(model, query, select, populate, config.sections[section].limit, skip, config.sections[section].ordersQueries[sorting], (err, data, total) => {
        const title = config.sections[section].title + ': ' + config.sections[section].labels[filter] + ' ' + config.sections[section].labels[sorting];
        if (req.isApi) {
          if (process.env.DEBUG === true) {
            res.render('json', {data: {total:total, skip:skip, data:data}});
          } else {
            res.json({total:total, skip:skip, data:data});
          }
        } else if (req.originalUrl.indexOf("-sitemap.xml")!==-1) {
          if (data.length) {
            let lastmod = helpers.dateoW3CString(data.map(item => {
              return item.updatedAt ? item.updatedAt : item.createdAt;
            }).sort().reverse()[0]);
            res.set('Content-Type', 'text/xml');
            res.render('sitemaps/list', {
              host: (res.locals.isLocal ? "http" : "https") /*req.protocol*/+"://"+req.headers.host,
              data: data,
              lastmod: lastmod,
              basepath: config.sections[section].basepath,
              nextpage: req.params.page ? parseFloat(req.params.page)+1 : 2
            });
          } else {
            res.status(404).render('404', {path: req.originalUrl, currentUrl: req.originalUrl, user: req.user, title:req.__("404: Page not found"), titleicon:"icon-warning"});
          }
        } else {
          let info = ' From ' + skip + ' to ' + (skip + config.sections[section].limit) + ' on ' + total + ' ' + title;
          let link = '/' + section + '/' + filter + '/' + sorting + '/';
          let pages = helpers.getPagination(link, skip, config.sections[section].limit, total, (req.query.country ? "?country="+req.query.country : ""));
          var scripts = [];
          if (data && data.media && data.media[0] && data.media[0].file) scripts.push("video");
          if (section === "videos") scripts.push("video");
          logger.info("ecchime")

          res.render(config.sections[section].view_list, {
            title: title,
            section: section,
            jsonld:dataprovider.getJsonld(data, req, title, section, null, null, res),
            canonical: res.locals.canonical,
            sort: sorting,
            total: total,
            pages: pages,
            scripts: scripts,
            selected_country: req.query.country,
            countries: countries,
            filter: filter,
            categories: config.sections[section].categories,
            orderings: config.sections[section].orders,
            labels: config.sections[section].labels,
            data: data
          });
        }
      });
    }
  }
};


export default dataprovider;
