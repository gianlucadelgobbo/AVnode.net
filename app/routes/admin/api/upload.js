import config from "getconfig";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
const setIdentifier = () => {
  return uuidv4();
};

import mime from "mime";
import fs from 'fs';
import path from "path";
import imageUtil from "../../../utilities/image.js";
import progress from 'progress-stream';
import { setStatsAndActivity, setStatsAndActivitySingle } from "../../../utilities/userstats.js";
import { logger, requestLogger, errorLogger } from "../../../utilities/logger.js";


import mongoose from 'mongoose';
const Models = {
  User: mongoose.model("User"),
  Performance: mongoose.model("Performance"),
  Event: mongoose.model("Event"),
  Gallery: mongoose.model("Gallery"),
  News: mongoose.model("News"),
  Video: mongoose.model("Video")
};


const upload = {};

upload.getServerpath = storage => {
  // Set Folder and create if do not exist
  const d = new Date();
  let month = d.getMonth() + 1;
  let serverpath = `${config.appRoot}${storage}${d.getFullYear()}/`;
  month = month < 10 ? "0" + month : month;
  if (!fs.existsSync(serverpath)) fs.mkdirSync(serverpath);
  serverpath += month;
  if (!fs.existsSync(serverpath)) fs.mkdirSync(serverpath);
  return serverpath;
};

upload.uploader = (req, res, options, done) => {
  logger.info("upload.uploader");
  logger.info(req.params.sez);
  logger.info(req.params.form);
  logger.info(req.files);
  logger.info(options.maxsize);
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      logger.info(upload.getServerpath(options.storage));
      cb(null, upload.getServerpath(options.storage));
    },
    filename: (req, file, cb) => {
      cb(null, `${setIdentifier()}.${mime.getExtension(file.mimetype)}`);
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
      logger.info("file.mimetype");
      logger.info(file.mimetype);
      logger.info("options.filetypes");
      logger.info(options.filetypes);
      logger.info(options.filetypes.indexOf(file.mimetype));
      if (mimetypeok && extnameok) {
        logger.info("mime ok");
        cb(null, true);
      } else {
        logger.info( req.__("File upload only supports the following filetypes") + ": " + options.fileext.join(", "));
        const e = [{
          "fieldname":"image",
          "err": req.__("File upload only supports the following filetypes") + ": " + options.fileext.join(", ")
        }];
        cb(e);
      }
    }
  });
  req.pipe(p);
  p.headers = req.headers;
  p.on('progress', (progress) => {
    logger.info('progress:', progress.percentage);
  });

  const up = multerupload.fields([options.fields]);

  up(p, res, (err, r) => {
    logger.info(err);
    logger.info("p.files");
    logger.info(p.files);
    logger.info(options.fields.name);
    done(err, p);

  });
};

upload.setImage = (req, res) => {
  const options = config.cpanel[req.params.sez].forms.public.image.config;
  upload.uploader(req, res, options, (err, p) => {
    logger.info(err);
    logger.info("p.files");
    logger.info(p.files);
    logger.info(options.fields.name);

    // if (err instanceof multer.MulterError) {
    if (err) {
      logger.info("Upload ERROR");
      logger.info(err);
      res.status(500).send(err);
    } else if (p.files && p.files[options.fields.name] && p.files[options.fields.name].length) {
      logger.info("Upload SUCCESS");
      logger.info("checksizer");
      imageUtil.checksizer(
        p.files[options.fields.name],
        options,
        req,
        (files_checked) => {
          logger.info("checksizer 2");
          logger.info(files_checked.map(item => {return item.err ? true : false}));
          //var r = err | files;
          if (files_checked.map(item => {return item.err ? true : false}).indexOf(false)===-1){
            //p.files[options.fields.name] = err.err ? [err] : err;
            logger.info("p.files");
            logger.info(p.files);
            logger.info(files_checked);
            logger.info("ERRORERRORERRORERRORERRORERRORERRORERRORERROR 1");
            res.send(files_checked);
          } else {
            imageUtil.resizer(
              files_checked,
              options,
              async (files_resized) => {
                logger.info(`imageUtil.resizer`);
                logger.info(files_resized);
                logger.info(`imageUtil.resizer end`);
                //logger.info(files.map(item => {return item.err ? true : false}).indexOf(true)!==-1);
                logger.info(files_resized.map(item => {return item.err ? true : false}));

                if (files_resized.map(item => {return item.err ? true : false}).indexOf(true)!==-1) {
                  //var e = {errors:{}}
                  //e.errors[options.fields.name] = err.err ? [err] : err; 
                  logger.info(`stocazzo`);
                  //err = err.err ? [err] : err;
                  res.send(files_resized);
                } else {
                  let put = {};
                  put[options.fields.name] = {
                    file: files_resized[0].path.replace(config.appRoot,""),
                    originalname: files_resized[0].originalname,
                    encoding: files_resized[0].encoding,
                    mimetype: files_resized[0].mimetype,
                    folder: files_resized[0].destination,
                    filename: files_resized[0].filename,
                    size: files_resized[0].size,
                    width: files_resized[0].width,
                    height: files_resized[0].height
                  };
                  logger.info("SALVAAAAAAAAA");
                  //var error = p.files[options.fields.name].map(item => {return item.err ? true : false}).indexOf(true)!==-1;
                  logger.info(put);
                  const id = req.params.id;
                  let doc;
                  let data;
                  try {
                    doc = await Models[config.cpanel[req.params.sez].model]
                    .findOne({_id:id});
                  } catch (err) {
                    return res.status(500).send({ message: `${JSON.stringify(err)}` });
                  }
                  doc[options.fields.name] = put[options.fields.name];
                  try {
                    await doc.save()
                  } catch (err) {
                    return res.status(500).send({ message: `${JSON.stringify(err)}` });
                  }
                  try {
                    data = await Models[config.cpanel[req.params.sez].model]
                    .findById(id, "image")
                    return res.send(data);
                  } catch (err) {
                    return res.status(500).send({ message: `${JSON.stringify(err)}` });
                  }
                }
              }
            , req);
          }
        }
      );
    } else {
      done(true, [{err: "Missing p.files." + options.fields.name}]);
    }
  });
}

upload.setVideo = (req, res) => {
  const options = config.cpanel[req.params.sez].forms.public.media.config;
  upload.uploader(req, res, options, async (err, p) => {
    if (err) {
      logger.info("Upload ERROR", err);
      return res.status(500).send({ message: `${JSON.stringify(err)}` });
    }
    if (!(p.files && p.files[options.fields.name] && p.files[options.fields.name].length)) {
      return res.status(400).send({ message: "Missing file" });
    }
    const put = {};
    put[options.fields.name] = {
      original: p.files[options.fields.name][0].path.replace(config.appRoot, ""),
      originalname: p.files[options.fields.name][0].originalname,
      encoding: 0,
      mimetype: p.files[options.fields.name][0].mimetype,
      filename: p.files[options.fields.name][0].filename,
    };
    logger.info("SALVAAAAAAAAA", put);
    try {
      const doc = await Models[config.cpanel[req.params.sez].model]
        .findOneAndUpdate({ _id: req.params.id }, put, { new: true });
      res.send(doc);
    } catch (e) {
      res.status(500).send({ message: `${JSON.stringify(e)}` });
    }
  });
}

upload.galleryAddImages = async (req, res) => {
//if (helpers.editable(req, data, req.params.id)) {
  const options = config.cpanel.galleries.forms.public.image.config;
  upload.uploader(req, res, options, (err, p) => {
    logger.info(err);
    logger.info("p.files");
    logger.info(p.files);
    logger.info(options.fields.name);

    // if (err instanceof multer.MulterError) {
    if (err) {
      logger.info("Upload ERROR");
      logger.info(err);
      res.status(500).send(err);
    } else if (p.files && p.files[options.fields.name] && p.files[options.fields.name].length) {
      logger.info("Upload SUCCESS");
      logger.info("checksizer");
      imageUtil.checksizer(
        p.files[options.fields.name],
        options,
        req,
        (files_checked) => {
          logger.info("checksizer DONE");
          logger.info(files_checked);
          //var r = err | files;
          if (files_checked.map(item => {return item.err ? true : false}).indexOf(false)===-1){
            //p.files[options.fields.name] = err.err ? [err] : err;
            logger.info("p.files");
            logger.info(p.files);
            logger.info(files_checked);
            logger.info("ERRORERRORERRORERRORERRORERRORERRORERRORERROR 2");
            res.send(files_checked);
          } else {
            imageUtil.resizer(
              files_checked,
              options,
              async (files_resized) => {
                logger.info(`imageUtil.resizer`);
                logger.info(files_resized);
                logger.info(`imageUtil.resizer end`);
                //logger.info(files.map(item => {return item.err ? true : false}).indexOf(true)!==-1);

                /* if (files_resized.map(item => {return item.err ? true : false}).indexOf(true)===-1) {
                  //var e = {errors:{}}
                  //e.errors[options.fields.name] = err.err ? [err] : err; 
                  logger.info(`stocazzo`);
                  //err = err.err ? [err] : err;
                  res.send(files_resized);
                } else { */
                  let put = {};
                  logger.info("galleries/medias");
                  put.medias = [];
                  logger.info("SALVAAAAAAAAA");
                  //var error = p.files[options.fields.name].map(item => {return item.err ? true : false}).indexOf(true)!==-1;
                  logger.info(put);
                  const id = req.params.id;
                  try {
                    const data = await Models.Gallery.findById(id, "medias image");
                    if (data) {
                      if (!data.medias) data.medias = [];
                      for (let a = 0; a < files_resized.length; a++) {
                        if (!files_resized[a].err) {
                          var ins = {
                            file: files_resized[a].path.replace(config.appRoot, ""),
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
                      logger.info('savesavesavesavesavesavesavesave');
                      data.medias.forEach((item)=>{
                        if (item && item.imageFormats) delete item.imageFormats
                      });
                      logger.info(data.medias);
                      try {
                        await data.save();
                        logger.info('USERS ?');
                        logger.info(data.users);
                        var query = {_id: {$in:data.users || data.members}};
                        await setStatsAndActivity(query);
                        const updatedData = await Models.Gallery.findById(id, "medias image");
                        var result = []
                        for (var e=0; e<files_resized.length; e++) {
                          for (var d=0; d<updatedData.medias.length; d++) {
                            if (files_resized[e].path && updatedData.medias[d].file == files_resized[e].path.replace(config.appRoot, "")) {
                              files_resized[e] = updatedData.medias[d];
                            }
                          }
                        }
                        res.json(files_resized);
                      } catch (err) {
                        logger.info(err);
                        logger.info("view");
                        res.status(400).send({ message: `${JSON.stringify(err)}` });
                      }
                    } else {
                      res.status(404).send({ message: `DOC_NOT_FOUND` });
                    }
                  } catch (err) {
                    res.status(500).send({ message: `${JSON.stringify(err)}` });
                  }
              








                //}
              }
            , req);
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

export default upload;
