const sizeOf = require('image-size');
const mongoose = require('mongoose');
const Asset = mongoose.model('Asset');

const helper = require('./helper');

module.exports.createImageAsset = (params, done) => {
  const identifier = helper.setIdentifier();
  const dimensions = sizeOf(helper.getStorageFolder() + '/' + params.filename);
  return new Asset({
    type: 'image',
    identifier: identifier,
    publicUrl: '/warehouse/'+ identifier,
    image: {
      mimetype: params.mimetype,
      filename: params.filename,
      originalname: params.originalname,
      height: dimensions.height,
      width: dimensions.width,
      size: params.size
    }
  })
  .save((err, saved) => done(err, saved._id));
};

module.exports.createScaledAsset = (params, done) => {
  const identifier = helper.setIdentifier();
  const dimensions = sizeOf(helper.getStorageFolder() + '/' + params.filename);
  return new Asset({
    type: 'scaled',
    identifier: identifier,
    publicUrl: '/warehouse/'+ identifier,
    origin: params.origin,
    image: {
      mimetype: params.mimetype,
      filename: params.filename,
      height: dimensions.height,
      width: dimensions.width,
      size: params.size
    }
  })
  .save((err, saved) => done(err, saved._id));
};

module.exports.createVideoAsset = (url, done) => {
  const identifier = helper.setIdentifier();
  const hoster = helper.getVideoType(url);
  let id = null;
  if (hoster === 'youtube') {
    id = helper.youtubeParser(url);
  } else if (hoster === 'vimeo') {
    id = helper.vimeoParser(url);
  }

  return new Asset({
    type: 'video',
    identifier: identifier,
    publicUrl: '/warehouse/'+ identifier,
    video: {
      type: hoster,
      id: id,
      url: url
    }
  })
  .save((err, saved) => done(err, saved._id));
};
