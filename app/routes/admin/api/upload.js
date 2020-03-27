const config = require("getconfig");
const multer = require("multer");
const uuid = require("uuid");
const mime = require("mime");
const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");
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

  const up = multerupload.fields([options.fields]);

  up(p, res, (err, r) => {
    error = false;
    logger.debug(err);
    logger.debug("p.files");
    logger.debug(p.files);
    logger.debug(options.fields.name);

    // if (err instanceof multer.MulterError) {
    if (err) {
      console.log("upload err");
      console.log(err);
      done({ errors: { form_error: [err] } }, null);
    } else if (!options) {
      done({ errors: { form_error: [{
        "fieldname":"image",
        "err": "UPLOAD_CONFIG_ERROR"
      }] } }, null);
    } else if (p.files && p.files[options.fields.name] && p.files[options.fields.name].length) {
      let conta = 0;
      /* 
      { errors: {form_error: } }
       */
      if (options.filetypes.indexOf("image/jpeg") !== -1) {
        for (let a = 0; a < p.files[options.fields.name].length; a++) {
          const dimensions = sizeOf(p.files[options.fields.name][a].path);

          p.files[options.fields.name][a].width = dimensions.width;
          p.files[options.fields.name][a].height = dimensions.height;
          logger.debug(p.files[options.fields.name][a]);
          logger.debug("dimensions.width " + dimensions.width);
          logger.debug("dimensions.height " + dimensions.height);
          logger.debug("options.minwidth " + options.minwidth);
          logger.debug("options.minheight " + options.minheight);
          var dimensionError = true;
          if (dimensions.width >= options.minwidth && dimensions.height >= options.minheight) dimensionError = false;
          if (dimensionError && req.params.sez == "galleries")
            if (dimensions.width >= options.minheight && dimensions.height >= options.minwidth) dimensionError = false;
          if (dimensionError) {
            p.files[options.fields.name][a].err = __("Images minimum size is") + ": " + options.minwidth + " x " + options.minheight;
            if (req.params.sez == "galleries") p.files[options.fields.name][a].err+= " " + __("or") + " " + options.minheight + " x " + options.minwidth;
            logger.debug( __("Images minimum size is") + ": " + options.minwidth + " x " + options.minheight);
          } else {
            logger.debug("Image minimum size is ok");
          }
        }
        error = p.files[options.fields.name].map(item => {return item.err ? true : false}).indexOf(false)===-1;
        logger.debug("ERRORERRORERRORERRORERRORERRORERRORERRORERROR");
        logger.debug(error);
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
          imageUtil.resizer(
            p.files[options.fields.name],
            options,
            (resizeerr, info) => {
              conta++;
              if (resizeerr || !info) {
                if (resizeerr) {
                  error = true;
                  logger.debug(`Image resize ERROR: ${resizeerr}`);
                  p.files[options.fields.name][a].err = `Image resize ERROR: ${resizeerr}`;
                }
                if (!info) {
                  error = true;
                  logger.debug("Image resize ERROR: info undefined");
                  p.files[options.fields.name][a].err = "Image resize ERROR: info undefined";
                }
              }
              if (conta === conta) {
                //error = p.files[options.fields.name].map(item => {return item.err ? true : false}).indexOf(false)===-1;
                if (error) {
                  done({ errors: p.files }, null);
                } else {
                  let put = {};
                  if (['galleries/medias'].indexOf(req.params.sez+'/'+req.params.form)!== -1) {
                    put.medias = [];
                    for (let a = 0; a < p.files[options.fields.name].length; a++) {
                      if (!p.files[options.fields.name][a].err) {
                        const ins = {
                          file: p.files[options.fields.name][a].path.replace(global.appRoot, ""),
                          title: p.files[options.fields.name][a].originalname.substring(0, p.files[options.fields.name][a].originalname.lastIndexOf(".")),
                          slug: p.files[options.fields.name][a].filename.replace(".jpeg", ""),
                          originalname: p.files[options.fields.name][a].originalname,
                          encoding: p.files[options.fields.name][a].encoding,
                          mimetype: p.files[options.fields.name][a].mimetype,
                          folder: p.files[options.fields.name][a].destination,
                          filename: p.files[options.fields.name][a].filename,
                          size: p.files[options.fields.name][a].size,
                          width: p.files[options.fields.name][a].width,
                          height: p.files[options.fields.name][a].height
                        };
                        put.medias.push(ins);
                      }
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
                        if (!p.files[options.fields.name][a].err) {
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
                  }
                  logger.debug("SALVAAAAAAAAA");
                  var error = p.files[options.fields.name].map(item => {return item.err ? true : false}).indexOf(true)!==-1;
                  logger.debug(error);
                  done(error ? p.files : null , put);
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
              if (!p.files[options.fields.name][a].err) {
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
          }
          logger.debug("SALVAAAAAAAAA");
          var error = p.files[options.fields.name].map(item => {return item.err ? true : false}).indexOf(true)!==-1;
          logger.debug(error);
          done(error ? p.files : null , put);
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
