const config = require('getconfig');
const multer = require('multer');
const uuid = require('uuid');
const mime = require('mime');
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const imageUtil = require('../../../utilities/image');

const logger = require('../../../utilities/logger');

const upload = {};

upload.uploader = (req, res, sez, media, done) => {
  let error = false;
  const options = config.cpanel[sez].media[media];

  logger.debug("uploader");
  logger.debug(options);
  // Set Folder and create if do not exist
  const d = new Date();
  let month = d.getMonth() + 1;
  let serverpath = `${global.appRoot}${options.storage}${d.getFullYear()}/`;

  month = month < 10 ? '0' + month : month;
  logger.debug(serverpath);

  if (!fs.existsSync(serverpath)) {
    logger.debug(fs.mkdirSync(serverpath));
  }
  serverpath += month;
  if (!fs.existsSync(serverpath)) {
    logger.debug(fs.mkdirSync(serverpath));
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, serverpath);
    },
    filename: (req, file, cb) => {
      cb(null, `${uuid.v4()}.${mime.extension(file.mimetype)}`);
    }
  });

  const multerupload = multer({
    dest: options.storage,
    storage: storage,
    limits: {
      fileSize: options.maxsize
    },
    fileFilter: function (req, file, cb) {
      const extnameok = options.filetypes.indexOf(path.extname(file.originalname).toLowerCase().replace('.','')) !== -1;
      let mimetypeok = false;

      for (let filetype in options.filetypes) {
        if (file.mimetype.indexOf(options.filetypes[filetype]) !== -1) {
          mimetypeok = true;
        }
      }

      if (mimetypeok && extnameok) {
        logger.debug('mime ok');
        cb(null, true);
      } else {
        logger.debug(__('File upload only supports the following filetypes') + ': ' + options.filetypes.join(', '));
        cb(__('File upload only supports the following filetypes') + ': ' + options.filetypes.join(', '));
      }
    }
  });
  const up = multerupload.fields([options.fields]);

  up(req, res, (err, r) => {
    if (err) {
      logger.debug('upload err');
      logger.debug(err);
      done(`${__('Upload unknown error')}: ${err}`, req.files);
    } else if (options.fields.name === 'image' && req.files[options.fields.name] && req.files[options.fields.name].length) {
      let conta = 0;

      for (let a = 0; a < req.files[options.fields.name].length; a++) {
        const dimensions = sizeOf(req.files[options.fields.name][a].path);

        req.files[options.fields.name][a].width = dimensions.width;
        req.files[options.fields.name][a].height = dimensions.height;
        logger.debug(req.files[options.fields.name][a]);
        if (dimensions.width > options.minwidth && dimensions.height > options.minheight) {
          error = true;
          req.files[options.fields.name][a].err = __('Images minimum size is') + ': ' + options.minwidth + ' x ' + options.minheight;
          logger.debug(__('Images minimum size is') + ': ' + options.minwidth + ' x ' + options.minheight);
          if (conta === req.files[options.fields.name].length) {
            done(error ? __('There are some errors') : false, req.files);
          }
        } else {
          logger.debug('Image minimum size is ok');
          logger.debug(a);
        }
      }
      if (!error) {
        imageUtil.resizer(req.files[options.fields.name], options, (resizeerr, info) => {
          conta++;
          if (resizeerr || !info) {
            if (resizeerr) {
              error = true;
              logger.debug(`Image resize ERROR: ${resizeerr}`);
              req.files[options.fields.name][a].err = `Image resize ERROR: ${resizeerr}`;
            }
            if (!info) {
              error = true;
              logger.debug('Image resize ERROR: info undefined');
              req.files[options.fields.name][a].err = 'Image resize ERROR: info undefined';
            }
          }
          if (conta === req.files[options.fields.name].length) {
            if (error) {
              done(__('There are some errors'), req.files);
            } else {
              done(error, req.files);
            }
          }
        });
      } else {
        done(__('There are some errors'), req.files);
      }
    } else {
      done(__('Missing upload config'), req.files);
    }
  });
};

/* C
const checkImageFile = (file, apiCall) => {
  let valid = true;
  if (file.size > config.maxImageSize) {
    errorMessage = `${apiCall} file too large`;
    logger.debug(errorMessage);
    valid = false;
  }
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
    errorMessage = `${apiCall} Only image files are allowed ${file.originalname}`;
    logger.debug(errorMessage);
    valid = false;
  }
  return valid;
};
*/
module.exports = upload;