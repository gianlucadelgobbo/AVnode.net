const sharp = require('sharp');
const fs = require('fs');
const logger = require('./logger');
let counter = 0;
let counterresizes = 0;

const image = {};

image.resizer = (files, options, done) => {
  logger.debug('resizer');

  counter = 0;
  image.resizeAct(files, options, (resizeActErr, info) => {
    done(resizeActErr, info);
  });
};

image.resizeAct = (files, options, done) => {
  logger.debug('resizeAct');
  counterresizes = 0;
  logger.debug(options);
  let sizesA = [];
  for (let item in options.sizes) sizesA.push(options.sizes[item]);

  image.resize(files[counter].path, sizesA, (resizeerr, info) => {
    counter++;
    if (resizeerr) {
      done(resizeerr, info);
    } else {
      if (counter === files.length) {
        done(resizeerr, info);
      } else {
        image.resizeAct(files, options, done);
      }
    }
  });
};

image.resize = (file, sizesA, done) => {
  logger.debug('resize');
  const localFileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
  const localPath = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
  if (!fs.existsSync(`${localPath}/${sizesA[counterresizes].folder}`)) {
    fs.mkdirSync(`${localPath}/${sizesA[counterresizes].folder}`);
  }
  const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
  const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
  const scaledFilename = `${localPath}/${sizesA[counterresizes].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;

  logger.debug('resize in  ' + file);
  logger.debug('resize out ' + scaledFilename);
  logger.debug(sizesA);
  sharp(file)
  .resize(sizesA[counterresizes].w, sizesA[counterresizes].h)
  .toFile(scaledFilename, (err, info) => {
    counterresizes++;
    if (err) {
      done(err, info);
    } else {
      if (counterresizes === sizesA.length) {
        done(err, info);
      } else {
        image.resize(file, sizesA, done);
      }
    }
  });
};

module.exports = image;



/* Z7
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
        console.log('resize ERROR' + err);
        logger.debug(`Image resize ERROR: ${err}`);
        done;
      }
      if (!info) {
        console.log('resize ERROR info undefined');
        logger.debug('Image resize ERROR: info undefined');
        done;
      }
      if (!err && info) {
        assetUtil.createScaledAsset({
          mimetype: 'image/jpeg',
          filename: scaledFilename,
          origin: assetId,
          size: info.size
        }, done);
      }
    });
  });
};
*/