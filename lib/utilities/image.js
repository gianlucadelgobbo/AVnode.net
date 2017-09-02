const mongoose = require('mongoose');
const Asset = mongoose.model('Asset');

const assetUtil = require('./asset');
const uuid = require('uuid');
const sharp = require('sharp');

module.exports.sizes = {
  user: {
    profile: {
      height: 200,
      width: 512
    },
    teaser: {
      height: 400,
      width: 1920
    }
  },
  crew: {
    image: {
      height: 200,
      width: 512
    },
    teaser: {
      height: 400,
      width: 1920
    }
  },
  event: {
    image: {
      height: 200,
      width: 512
    },
    teaser: {
      height: 400,
      width: 1920
    }
  },
  performance: {
    image: {
      height: 200,
      width: 512
    },
    teaser: {
      height: 400,
      width: 1920
    }
  }
};

module.exports.resize = (assetId, params, done) => {
  Asset.findById(assetId, (err, asset) => {
    const scaledFilename = `${uuid.v4()}.jpeg`;
    sharp(`${process.env.STORAGE}${asset.image.filename}`)
    .resize(params.width, params.height)
    .toFile(`${process.env.STORAGE}${scaledFilename}`, (err, info) => {
      if (err) {
        throw err;
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
