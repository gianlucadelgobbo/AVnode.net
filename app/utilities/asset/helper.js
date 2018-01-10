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

module.exports = {
  setIdentifier,
  getStorageFolder,
  isYoutube,
  youtubeParser,
  isVimeo,
  vimeoParser,
  getVideoType
};
