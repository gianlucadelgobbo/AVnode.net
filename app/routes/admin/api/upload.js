const config = require('getconfig');
const multer = require('multer');
const uuid = require('uuid');
const mime = require('mime');
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const imageUtil = require('../../../utilities/image');
 
const mongoose = require('mongoose');
const Models = {
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Video': mongoose.model('Video')
}
const logger = require('../../../utilities/logger');

const upload = {};

upload.getServerpath = (storage) => {
  // Set Folder and create if do not exist
  const d = new Date();
  let month = d.getMonth() + 1;
  let serverpath = `${global.appRoot}${storage}${d.getFullYear()}/`;
  month = month < 10 ? '0' + month : month;
  if (!fs.existsSync(serverpath)) fs.mkdirSync(serverpath);
  serverpath += month;
  if (!fs.existsSync(serverpath)) fs.mkdirSync(serverpath);
  return serverpath;
}

upload.uploader = (req, res, done) => {
  console.log(req.params.sez);
  console.log(req.params.form);
  const options = config.cpanel[req.params.sez].forms[req.params.form].components[req.params.form].config;
  console.log(options.maxsize);
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, upload.getServerpath(options.storage));
    },
    filename: (req, file, cb) => {
      cb(null, `${uuid.v4()}.${mime.getExtension(file.mimetype)}`);
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
      for (let filetype in options.filetypes)
        if (file.mimetype.indexOf(options.filetypes[filetype]) !== -1)
          mimetypeok = true;
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
    error = false;
    console.log("req.files");
    console.log(req.files);
    console.log(options.fields.name);
    
    if (err instanceof multer.MulterError) {
      logger.debug('upload err');
      logger.debug(err);
      done({ errors: {form_error: err} }, null);
    } else if (!options) { // MANCA ELSE
      done({ errors: {form_error: 'UPLOAD_CONFIG_ERROR'} }, null);
    } else if (req.files[options.fields.name] && req.files[options.fields.name].length) { // MANCA ELSE
      let conta = 0;
      /* 
      { errors: {form_error: } }
       */
      for (let a = 0; a < req.files[options.fields.name].length; a++) {
        const dimensions = sizeOf(req.files[options.fields.name][a].path);

        req.files[options.fields.name][a].width = dimensions.width;
        req.files[options.fields.name][a].height = dimensions.height;
        logger.debug(req.files[options.fields.name][a]);
        logger.debug('dimensions.width '+ dimensions.width);
        logger.debug('dimensions.height '+ dimensions.height);
        logger.debug('options.minwidth '+ options.minwidth);
        logger.debug('options.minheight '+ options.minheight);
        if (dimensions.width < options.minwidth || dimensions.height < options.minheight) {
          error = true;
          req.files[options.fields.name][a].err = __('Images minimum size is') + ': ' + options.minwidth + ' x ' + options.minheight;
          logger.debug(__('Images minimum size is') + ': ' + options.minwidth + ' x ' + options.minheight);
        } else {
          logger.debug('Image minimum size is ok');
        }
      }
      if (error) {
        logger.debug('ERRORERRORERRORERRORERRORERRORERRORERRORERROR');
        done({ errors: req.files }, null);
        /* done({
          "message": {
            "message": __('Images minimum size is') + ': ' + options.minwidth + ' x ' + options.minheight,
            "name": "UploadError",
            "stringValue": __('Images minimum size is') + ': ' + options.minwidth + ' x ' + options.minheight,
            "kind":"Date",
            "value":null,
            "path":"image",
            "reason":{
              "message": __('Images minimum size is') + ': ' + options.minwidth + ' x ' + options.minheight,
              "name":"UploadError",
              "stringValue": __('Images minimum size is') + ': ' + options.minwidth + ' x ' + options.minheight,
              "kind":"string",
              "value":null,
              "path":"image"
            }
          }
        }, null); */
      } else {
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
              done({ errors: req.files }, null);
            } else {
              let put = {};
              if (req.files[options.fields.name].length == 1) {
                put[options.fields.name] = {
                  file: req.files[options.fields.name][0].path.replace(global.appRoot, ''),
                  originalname: req.files[options.fields.name][0].originalname,
                  encoding: req.files[options.fields.name][0].encoding,
                  mimetype: req.files[options.fields.name][0].mimetype,
                  folder: req.files[options.fields.name][0].destination,
                  filename: req.files[options.fields.name][0].filename,
                  size: req.files[options.fields.name][0].size,
                  width: req.files[options.fields.name][0].width,
                  height: req.files[options.fields.name][0].height
                };
              } else {
                put[options.fields.name] = [];
                for (let a = 0; a < req.files[options.fields.name].length; a++) {
                  const ins  = {
                    file: req.files[options.fields.name][a].path.replace(global.appRoot, ''),
                    originalname: req.files[options.fields.name][a].originalname,
                    encoding: req.files[options.fields.name][a].encoding,
                    mimetype: req.files[options.fields.name][a].mimetype,
                    folder: req.files[options.fields.name][a].destination,
                    filename: req.files[options.fields.name][a].filename,
                    size: req.files[options.fields.name][a].size,
                    width: req.files[options.fields.name][a].width,
                    height: req.files[options.fields.name][a].height
                  };
                  put[options.fields.name].push(ins);
                }
              }
              logger.debug('SALVAAAAAAAAA');
              done(null, put);          
            }
          }
        });
      }
    } else {
      done({ errors: {form_error: 'Missing req.files.'+options.fields.name} }, null);
    }
  });
};


/* { errors: 
  {
    form_error: 'XXXXXXXXXX',
    FIELDNAME: [
      {
        err: 'XXXXXXXXXX',
        file: "..."
        ...
      }
    ]
  }
} */
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