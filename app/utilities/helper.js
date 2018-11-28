const uuid = require('uuid');

const youtubeRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

const vimeoRegex = /(?:https?\:\/\/)?(?:www\.)?(?:vimeo\.com\/)([0-9]+)/;

const isYoutube = (url) => {
  return youtubeRegex.test(url);
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
      .replace(urlPattern, '<a href="$&">$&</a>')
      .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
      .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>')
      .replace(/\r\n/gi,"<br />")
      .replace(/\n/gi,"<br />");
};

const setIdentifier = () => {
  return uuid.v4();
};

const getStorageFolder = () => {
  //return `${process.cwd()}/${process.env.STORAGE}`;
};
const getPagination = (link, skip, limit, total) => {
  var pages = [];
  total = Math.floor(total / limit);
  var current = Math.floor(skip / limit);

  // add prev link if not on first page
  if (current !== 0) {
    pages.push({index: '<<', link: link + 1, active: false});
    pages.push({index: '<', link: link + current, active: false});
  }

  // go five items back and forth
  // TODO could be improved in the future
  for (var i = (current - 5); i <= (current + 5); i++) {
    if (i >= 0 && i <= total) {
      var active = false;
      if (i === current) {
        active = true;
      }
      pages.push({index: (i + 1), link: link + (i + 1), active: active});
    }
  }

  // add next link if not on first page
  if (current !== total) {
    pages.push({index: '>', link: link + (current + 2), active: false});
    pages.push({index: '>>', link: link + (total + 1), active: false});
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
  linkify,
  setIdentifier,
  getStorageFolder,
  isYoutube,
  youtubeParser,
  isVimeo,
  vimeoParser,
  getVideoType,
  getPagination
};
