const logger = require('./logger');

const uuid = require('uuid');

const youtubeRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

const vimeoRegex = /(?:https?\:\/\/)?(?:www\.)?(?:vimeo\.com\/)([0-9]+)/;

const isYoutube = (url) => {
  return youtubeRegex.test(url);
};

const makeDescription = (abouts) => {
  let about = __('Text is missing');
  let aboutA = abouts.filter(item => item.lang === global.getLocale());
  if (aboutA.length && aboutA[0].abouttext) {
    about = aboutA[0].abouttext.replace(/\r\n/g, ' ');
  } else {
    aboutA = abouts.filter(item => item.lang === "en");
    if (aboutA.length && aboutA[0].abouttext) {
      about = "["+__("Text available only in English")+"] "+aboutA[0].abouttext;
    }
  }
  about = about.replace(/\r\n/g, ' ').replace(new RegExp(/<(?:.|\n)*?>/gm), " ").trim().replace(/  /g , " ");

  descriptionA = about.split(" ");
  let descriptionShort = "";
  for(let item in descriptionA) if ((descriptionShort+" "+descriptionA[item]).trim().length<300) descriptionShort+=descriptionA[item]+" ";
  descriptionShort = descriptionShort.trim();
  if (descriptionShort.length < about.length) descriptionShort+"...";
  return descriptionShort;
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
    logger.debug('birthday');
    logger.debug(date);
    logger.debug(dateO);
    logger.debug("day");
    logger.debug(day);
    logger.debug(dateO.getDate());
    logger.debug("month");
    logger.debug(month);
    logger.debug(dateO.getMonth());
    logger.debug("year");
    logger.debug(year);
    logger.debug(dateO.getFullYear());
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
      .replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
      .replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>')
      .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
};

const setIdentifier = () => {
  return uuid.v4();
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

module.exports = {
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
