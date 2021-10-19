const config = require("getconfig");
const multer = require("multer");
const uuid = require("uuid");
const mime = require("mime");
const fs = require("fs");
const path = require("path");
const imageUtil = require("../../../utilities/image");
const progress = require('progress-stream');
let helpers = require('./helpers');


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

upload.uploader = (req, res, options, done) => {
  logger.debug("upload.uploader");
  logger.debug(req.params.sez);
  logger.debug(req.params.form);
  logger.debug(req.files);
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
        const e = [{
          "fieldname":"image",
          "err": __("File upload only supports the following filetypes") + ": " + options.fileext.join(", ")
        }];
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
    logger.debug(err);
    logger.debug("p.files");
    logger.debug(p.files);
    logger.debug(options.fields.name);
    done(err, p);

    /* // if (err instanceof multer.MulterError) {
    if (err) {
      logger.debug("upload err");
      logger.debug(err);
      done(true, { image: [err] });
    } else if (!options) {
      done(true, { image: [{
        "fieldname":"image",
        "err": "UPLOAD_CONFIG_ERROR"
      }] });
    } else if (p.files && p.files[options.fields.name] && p.files[options.fields.name].length) {

      if (options.filetypes.indexOf("image/jpeg") !== -1) {
        logger.debug("checksizer");
        imageUtil.checksizer(
          p.files[options.fields.name],
          options,
          req,
          (files_checked) => {
            logger.debug("checksizer 2");
            logger.debug(files_checked);
            //var r = err | files;
            if (files_checked.map(item => {return item.err ? true : false}).indexOf(true)!==-1){
              //p.files[options.fields.name] = err.err ? [err] : err;
              logger.debug("p.files");
              logger.debug(p.files);
              logger.debug(files_checked);
              logger.debug("ERRORERRORERRORERRORERRORERRORERRORERRORERROR");
              done(true, files_checked);
            } else {
               imageUtil.resizer(
                files_checked,
                options,
                (files_resized) => {
                  logger.debug(`imageUtil.resizer`);
                  logger.debug(files_resized);
                  logger.debug(`imageUtil.resizer end`);
                  //logger.debug(files.map(item => {return item.err ? true : false}).indexOf(true)!==-1);

                  if (files_resized.map(item => {return item.err ? true : false}).indexOf(true)===-1) {
                    //var e = {errors:{}}
                    //e.errors[options.fields.name] = err.err ? [err] : err; 
                    logger.debug(`stocazzo`);
                    //err = err.err ? [err] : err;
                    done(true, files_resized);
                  } else {
                    let put = {};
                    if (['galleries/medias'].indexOf(req.params.sez+'/'+req.params.form)!== -1) {
                      logger.debug("galleries/medias");
                      put.medias = [];
                      for (let a = 0; a < files_resized.length; a++) {
                        //if (!files_resized[a].err) {
                          var ins = {
                            file: files_resized[a].path.replace(global.appRoot, ""),
                            title: files_resized[a].originalname.substring(0, files_resized[a].originalname.lastIndexOf(".")),
                            slug: files_resized[a].filename.replace(".jpeg", ""),
                            originalname: files_resized[a].originalname,
                            encoding: files_resized[a].encoding,
                            mimetype: files_resized[a].mimetype,
                            folder: files_resized[a].destination,
                            filename: files_resized[a].filename,
                            size: files_resized[a].size,
                            width: files_resized[a].width,
                            height: files_resized[a].height
                          };
                          if (files_resized[a].err) ins.err = files_resized[a].err
                          put.medias.push(ins);
                        //}
                      }
                    } else {
                      if (files_resized.length == 1) {
                        put[options.fields.name] = {
                          file: files_resized[0].path.replace(global.appRoot,""),
                          originalname: files_resized[0].originalname,
                          encoding: files_resized[0].encoding,
                          mimetype: files_resized[0].mimetype,
                          folder: files_resized[0].destination,
                          filename: files_resized[0].filename,
                          size: files_resized[0].size,
                          width: files_resized[0].width,
                          height: files_resized[0].height
                        };
                      } else {
                        logger.debug("E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO ");
                        console.log("E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO E SUCCESSO ");
                        put[options.fields.name] = [];
                        for (let a = 0; a < files_resized.length; a++) {
                          //if (!files_resized[a].err) {
                            var ins = {
                              file: files_resized[a].path.replace(global.appRoot, ""),
                              originalname: files_resized[a].originalname,
                              encoding: files_resized[a].encoding,
                              mimetype: files_resized[a].mimetype,
                              folder: files_resized[a].destination,
                              filename: files_resized[a].filename,
                              size: files_resized[a].size,
                              width: files_resized[a].width,
                              height: files_resized[a].height
                            };
                            if (files_resized[a].err) ins.err = files_resized[a].err
                            put[options.fields.name].push(ins);
                          //}
                        }
                      }
                    }
                    logger.debug("SALVAAAAAAAAA");
                    //var error = p.files[options.fields.name].map(item => {return item.err ? true : false}).indexOf(true)!==-1;
                    logger.debug(put);
                    done(false , put);
                  }
                }
              );
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
        done(error, error ? p.files : put);
      }
    } else {
      done(true, [{err: "Missing p.files." + options.fields.name}]);
    } */
  });
};

upload.setImage = (req, res) => {
  const options = config.cpanel[req.params.sez].forms.image.components.image.config;
  upload.uploader(req, res, options, (err, p) => {
    logger.debug(err);
    logger.debug("p.files");
    logger.debug(p.files);
    logger.debug(options.fields.name);

    // if (err instanceof multer.MulterError) {
    if (err) {
      logger.debug("Upload ERROR");
      logger.debug(err);
      res.status(500).send(err);
    } else if (p.files && p.files[options.fields.name] && p.files[options.fields.name].length) {
      logger.debug("Upload SUCCESS");
      logger.debug("checksizer");
      imageUtil.checksizer(
        p.files[options.fields.name],
        options,
        req,
        (files_checked) => {
          logger.debug("checksizer 2");
          logger.debug(files_checked.map(item => {return item.err ? true : false}));
          //var r = err | files;
          if (files_checked.map(item => {return item.err ? true : false}).indexOf(false)===-1){
            //p.files[options.fields.name] = err.err ? [err] : err;
            logger.debug("p.files");
            logger.debug(p.files);
            logger.debug(files_checked);
            logger.debug("ERRORERRORERRORERRORERRORERRORERRORERRORERROR 1");
            res.send(files_checked);
          } else {
            imageUtil.resizer(
              files_checked,
              options,
              (files_resized) => {
                logger.debug(`imageUtil.resizer`);
                logger.debug(files_resized);
                logger.debug(`imageUtil.resizer end`);
                //logger.debug(files.map(item => {return item.err ? true : false}).indexOf(true)!==-1);
                logger.debug(files_resized.map(item => {return item.err ? true : false}));

                if (files_resized.map(item => {return item.err ? true : false}).indexOf(true)!==-1) {
                  //var e = {errors:{}}
                  //e.errors[options.fields.name] = err.err ? [err] : err; 
                  logger.debug(`stocazzo`);
                  //err = err.err ? [err] : err;
                  res.send(files_resized);
                } else {
                  let put = {};
                  put[options.fields.name] = {
                    file: files_resized[0].path.replace(global.appRoot,""),
                    originalname: files_resized[0].originalname,
                    encoding: files_resized[0].encoding,
                    mimetype: files_resized[0].mimetype,
                    folder: files_resized[0].destination,
                    filename: files_resized[0].filename,
                    size: files_resized[0].size,
                    width: files_resized[0].width,
                    height: files_resized[0].height
                  };
                  logger.debug("SALVAAAAAAAAA");
                  //var error = p.files[options.fields.name].map(item => {return item.err ? true : false}).indexOf(true)!==-1;
                  logger.debug(put);
                  const id = req.params.id;
                  Models[config.cpanel[req.params.sez].model]
                  .findOne({_id:id}, function(err, doc) {
                    doc[options.fields.name] = put[options.fields.name];
                    doc.save((err) => {
                      if (err) {
                        res.status(500).send({ message: `${JSON.stringify(err)}` });
                      } else {
                        Models[config.cpanel[req.params.sez].model]
                        .findById(id, "image", (err, data) => {
                          if (err) {
                            res.status(500).send({ message: `${JSON.stringify(err)}` });
                          } else {
                            res.send(data);
                          }
                        });
                      }
                    });
                  });              
                }
              }
            );
          }
        }
      );
    } else {
      done(true, [{err: "Missing p.files." + options.fields.name}]);
    }
  });
}

upload.setVideo = (req, res) => {
  const options = config.cpanel[req.params.sez].forms.video.components.media.config;
  upload.uploader(req, res, options, (err, p) => {
    logger.debug(err);
    logger.debug("p.files");
    logger.debug(p.files);
    logger.debug(options.fields.name);

    // if (err instanceof multer.MulterError) {
    if (err) {
      logger.debug("Upload ERROR");
      logger.debug(err);
      res.status(500).send({ message: `${JSON.stringify(err)}` });
    } else if (p.files && p.files[options.fields.name] && p.files[options.fields.name].length) {
      let put = {};
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
      logger.debug("SALVAAAAAAAAA");
      logger.debug(put);
      const id = req.params.id;
      Models[config.cpanel[req.params.sez].model]
      .findOneAndUpdate({_id:id}, put, {upsert: false, useFindAndModify: false}, function(err, doc) {
        if (err) {
          res.status(500).send({ message: `${JSON.stringify(err)}` });
        } else {
          res.send(doc);
        }
      });              
    } else {
      done(true, [{err: "Missing p.files." + options.fields.name}]);
    }
  });
}

upload.galleryAddImages = (req, res) => {
//if (helpers.editable(req, data, req.params.id)) {
  //const options = config.cpanel.galleries.forms.medias.components.image.config;
  const options = {
    "fields": {
      "name": "image",
      "maxCount": 100
    },
    "fileext": ["jpg","jpeg","png","gif","svg"],
    "filetypes": ["image/webp","image/jpeg","image/png","image/gif","image/tiff","image/svg+xml"],
    "storage": "/glacier/galleries_originals/",
    "maxsize": 20971520,
    "minwidth": 1280,
    "minheight": 720,
    "sizes": {
      "small": {
        "w": 400,
        "h": 225,
        "folder": "400x225",
        "default": "/images/default-item.svg"
      },
      "large": {
        "w": 1140,
        "h": 641,
        "folder": "1140x641",
        "default": "/images/default-item.svg"
      }
    }
  }
  upload.uploader(req, res, options, (err, p) => {
    logger.debug(err);
    logger.debug("p.files");
    logger.debug(p.files);
    logger.debug(options.fields.name);

    // if (err instanceof multer.MulterError) {
    if (err) {
      logger.debug("Upload ERROR");
      logger.debug(err);
      res.status(500).send(err);
    } else if (p.files && p.files[options.fields.name] && p.files[options.fields.name].length) {
      logger.debug("Upload SUCCESS");
      logger.debug("checksizer");
      imageUtil.checksizer(
        p.files[options.fields.name],
        options,
        req,
        (files_checked) => {
          logger.debug("checksizer DONE");
          logger.debug(files_checked);
          //var r = err | files;
          if (files_checked.map(item => {return item.err ? true : false}).indexOf(false)===-1){
            //p.files[options.fields.name] = err.err ? [err] : err;
            logger.debug("p.files");
            logger.debug(p.files);
            logger.debug(files_checked);
            logger.debug("ERRORERRORERRORERRORERRORERRORERRORERRORERROR 2");
            res.send(files_checked);
          } else {
            imageUtil.resizer(
              files_checked,
              options,
              (files_resized) => {
                logger.debug(`imageUtil.resizer`);
                logger.debug(files_resized);
                logger.debug(`imageUtil.resizer end`);
                //logger.debug(files.map(item => {return item.err ? true : false}).indexOf(true)!==-1);

                /* if (files_resized.map(item => {return item.err ? true : false}).indexOf(true)===-1) {
                  //var e = {errors:{}}
                  //e.errors[options.fields.name] = err.err ? [err] : err; 
                  logger.debug(`stocazzo`);
                  //err = err.err ? [err] : err;
                  res.send(files_resized);
                } else { */
                  let put = {};
                  logger.debug("galleries/medias");
                  put.medias = [];
                  logger.debug("SALVAAAAAAAAA");
                  //var error = p.files[options.fields.name].map(item => {return item.err ? true : false}).indexOf(true)!==-1;
                  logger.debug(put);
                  const id = req.params.id;
                  Models.Gallery
                  .findById(id, "medias image", (err, data) => {
                    //, put, {new: true, runValidators: true, select: select}).
                    if (!err) {
                      if (data) {
                        if (!data.medias) data.medias = [];
                        for (let a = 0; a < files_resized.length; a++) {
                          if (!files_resized[a].err) {
                            var ins = {
                              file: files_resized[a].path.replace(global.appRoot, ""),
                              title: files_resized[a].originalname.substring(0, files_resized[a].originalname.lastIndexOf(".")),
                              slug: files_resized[a].filename.replace(".jpeg", ""),
                              originalname: files_resized[a].originalname,
                              encoding: files_resized[a].encoding,
                              mimetype: files_resized[a].mimetype,
                              folder: files_resized[a].destination,
                              filename: files_resized[a].filename,
                              size: files_resized[a].size,
                              width: files_resized[a].width,
                              height: files_resized[a].height
                            };
                            data.medias.push(ins);
                          }
                        }
                        logger.debug('savesavesavesavesavesavesavesave');
                        data.medias.forEach((item)=>{
                          if (item && item.imageFormats) delete item.imageFormats
                        });
                        logger.debug(data.medias);
                        data.save((err) => {
                          if (err) {
                            logger.debug(err);
                            logger.debug("view");
                            res.status(400).send({ message: `${JSON.stringify(err)}` });
                        } else {
                            logger.debug('USERS ?');
                            logger.debug(data.users);
                            var query = {_id: {$in:data.users || data.members}};
                            Promise.all(
                              [helpers.setStatsAndActivity(query)]
                            ).then( (results) => {
                              Models.Gallery
                              .findById(id, "medias image", (err, data) => {
                                var result = []
                                for (var e=0; e<files_resized.length; e++) {
                                  console.log(files_resized[e])
                                  console.log(files_resized[e].path.replace(global.appRoot, ""))
                                  for (var d=0; d<data.medias.length; d++) {
                                    console.log("data[d].file")
                                    console.log(data.medias[d].file)
                                    if (files_resized[e].path && data.medias[d].file == files_resized[e].path.replace(global.appRoot, "")) {
                                      console.log("trovato")
                                      files_resized[e] = data.medias[d];
                                    }
                                  }

                                }
                                res.json(files_resized);
                              });
                            });
                          }
                        });
              
                      } else {
                        res.status(404).send({ message: `DOC_NOT_FOUND` });
                      }
                    } else {
                      res.status(500).send({ message: `${JSON.stringify(err)}` });
                    }
                  });
              








                //}
              }
            );
          }
        }
      );
    } else {
      done(true, [{err: "Missing p.files." + options.fields.name}]);
    }
  });
/* } else {
  res.status(401).send({ message: `DOC_NOT_OWNED` });
} */
}

module.exports = upload;
