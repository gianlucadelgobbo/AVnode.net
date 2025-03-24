import createRouter from "../../router.js";
const router = createRouter();

import config from "getconfig";
import helpers from "../../../utilities/helpers.js";

import mongoose from "mongoose";
import { logger } from "../../../utilities/logger.js";
import { setStatsAndActivity, setStatsAndActivitySingle } from "../../../utilities/userstats.js";

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

router.putData = async (req, res, view) => {
  logger.info("putData");
  //logger.info(req.body);

  if (!config.cpanel[req.params.sez] || !config.cpanel[req.params.sez].forms[req.params.form]) {
    return res.status(404).send({ message: `API_NOT_FOUND` });
  }

 /*  if (req.body.mediastr) {
    if (!req.body.medias) req.body.medias = [];
    if (Array.isArray(req.body.mediastr)) {
      for (var item in req.body.mediastr) req.body.medias[item] = JSON.parse(req.body.mediastr[item])
    } else {
      req.body.medias[0] = JSON.parse(req.body.mediastr)
    }
    logger.info(req.body);
    delete req.body.mediastr;
  } */
 
  if (req.body.mediastr) {
    req.body.medias = req.body.medias || [];
    req.body.medias = Array.isArray(req.body.mediastr)
      ? req.body.mediastr.map((item) => JSON.parse(item))
      : [JSON.parse(req.body.mediastr)];
    //logger.info(req.body);
    delete req.body.mediastr;
  }

  const id = req.params.id;
  const model = Models[config.cpanel[req.params.sez].model];

  if (!model) {
    return res.status(400).send({ message: `MODEL_NOT_FOUND` });
  }

  let data;
  try {
    data = await model.findById(id).select(config.cpanel[req.params.sez].forms[req.params.form].select).exec();
    if (!data) {
      logger.info("❌ Document not found");
      if (view == "json") {
        return res.status(404).send({ message: `DOC_NOT_FOUND` });
      } else {
        return res.status(404).render('404', {path: req.originalUrl, title:req.__("404: Page not found"), titleicon:"icon-warning"});
      }  
    }
  } catch (err) {
    logger.error("Error fetching document", err);
    if (view == "json") {
      return res.status(500).send({ message: `${JSON.stringify(err)}` });
    } else {
      for (e in err.errors) err.errors[e].message = req.__(err.errors[e].message)
      req.flash('errors', {msg: `${JSON.stringify(err)}`});
      return res.status(500).render(view, {
        title: view,
        scripts: [],
        currentUrl: req.originalUrl,
        msg_tmp: { message: `${JSON.stringify(err)}` }
      });
    }
  }

  let select = config.cpanel[req.params.sez].forms[req.params.form].select;
  req.body.is_public = req.body.is_public || false;
  if(req.params.sez) req.body.hide_members = req.body.hide_members || false;
  let put = {};
  logger.info('Data putData');
  //logger.info(data);
  //logger.info('Select putData');
  //logger.info(select);
  //logger.info(Object.keys(select));

  for (let key of Object.keys(select)) {
    if (req.body[key] !== undefined) {
      put[key] = req.body[key];
    }
  }
  if (put.schedule && put.schedule.length) {
    for(var s in put.schedule) {
      var tmp = put.schedule[s].starttime.split(" ")[0].split("/").concat(put.schedule[s].starttime.split(" ")[1].split(":"));
      put.schedule[s].starttime = new Date(Date.UTC(tmp[0],tmp[1]-1,tmp[2],tmp[3],tmp[4]));
      var tmp = put.schedule[s].endtime.split(" ")[0].split("/").concat(put.schedule[s].endtime.split(" ")[1].split(":"));
      put.schedule[s].endtime = new Date(Date.UTC(tmp[0],tmp[1]-1,tmp[2],tmp[3],tmp[4]));
    }
  }

/*   if (put.schedule && put.schedule.length) {
    put.schedule = put.schedule.map((s) => ({
      starttime: new Date(Date.UTC(...s.starttime.split(/[/ :]/).map((v, i) => (i === 1 ? v - 1 : v)))),
      endtime: new Date(Date.UTC(...s.endtime.split(/[/ :]/).map((v, i) => (i === 1 ? v - 1 : v)))),
    }));
  } */
  logger.info('putputputputputput');
  //logger.info(put);
  logger.info('DataDataDataDataDataData');
  //logger.info(data);

  Object.assign(data, put);

  if (data.medias?.length) {
    data.medias = req.body.medias;
    data.stats.img = data.medias.length;
    data.image = data.medias[0];
    data.medias.forEach((item)=>{
      if (item && item.imageFormats) delete item.imageFormats
    });
  }
/* if (data.emails){
  if (req.user.name) data.name = req.user.name;
  if (req.user.surname) data.surname = req.user.surname;
  if (req.user.stagename) data.stagename = req.user.stagename;
  if (req.user.addresses && req.user.addresses[0] && req.user.addresses[0].locality) data.addresses = req.user.addresses;
} */
  logger.info('putDataputDataputDataputDataputDataputData');
  //logger.info(data);
  
  if (!helpers.editable(req, data, id)) {
    if (view == "json") {
      return res.status(401).send({ message: `DOC_NOT_OWNED` });
    } else {
      return res.status(401).render('401', {path: req.originalUrl, title:req.__("401: Access to the content is denied"), titleicon:"icon-warning"});
    }
  }
  console.log('title:', data.title);
  console.log('privacy:', data.privacy);
  console.log('terms:', data.terms);
  Object.keys(data._doc).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });
  try {
    await data.save();
    logger.info("✅ Document saved successfully");
  } catch (err) {
    logger.error("Error saving document", err);
    if (view === "json") {
      return res.status(400).send({ message: JSON.stringify(err) });
    } else {
      for (let e in err.errors) err.errors[e].message = req.__(err.errors[e].message);
      req.flash("errors", { msg: err });
      return res.status(400).render(view, {
        title: view,
        scripts: [],
        currentUrl: req.originalUrl,
        countries: ["profile/private"].includes(`${req.params.sez}/${req.params.form}`) ? helpers.getCountries() : undefined,
        languages: ["profile/private"].includes(`${req.params.sez}/${req.params.form}`) ? helpers.getLanguages() : undefined,
        get: req.params,
        err: err,
        data: data,
      });
    }
  }

  let query = { _id: { $in: data.users || [...(data.members || []), data._id] } };

  try {
    await setStatsAndActivity(query);
  } catch (err) {
    logger.error("Error updating stats", err);
  }

  select = Object.assign(config.cpanel[req.params.sez].forms[req.params.form].select, config.cpanel[req.params.sez].forms[req.params.form].selectaddon);
  let populate = config.cpanel[req.params.sez].forms[req.params.form].populate;
  let updatedData
  try {
    updatedData = await model.findById(id).select(select).populate(populate).exec();
    if (!updatedData) {
      logger.error("❌ updatedData is undefined (Document not found)");
      if (view == "json") {
        return res.status(404).send({ message: `DOC_NOT_FOUND` });
      } else {
        return res.status(404).render('404', {path: req.originalUrl, title:req.__("404: Page not found"), titleicon:"icon-warning"});
      }  
    }
  } catch (err) {
    logger.error("Error retrieving updated document", err);
    logger.error("🔥 Error retrieving updated document", {
      message: err.message,
      stack: err.stack,
    });
    if (view == "json") {
      return res.status(500).send({ message: `${JSON.stringify(err)}` });
    } else {
      for (e in err.errors) err.errors[e].message = req.__(err.errors[e].message)
      req.flash('errors', {msg: `${JSON.stringify(err)}`});
      res.status(500).render(view, {
        title: view,
        scripts: [],
        currentUrl: req.originalUrl,
        countries: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getCountries() : undefined,
        languages: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getLanguages() : undefined,
        msg_tmp: { message: `${JSON.stringify(err)}` }
      });
      return;
    }
  }
  let send = {_id: updatedData._id};
  for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) send[item] = updatedData[item];
  if (view == "json") {
    // TODO: check if is the same file
    if (send.medias) {
      var newmedias = []
      for (var item in req.body.medias) {
        for (var item2 in send.medias) {
          if (req.body.medias[item].file == send.medias[item2].file) {
            req.body.medias[item].imageFormats = send.medias[item2].imageFormats
          }
        }
        newmedias.push(req.body.medias[item])
      }
      send.medias = newmedias;
    }
    return res.json(send);
  } else {
    req.flash('success', {msg: req.__("DATA_SAVED_WITH_SUCCESS")});
    return res.render(view, {
      title: view,
      scripts: [],
      body: req.body,
      currentUrl: req.originalUrl,
      countries: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getCountries() : undefined,
      languages: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getLanguages() : undefined,
      get: req.params,
      msg_tmp: { }, 
      data: send
    });
  }  




};

export default router;
