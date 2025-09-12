import {fileTypeFromFile} from 'file-type';
import sharp from 'sharp';
import fs from 'fs';
import { logger, requestLogger, errorLogger } from './logger.js';
let counter = 0;
let counterresizes = 0;
import sizeOf from 'image-size';

const image = {};

// Constants
const BLACK_BACKGROUND = { r: 0, g: 0, b: 0, alpha: 1 };

image.resizer = (files, options, done) => {
  logger.info('resizerresizerresizerresizerresizerresizerresizerresizerresizer');
  let sizesA = [];
  for (let item in options.sizes) sizesA.push(options.sizes[item]);
  var promises = [];
  for (let a=0; a<files.length; a++) {
    promises.push(image.resize(files[a], sizesA));
  }
  Promise.all(
    promises
  ).then( (resultsPromise) => {
    logger.info('resultsPromiseaaaaaaaa');
    logger.info(resultsPromise);
    done(resultsPromise);
  })
  .catch(error => {
    done(error);
  });
};

image.checksizer = (files, options, req, done) => {
  logger.info('checksizer');
  let sizesA = [];
  for (let item in options.sizes) sizesA.push(options.sizes[item]);
  var promises = [];
  for (let a=0; a<files.length; a++) {
    promises.push(image.checksize(files[a], sizesA, options, req));
  }
  Promise.all(
    promises
  ).then( (resultsPromise) => {
    logger.info('resultsPromise check');
    logger.info(resultsPromise);
    done(resultsPromise);
  })
  .catch(error => {
    done(error);
  });
};

image.resize = (file, sizeA) => {
  var promise = new Promise((resolve, reject) => {
    logger.info('resize');
    logger.info(file);
    const localFileName = file.path.substring(file.path.lastIndexOf('/') + 1); // file.path.jpg this.file.path.file.path.substr(19)
    const localPath = file.path.substring(0, file.path.lastIndexOf('/')).replace('/glacier/', '/warehouse/').replace('_originals/', '/'); // /warehouse/2017/03
    const localPathA = localPath.split('/');
    let checkPath = '/';
    for (let a=1; a<localPathA.length; a++) {
      checkPath += localPathA[a]+'/';
      logger.info(checkPath);
      if (!fs.existsSync(checkPath)) {
        fs.mkdirSync(checkPath);
      }
    }
    logger.info('resize');
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
      logger.info('resize in  ' + file.path);
      logger.info('resize out ' + scaledFilename);
      logger.info(sizeA[a]);
    }
    const resize = size => {
      const resizeOptions = {
        width: size.w,
        height: size.h
      };
      
      if (file.sez === "galleries" && file.height > file.width) {
        logger.info(`Processing vertical image in galleries - Original: ${file.width}x${file.height}`);
        // Se è verticale e siamo in galleries
        if (size.folder === 'small') {
          logger.info(`Small format - Keeping horizontal dimensions: ${size.w}x${size.h}`);
          // Per il formato small, manteniamo le dimensioni orizzontali ma inscriviamo l'immagine
          resizeOptions.fit = 'contain';
          resizeOptions.background = BLACK_BACKGROUND;
        } else {
          logger.info(`Vertical format - Inverting dimensions from ${size.w}x${size.h} to ${size.h}x${size.w}`);
          // Per gli altri formati, invertiamo le dimensioni
          resizeOptions.width = size.h;
          resizeOptions.height = size.w;
          resizeOptions.fit = 'cover';
        }
      }
      
      return sharp(size.in)
        .resize(resizeOptions)
        .toFile(size.out);
    };

    const resizeWebP = size => {
      const resizeOptions = {
        width: size.w,
        height: size.h
      };
      
      if (file.sez === "galleries" && file.height > file.width) {
        // Se è verticale e siamo in galleries
        if (size.folder === 'small') {
          // Per il formato small, manteniamo le dimensioni orizzontali ma inscriviamo l'immagine
          resizeOptions.fit = 'contain';
          resizeOptions.background = BLACK_BACKGROUND;
        } else {
          // Per gli altri formati, invertiamo le dimensioni
          resizeOptions.width = size.h;
          resizeOptions.height = size.w;
          resizeOptions.fit = 'cover';
        }
      }
      
      return sharp(size.in)
        .resize(resizeOptions)
        .webp()
        .toFile(size.outWebP);
    };

    Promise
    .all(sizeA.map(resize))
    .then(() => {
      Promise
      .all(sizeA.map(resizeWebP))
      .then(() => {
        setTimeout(resolve, 100, file);
      }, () => {
        file.err = req.__("FILE_IS_DAMAGED")
        setTimeout(resolve, 100, file);
      });
    }, () => {
      file.err = req.__("FILE_IS_DAMAGED")
      setTimeout(resolve, 100, file);
    });
  });
  return promise
};

image.checksize = (file, sizeA, options, req) => {
  var promise = new Promise((resolve, reject) => {
    logger.info('checksize');
    (async () => {
      var format = (await fileTypeFromFile(file.path));
      logger.info("post FileType");
      logger.info(format);
      if (format.mime.indexOf("image")!==-1) {
        logger.info("pre sizeOf");
        const dimensions = sizeOf(file.path);

        file.width = dimensions.width;
        file.height = dimensions.height;
        logger.info(`Image dimensions: ${dimensions.width}x${dimensions.height}`);
        logger.info(`Minimum required: ${options.minwidth}x${options.minheight}`);
        
        var dimensionError = true;
        
        if (req.params.sez == "galleries" && dimensions.height > dimensions.width) {
          logger.info("Vertical image in galleries - Checking inverted dimensions");
          // Se è verticale e siamo in galleries, invertiamo le dimensioni minime
          if (dimensions.width >= options.minheight && dimensions.height >= options.minwidth) {
            dimensionError = false;
            logger.info("Vertical image meets minimum size requirements");
          }
        } else {
          if (dimensions.width >= options.minwidth && dimensions.height >= options.minheight) {
            dimensionError = false;
            logger.info("Image meets minimum size requirements");
          }
        }
        
        if (dimensionError) {
          file.err = req.__("Images minimum size is") + ": " + options.minwidth + " x " + options.minheight;
          logger.info( req.__("Images minimum size is") + ": " + options.minwidth + " x " + options.minheight);
          setTimeout(resolve, 100, file);
        } else {
          setTimeout(resolve, 100, file);
          logger.info("Image minimum size is ok");
        }
      } else {
        file.err = req.__("File is not an image");
        setTimeout(resolve, 100, file);
      }
    })(); 
  });
  return promise
};

export default image;
