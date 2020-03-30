const config = require("getconfig");
const multer = require("multer");
const uuid = require("uuid");
const mime = require("mime");
const fs = require("fs");
const path = require("path");
const sizeOf = require("request-image-size");
const imageUtil = require("../../../utilities/image");
const progress = require('progress-stream');

/*
const mongoose = require("mongoose");
 const Models = {
  User: mongoose.model("User"),
  Performance: mongoose.model("Performance"),
  Event: mongoose.model("Event"),
  Footage: mongoose.model("Footage"),
  Gallery: mongoose.model("Gallery"),
  News: mongoose.model("News"),
  Playlist: mongoose.model("Playlist"),
  Video: mongoose.model("Video")
};
*/
const logger = require("../../../utilities/logger");

const upload = {};

upload.getServerpath = storage => {
  // Set Folder and create if do not exist
  const d = new Date();
  let month = d.getMonth() + 1;
  let serverpath = `${global.appRoot}${storage}${d.getFullYear()}/`;
  month = month < 10 ? "0" + month : month;
  if (!fs.existsSync(serverpath)) fs.mkdirSync(serverpath);
  serverpath += month;
  if (!fs.existsSync(serverpath)) fs.mkdirSync(serverpath);
  return serverpath;
};

upload.uploader = (req, res, done) => {
  logger.debug(req.params.sez);
  logger.debug(req.params.form);
  const options = config.cpanel[req.params.sez].forms[req.params.form].components[req.params.comp].config;
  logger.debug(options.maxsize);
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      logger.debug(upload.getServerpath(options.storage));
      cb(null, upload.getServerpath(options.storage));
    },
    filename: (req, file, cb) => {
      cb(null, `${uuid.v4()}.${mime.getExtension(file.mimetype)}`);
    }
  });
  var p = progress();
  const multerupload = multer({
    dest: options.storage,
    storage: storage,
    limits: {
      fileSize: options.maxsize
    },
    fileFilter: function(req, file, cb) {
      const extnameok = options.fileext.indexOf(path.extname(file.originalname).toLowerCase().replace(".", "") ) !== -1;
      const mimetypeok = options.filetypes.indexOf(file.mimetype) !== -1;;
      logger.debug("file.mimetype");
      logger.debug(file.mimetype);
      logger.debug("options.filetypes");
      logger.debug(options.filetypes);
      logger.debug(options.filetypes.indexOf(file.mimetype));
      if (mimetypeok && extnameok) {
        logger.debug("mime ok");
        cb(null, true);
      } else {
        logger.debug( __("File upload only supports the following filetypes") + ": " + options.fileext.join(", "));
        const e = {
          "fieldname":"image",
          "err": __("File upload only supports the following filetypes") + ": " + options.fileext.join(", ")
        };
        cb(e);
      }
    }
  });
  req.pipe(p);
  p.headers = req.headers;
  p.on('progress', (progress) => {
    logger.debug('progress:', progress.percentage);
  });

  const up = multerupload.single(options.fields.name);

  up(p, res, (err, r) => {
    error = false;
    logger.debug(err);
    logger.debug("p.files");
    logger.debug(p.file);
    logger.debug(options.fields.name);

    // if (err instanceof multer.MulterError) {
    if (err) {
      logger.debug("upload err");
      logger.debug(err);
      done({ errors: { form_error: [err] } }, null);
    } else if (!options) {
      done({ errors: { form_error: [{
        "fieldname":"image",
        "err": "UPLOAD_CONFIG_ERROR"
      }] } }, null);
    } else if (p.files && p.files[options.fields.name] && p.files[options.fields.name].length) {
      // MANCA ELSE
      let conta = 0;
      /* 
      { errors: {form_error: } }
       */
      if (options.filetypes.indexOf("image/jpeg") !== -1) {
        
        for (let a = 0; a < p.files[options.fields.name].length; a++) {
          logger.debug("stocazzo1");
          logger.debug(p.files[options.fields.name][a]);
          //if (isImage(p.files[options.fields.name][a].path)) {

            sizeOf(p.files[options.fields.name][a].path)
            .then(dimensions => { 
              logger.debug("stocazzo");
              p.files[options.fields.name][a].width = dimensions.width;
              p.files[options.fields.name][a].height = dimensions.height;
              logger.debug(p.files[options.fields.name][a]);
              logger.debug("dimensions.width " + dimensions.width);
              logger.debug("dimensions.height " + dimensions.height);
              logger.debug("options.minwidth " + options.minwidth);
              logger.debug("options.minheight " + options.minheight);
              if (dimensions.width < options.minwidth || dimensions.height < options.minheight) {
                error = true;
                p.files[options.fields.name][a].err = __("Images minimum size is") + ": " + options.minwidth + " x " + options.minheight;
                logger.debug( __("Images minimum size is") + ": " + options.minwidth + " x " + options.minheight);
              } else {
                logger.debug("Image minimum size is ok");
              }
            })
            .catch(err => {
              logger.debug("stocazzo");
              p.files[options.fields.name][a].err = __("Image file is corrupted");
              error = true;
              //console.error(err);
            });
         /*  } else {  
            logger.debug("stocazzo3");
            p.files[options.fields.name][a].err = __("Image file is corrupted");
            error = true;
          } */
          
          /* p.files[options.fields.name][a].width = dimensions.width;
          p.files[options.fields.name][a].height = dimensions.height;
          logger.debug(p.files[options.fields.name][a]);
          logger.debug("dimensions.width " + dimensions.width);
          logger.debug("dimensions.height " + dimensions.height);
          logger.debug("options.minwidth " + options.minwidth);
          logger.debug("options.minheight " + options.minheight);
          if (dimensions.width < options.minwidth || dimensions.height < options.minheight) {
            error = true;
            p.files[options.fields.name][a].err = __("Images minimum size is") + ": " + options.minwidth + " x " + options.minheight;
            logger.debug( __("Images minimum size is") + ": " + options.minwidth + " x " + options.minheight);
          } else {
            logger.debug("Image minimum size is ok");
          } */
        }
      }
      if (error) {
        logger.debug("ERRORERRORERRORERRORERRORERRORERRORERRORERROR");
        done({ errors: p.files }, null);
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
        if (options.filetypes.indexOf("image/jpeg") !== -1) {
          var promises = [];
          for (var a=0; a<p.files[options.fields.name].length; a++) promises.push(imageUtil.resizerPromise(p.files[options.fields.name][a].path, options));
          Promise.all(
            promises
          ).then( (resultsPromise) => {
            logger.debug("resultsPromise");
            logger.debug(resultsPromise);
          });

          imageUtil.resizer(
            p.files[options.fields.name],
            options,
            (resizeerr, info) => {
              if (resizeerr || !info) {
                if (resizeerr) {
                  error = true;
                  logger.debug(`Image resize ERROR: ${resizeerr}`);
                  p.files[options.fields.name][conta].err = `Image resize ERROR: ${resizeerr}`;
                }
                if (!info) {
                  error = true;
                  logger.debug("Image resize ERROR: info undefined");
                  p.files[options.fields.name][conta].err = "Image resize ERROR: info undefined";
                }
              }
              conta++;
              logger.debug("conta");
              logger.debug(resizeerr);
              logger.debug(p.files[options.fields.name].length);
              if (conta === p.files[options.fields.name].length) {
                if (error) {
                  done({ errors: p.files }, null);
                } else {
                  let put = {};
                  if (['galleries/medias'].indexOf(req.params.sez+'/'+req.params.form)!== -1) {
                    put.medias = [];
                    for (let a = 0; a < p.files[options.fields.name].length; a++) {
                      const ins = {
                        file: p.files[options.fields.name][a].path.replace(global.appRoot, ""),
                        originalname: p.files[options.fields.name][a].originalname,
                        encoding: p.files[options.fields.name][a].encoding,
                        mimetype: p.files[options.fields.name][a].mimetype,
                        folder: p.files[options.fields.name][a].destination,
                        slug: p.files[options.fields.name][a].filename.replace(".jpeg", ""),
                        filename: p.files[options.fields.name][a].filename,
                        size: p.files[options.fields.name][a].size,
                        width: p.files[options.fields.name][a].width,
                        height: p.files[options.fields.name][a].height
                      };
                      put.medias.push(ins);
                    }
                  } else {
                    if (p.files[options.fields.name].length == 1) {
                      put[options.fields.name] = {
                        file: p.files[options.fields.name][0].path.replace(global.appRoot,""),
                        originalname: p.files[options.fields.name][0].originalname,
                        encoding: p.files[options.fields.name][0].encoding,
                        mimetype: p.files[options.fields.name][0].mimetype,
                        folder: p.files[options.fields.name][0].destination,
                        filename: p.files[options.fields.name][0].filename,
                        size: p.files[options.fields.name][0].size,
                        width: p.files[options.fields.name][0].width,
                        height: p.files[options.fields.name][0].height
                      };
                    } else {
                      put[options.fields.name] = [];
                      for (let a = 0; a < p.files[options.fields.name].length; a++) {
                        const ins = {
                          file: p.files[options.fields.name][a].path.replace(global.appRoot, ""),
                          originalname: p.files[options.fields.name][a].originalname,
                          encoding: p.files[options.fields.name][a].encoding,
                          mimetype: p.files[options.fields.name][a].mimetype,
                          folder: p.files[options.fields.name][a].destination,
                          filename: p.files[options.fields.name][a].filename,
                          size: p.files[options.fields.name][a].size,
                          width: p.files[options.fields.name][a].width,
                          height: p.files[options.fields.name][a].height
                        };
                        put[options.fields.name].push(ins);
                      }
                    }
                  }
                  logger.debug("SALVAAAAAAAAA");
                  done(null, put);
                }
              }
            }
          );
        } else {
          let put = {};
          if (p.files[options.fields.name].length == 1) {
            put[options.fields.name] = {
              original: p.files[options.fields.name][0].path.replace(global.appRoot,""),
              originalname: p.files[options.fields.name][0].originalname,
              encoding: 0,
              mimetype: p.files[options.fields.name][0].mimetype,
              //folder: p.files[options.fields.name][0].destination,
              filename: p.files[options.fields.name][0].filename,
              //size: p.files[options.fields.name][0].size,
              //width: p.files[options.fields.name][0].width,
              //height: p.files[options.fields.name][0].height
            };
          } else {
            put[options.fields.name] = [];
            for (let a = 0; a < p.files[options.fields.name].length; a++) {
              const ins = {
                original: p.files[options.fields.name][a].path.replace(global.appRoot, ""),
                originalname: p.files[options.fields.name][a].originalname,
                encoding: 0,
                mimetype: p.files[options.fields.name][a].mimetype,
                //folder: p.files[options.fields.name][a].destination,
                filename: p.files[options.fields.name][a].filename,
                //size: p.files[options.fields.name][a].size,
                //width: p.files[options.fields.name][a].width,
                //height: p.files[options.fields.name][a].height
              };
              put[options.fields.name].push(ins);
            }
          }
          logger.debug("SALVAAAAAAAAA");
          done(null, put);
        }
      }
    } else {
      done({ errors: { form_error: [{err: "Missing p.files." + options.fields.name}] } }, null);
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
