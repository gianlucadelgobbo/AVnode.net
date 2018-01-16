const sizeOf = require('image-size');
const mongoose = require('mongoose');
const fs = require('fs');
const https = require('https');
const Asset = mongoose.model('Asset');

const helper = require('./helper');
const moment = require('moment');
/*
 const setImageIdentifier = () => {
  return moment().format('YYYY/MM/DD');
};
 */
/*
module.exports.createImageAsset = (params, done) => {
  const identifier = helper.setIdentifier();
  const dimensions = sizeOf(helper.getStorageFolder() + '/' + params.filename);
  return new Asset({
    type: 'image',
    identifier: identifier,
    publicUrl: '/storage/'+ identifier,
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
module.exports.createImageAssetFromUrl = (params, done) => {
  const identifier = helper.setIdentifier();
  console.log(`createImageAssetFromUrl dld: ${process.env.WAREHOUSE}${params.originalname}`);
  const localImage = `${process.cwd()}/storage/${identifier}.jpg`;
  const file = fs.createWriteStream(localImage);
  const request = https.get(`${process.env.WAREHOUSE}${params.originalname}`, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      console.log('The file was saved:' + localImage);
      file.close();
      return new Asset({
        type: 'image',
        identifier: identifier,
        publicUrl: '/storage/'+ identifier,
        image: {
          mimetype: 'image/jpeg',
          filename: identifier + '.jpg',
          originalname: params.originalname,
          height: 400,
          width: 1920,
          size: 42
        }
      })
      .save((err, saved) => done(err, saved._id));
    });
  });

};
module.exports.createScaledAsset = (params, done) => {
  const identifier = helper.setIdentifier();
  const dimensions = sizeOf(helper.getStorageFolder() + '/' + params.filename);
  return new Asset({
    type: 'scaled',
    identifier: identifier,
    publicUrl: '/storage/'+ identifier,
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
    publicUrl: '/storage/'+ identifier,
    video: {
      type: hoster,
      id: id,
      url: url
    }
  })
  .save((err, saved) => done(err, saved._id));
};
*/