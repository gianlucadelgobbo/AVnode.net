const mongoose = require('mongoose');
const Asset = mongoose.model('Asset');

const assetUtil = require('./asset');
const uuid = require('uuid');
const sharp = require('sharp');
const config = require('getconfig');

module.exports.sizes = {
  user: {
    profile: {
      height: config.imageHeight,
      width: config.imageWidth
    },
    teaser: {
      height: config.teaserHeight,
      width: config.teaserWidth
    }
  },
  crew: {
    image: {
      height: config.imageHeight,
      width: config.imageWidth
    },
    teaser: {
      height: config.teaserHeight,
      width: config.teaserWidth
    }
  },
  event: {
    image: {
      height: config.imageHeight,
      width: config.imageWidth
    },
    teaser: {
      height: config.teaserHeight,
      width: config.teaserWidth
    }
  },
  performance: {
    image: {
      height: config.imageHeight,
      width: config.imageWidth
    },
    teaser: {
      height: config.teaserHeight,
      width: config.teaserWidth
    }
  }
};

module.exports.resize = (assetId, params, done) => {
  Asset.findById(assetId, (err, asset) => {
    const scaledFilename = `${uuid.v4()}.jpg`;
    console.log('resize ' + JSON.stringify(asset.image.filename) + ' to ' + scaledFilename);
    sharp(`${process.env.STORAGE}${asset.image.filename}`)
    .resize(params.width, params.height)
    .toFile(`${process.env.STORAGE}${scaledFilename}`, (err, info) => {
      if (err) {
        console.log('resize ERROR' + JSON.stringify(err));
      }
      assetUtil.createScaledAsset({
        mimetype: 'image/jpeg',
        filename: scaledFilename,
        origin: assetId,
        size: info.size
      }, done);
    });
  });
};
