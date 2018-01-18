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

const setIdentifier = () => {
  return uuid.v4();
};

const getStorageFolder = () => {
  return `${process.cwd()}/${process.env.STORAGE}`;
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

module.exports = {
  setIdentifier,
  getStorageFolder,
  isYoutube,
  youtubeParser,
  isVimeo,
  vimeoParser,
  getVideoType,
  getPagination
};
