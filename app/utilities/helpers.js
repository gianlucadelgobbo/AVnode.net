import config from 'getconfig';

import {extract} from '@extractus/oembed-extractor';

import http from 'http';
import https from 'https';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const setIdentifier = () => {
  return uuidv4();
};

import { logger, requestLogger, errorLogger } from './logger.js';
import { countries as defaultCountries } from 'countries-list';

const allCountries = defaultCountries;
const allLanguages = defaultCountries;

const getCountries = (req, res) => {
  let convert = [];
  for (var item in allCountries) {
    convert.push( {"value": item, "label": allCountries[item].name})
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

const getLanguages = (req, res) => {
  let convert = [];
  for (var item in allLanguages) {
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

const getServerpath = storage => {
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

const download = (url, dest, cb) => {
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

const myTrim = (str, l) => {
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

export async function myExternalUrl(req) {
  logger.info("myExternalUrl started");

  // ✅ Validate input
  if (req.params.sez !== "videos" || !req.body.externalurl) {
    logger.warn("Skipping myExternalUrl: Not a video or no external URL provided.");
    return;
  }

  try {
    // ✅ Extract oEmbed data
    const oembed = await extract(req.body.externalurl, { maxwidth: 1920, maxheight: 1080 });

    logger.info("✅ oEmbed data extracted:", oembed);

    // ✅ Initialize media object
    req.body.media = {
      externalurl: req.body.externalurl,
      encoded: 1
    };

    // ✅ Extract title & description from oEmbed
    if (!oembed.title && oembed.html) {
      const htmlPart = oembed.html.split("</script>")[1];

      if (htmlPart) {
        try {
          const parser = new xml2js.Parser();
          const result = await parser.parseStringPromise(htmlPart);

          req.body.title = result?.div?.blockquote?.[0]?.a?.[0]?._ || uuid.v4();
          req.body.abouts = result?.div?.blockquote?.[0]?.p?.[0]
            ? [{ is_primary: false, lang: "en", abouttext: result.div.blockquote[0].p[0] }]
            : [];

        } catch (xmlErr) {
          logger.error("🔥 XML Parsing Error in myExternalUrl:", xmlErr);
          req.body.title = uuid.v4(); // Use a fallback title if XML parsing fails
        }
      } else {
        throw new Error("Failed to parse oEmbed HTML content");
      }
    } else {
      req.body.title = oembed.title?.length > 100 ? myTrim(oembed.title, 100) : oembed.title;
      req.body.abouts = oembed.description
        ? [{ is_primary: false, lang: "en", abouttext: oembed.description }]
        : [];
    }

    // ✅ Store video metadata
    req.body.media.iframe = oembed.html || "";
    req.body.media.duration = oembed.duration ? oembed.duration * 1000 : null;
    req.body.media.height = oembed.height || null;
    req.body.media.width = oembed.width || null;

    // ✅ Remove original external URL
    delete req.body.externalurl;

    // ✅ Handle thumbnail download & processing
    if (oembed.thumbnail_url) {
      try {
        const thumbnailFile = oembed.thumbnail_url.split("/").pop();
        const glacierFilename = `${uuid.v4()}.${thumbnailFile.split(".").pop()}`;
        const glacierFile = `${getServerpath("/glacier/videos_previews/")}/${glacierFilename}`;

        req.body.media.preview = glacierFile.replace(config.appRoot, "");

        // ✅ Download thumbnail
        await download(oembed.thumbnail_url, glacierFile);
        logger.info("✅ Thumbnail downloaded:", glacierFile);

        // ✅ Resize image
        await imageUtil.resizer(
          [{ path: glacierFile }],
          config.cpanel.videos.forms.video.components.media.config
        );
        logger.info("✅ Thumbnail resized successfully");
      } catch (err) {
        logger.error("🔥 Error processing thumbnail:", err);
      }
    }

    logger.info("✅ myExternalUrl completed successfully");
  } catch (err) {
    logger.error("🔥 Error in myExternalUrl:", err);
    throw new Error("oEmbed extraction failed: " + err.message);
  }
}



// Ensure this is at the top before it's used in router.post('/')
const mySlugify = async (Model, name) => {
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


const editable = function(req, data, id) {
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

const getActivity = (stats) => {
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

const getActivityAsPerformer = (stats) => {
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

const getActivityAsOrganization = (stats) => {
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

const youtubeRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

const vimeoRegex = /(?:https?\:\/\/)?(?:www\.)?(?:vimeo\.com\/)([0-9]+)/;

const isYoutube = (url) => {
  return youtubeRegex.test(url);
};

const makeDescription = (abouts, locals) => {
  let about = locals.__('Text is missing');
  let aboutA = abouts.filter(item => item.lang === locals.locale);
  if (aboutA.length && aboutA[0].abouttext) {
    about = aboutA[0].abouttext.replace(/\r\n/g, ' ');
  } else {
    aboutA = abouts.filter(item => item.lang === "en");
    if (aboutA.length && aboutA[0].abouttext) {
      about = "["+locals.__("Text available only in English")+"] "+aboutA[0].abouttext;
    }
  }
  about = about.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(new RegExp(/<(?:.|\n)*?>/gm), " ").trim().replace(/  /g , " ");

  let descriptionA = about.split(" ");
  let descriptionShort = "";
  for(let item in descriptionA) if ((descriptionShort+" "+descriptionA[item]).trim().length<300) descriptionShort+=descriptionA[item]+" ";
  descriptionShort = descriptionShort.trim();
  if (descriptionShort.length < about.length) descriptionShort+"...";
  return "descriptionShort";
};

const dateFix = (date) => { 
  if (!date) {
    return false;
  } else {
    const dateA = date.split("/");
    const day = parseInt(dateA[0]);
    const month = parseInt(dateA[1])-1;
    const year = parseInt(dateA[2]);
    const dateO = new Date(year,month,day,2,0,0);
    logger.info('birthday');
    logger.info(date);
    logger.info(dateO);
    logger.info("day");
    logger.info(day);
    logger.info(dateO.getDate());
    logger.info("month");
    logger.info(month);
    logger.info(dateO.getMonth());
    logger.info("year");
    logger.info(year);
    logger.info(dateO.getFullYear());
    if (year !== dateO.getFullYear() || month !== dateO.getMonth() || day !== dateO.getDate()) {
      return false;
    } else {
      return dateO;
    }
  }
};

const youtubeParser = (url) => {
  const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regex);
  return (match&&match[7].length==11)? match[7] : false;
};

const vimeoParser = (url) => {
  const regex = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
  const match = url.match(regex);
  return match[1];
};

const isVimeo = (url) => {
  return vimeoRegex.test(url);
};

const getVideoType = (url) => {
  if (isYoutube(url)) {
    return 'youtube';
  } else if (isVimeo(url)) {
    return 'vimeo';
  } else {
    return 'unknown';
  }
};

const linkify = (str) => {

  // http://, https://, ftp://
  var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

  // www. sans http:// or https://
  var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

  // Email addresses
  var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

  return str
    .replace(urlPattern, '<a href="$&" target="_blank" class="text-truncate">$&</a>')
    .replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank" class="text-truncate">$2</a>')
    .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
};

const getStorageFolder = () => {
  //return `${process.cwd()}/${process.env.STORAGE}`;
};

const getPagination = (link, skip, limit, total, add) => {
  var pages = [];
  total = Math.floor(total / limit);
  var current = Math.floor(skip / limit);

  // add prev link if not on first page
  if (current !== 0) {
    pages.push({index: '<<', link: link + 1 + add, active: false});
    pages.push({index: '<', link: link + current + add, active: false});
  }

  // go five items back and forth
  // TODO could be improved in the future
  for (var i = (current - 5); i <= (current + 5); i++) {
    if (i >= 0 && i <= total) {
      var active = false;
      if (i === current) {
        active = true;
      }
      pages.push({index: (i + 1), link: link + (i + 1) + add, active: active});
    }
  }

  // add next link if not on first page
  if (current !== total) {
    pages.push({index: '>', link: link + (current + 2) + add, active: false});
    pages.push({index: '>>', link: link + (total + 1) + add, active: false});
  }
  return pages;
}

const dateoW3CString = (date) => {
	var year = date.getFullYear();
	var month = date.getMonth();
	month ++;
	if (month < 10) {
		month = '0' + month;
	}
	var day = date.getDate();
	if (day < 10) {
		day = '0' + day;
	}
	var hours = date.getHours();
	if (hours < 10) {
		hours = '0' + hours;
	}
	var minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	var seconds = date.getSeconds();
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	var offset = -date.getTimezoneOffset();
	var offsetHours = Math.abs(Math.floor(offset / 60));
	var offsetMinutes = Math.abs(offset) - offsetHours * 60;
	if (offsetHours < 10) {
		offsetHours = '0' + offsetHours;
	}
	if (offsetMinutes < 10) {
		offsetMinutes = '0' + offsetMinutes;
	}
	var offsetSign = '+';
	if (offset < 0) {
		offsetSign = '-';
	}
	return year + '-' + month + '-' + day +
		'T' + hours + ':' + minutes + ':' + seconds +
		offsetSign + offsetHours + ':' + offsetMinutes;
}

export default {
  getCountries,
  getLanguages,
  getServerpath,
  download,
  myTrim,
  myExternalUrl,
  mySlugify,
  editable,
  getActivity,
  getActivityAsPerformer,
  getActivityAsOrganization,
  dateoW3CString,
  makeDescription,
  linkify,
  setIdentifier,
  getStorageFolder,
  isYoutube,
  youtubeParser,
  dateFix,
  isVimeo,
  vimeoParser,
  getVideoType,
  getPagination
};
