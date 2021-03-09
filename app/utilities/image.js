const sharp = require('sharp');
const fs = require('fs');
const logger = require('./logger');
let counter = 0;
let counterresizes = 0;
const FileType = require('file-type');
const sizeOf = require("image-size");

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
    done(resultsPromise);
  })
  .catch(error => {
    done(error);
  });
};

image.checksizer = (files, options, req, done) => {
  logger.debug('checksizer');
  let sizesA = [];
  for (let item in options.sizes) sizesA.push(options.sizes[item]);
  var promises = [];
  for (let a=0; a<files.length; a++) {
    promises.push(image.checksize(files[a], sizesA, options, req));
  }
  Promise.all(
    promises
  ).then( (resultsPromise) => {
    logger.debug('resultsPromise check');
    logger.debug(resultsPromise);
    done(resultsPromise);
  })
  .catch(error => {
    done(error);
  });
};

image.resize = (file, sizeA) => {
  var promise = new Promise((resolve, reject) => {
    logger.debug('resize');
    logger.debug(file);
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
      const scaledFilenameWebP = `${localPath}/${size.folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.webp`;
      sizeA[a].in = file.path;
      sizeA[a].out = scaledFilename;
      sizeA[a].outWebP = scaledFilenameWebP;
      logger.debug('resize in  ' + file.path);
      logger.debug('resize out ' + scaledFilename);
      logger.debug(sizeA[a]);
    }
    const resize = size => sharp(size.in)
    .resize(size.w, size.h)
    .toFile(size.out);

    const resizeWebP = size => sharp(size.in)
    .resize(size.w, size.h)
    .webp()
    .toFile(size.outWebP);

    Promise
    .all(sizeA.map(resize))
    .then(() => {
      Promise
      .all(sizeA.map(resizeWebP))
      .then(() => {
        setTimeout(resolve, 100, file);
      }, () => {
        file.err = __("FILE_IS_DAMAGED")
        setTimeout(resolve, 100, file);
      });
    }, () => {
      file.err = __("FILE_IS_DAMAGED")
      setTimeout(resolve, 100, file);
    });
  });
  return promise
};

image.checksize = (file, sizeA, options, req) => {
  var promise = new Promise((resolve, reject) => {
    logger.debug('checksize');
    (async () => {
      var format = (await FileType.fromFile(file.path));
      logger.debug("post FileType");
      logger.debug(format);
      if (format.mime.indexOf("image")!==-1) {
        logger.debug("pre sizeOf");
        const dimensions = sizeOf(file.path);

        file.width = dimensions.width;
        file.height = dimensions.height;
        logger.debug(file);
        logger.debug("dimensions.width " + dimensions.width);
        logger.debug("dimensions.height " + dimensions.height);
        logger.debug("options.minwidth " + options.minwidth);
        logger.debug("options.minheight " + options.minheight);
        var dimensionError = true;
        if (dimensions.width >= options.minwidth && dimensions.height >= options.minheight) dimensionError = false;
        if (dimensionError && req.params.sez == "galleries")
          if (dimensions.width >= options.minheight && dimensions.height >= options.minwidth) dimensionError = false;
        if (dimensionError) {
          file.err = __("Images minimum size is") + ": " + options.minwidth + " x " + options.minheight;
          logger.debug( __("Images minimum size is") + ": " + options.minwidth + " x " + options.minheight);
          setTimeout(resolve, 100, file);
        } else {
          setTimeout(resolve, 100, file);
          logger.debug("Image minimum size is ok");
        }
      } else {
        file.err = __("File is not an image");
        setTimeout(resolve, 100, file);
      }
      //=> {ext: 'png', mime: 'image/png'}
    })(); 
  });
  return promise
};

module.exports = image;
