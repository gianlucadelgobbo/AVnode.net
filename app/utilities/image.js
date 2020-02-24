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

image.resizerPromise = (file, options) => {
  logger.debug('resizerPromise');
  let sizesA = [];
  for (let item in options.sizes) sizesA.push(options.sizes[item]);
  logger.debug(sizesA);
  counterresizes = 0;

    image.resize(file, sizesA, (resizeActErr, info) => {
      return new Promise(function (resolve, reject) {
        setTimeout(function() {
          logger.debug('resultsPromise11');
          logger.debug(resultsPromise);
          resolve(resultsPromise);
        }, 1000);
    });
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
  logger.debug(file);
  const localFileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
  const localPath = file.substring(0, file.lastIndexOf('/')).replace('/glacier/', '/warehouse/').replace('_originals/', '/'); // /warehouse/2017/03
  const localPathA = localPath.split('/');
  let checkPath = '/';
  for (let a=1; a<localPathA.length; a++) {
    checkPath += localPathA[a]+'/';
    logger.debug(checkPath);
    if (!fs.existsSync(checkPath)) {
      fs.mkdirSync(checkPath);
    }
  }
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
