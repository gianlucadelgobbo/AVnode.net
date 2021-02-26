const sharp = require('sharp');
const fs = require('fs');
const logger = require('./logger');
let counter = 0;
let counterresizes = 0;

const image = {};

image.resizer = (files, options, done) => {
  logger.debug('resizer');
  let sizesA = [];
  for (let item in options.sizes) sizesA.push(options.sizes[item]);
  var promises = [];
  for (let a=0; a<files.length; a++) {
    promises.push(image.resize(files[a], sizesA));
  }
  Promise.all(
    promises
  ).then( (resultsPromise) => {
    logger.debug('resultsPromise');
    logger.debug(resultsPromise);
    done(null, resultsPromise);
  })
  .catch(error => {
    done(error, null);
  });
};

image.resize = (file, sizeA) => {
  var promise = new Promise((resolve, reject) => {
    logger.debug('resize');
    logger.debug(file);
    //if (!file.err) {
      const localFileName = file.path.substring(file.path.lastIndexOf('/') + 1); // file.path.jpg this.file.path.file.path.substr(19)
      const localPath = file.path.substring(0, file.path.lastIndexOf('/')).replace('/glacier/', '/warehouse/').replace('_originals/', '/'); // /warehouse/2017/03
      const localPathA = localPath.split('/');
      let checkPath = '/';
      for (let a=1; a<localPathA.length; a++) {
        checkPath += localPathA[a]+'/';
        logger.debug(checkPath);
        if (!fs.existsSync(checkPath)) {
          fs.mkdirSync(checkPath);
        }
      }
      logger.debug('resize');
      for (var a=0; a<sizeA.length; a++) {
        var size = sizeA[a];
        if (!fs.existsSync(`${localPath}/${size.folder}`)) {
          fs.mkdirSync(`${localPath}/${size.folder}`);
        }
        const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
        const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
        const scaledFilename = `${localPath}/${size.folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
        sizeA[a].in = file.path;
        sizeA[a].out = scaledFilename;
        logger.debug('resize in  ' + file.path);
        logger.debug('resize out ' + scaledFilename);
        logger.debug(sizeA[a]);
      }
      const resize = size => sharp(size.in)
      .resize(size.w, size.h)
      .toFile(size.out);
    
      Promise
      .all(sizeA.map(resize))
      .then(() => {
        console.log('complete');
        setTimeout(resolve, 100, file);
      });
          /* sharp(file.path)
      .resize(size.w, size.h)
      .toFile(scaledFilename, (err, info) => {
        if (err) {
          file.err = err;
        }
        setTimeout(resolve, 100, file);
        //
      });   */

    //}
  });
  return promise
};

module.exports = image;
