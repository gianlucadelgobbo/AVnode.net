import createRouter from "../../router.js";
const router = createRouter();
import config from 'getconfig';
import helpers from './helpers.js';

import mongoose from 'mongoose';

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
import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';


router.putData = (req, res, view) => {
  logger.info("putData");
  logger.info(req.body);
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms[req.params.form]) {
    if (req.body.mediastr) {
      if (!req.body.medias) req.body.medias = [];
      if (Array.isArray(req.body.mediastr)) {
        for (var item in req.body.mediastr) req.body.medias[item] = JSON.parse(req.body.mediastr[item])
      } else {
        req.body.medias[0] = JSON.parse(req.body.mediastr)
      }
      logger.info(req.body);
      delete req.body.mediastr;
    }
    const id = req.params.id;
    Models[config.cpanel[req.params.sez].model]
    .findById(id, config.cpanel[req.params.sez].forms[req.params.form].select, (err, data) => {
      //, put, {new: true, runValidators: true, select: select}).
      if (!err) {
        if (data) {
          let select = config.cpanel[req.params.sez].forms[req.params.form].select;
          //if (select.is_public)
          req.body.is_public = req.body.is_public ? req.body.is_public : false;
          let put = {};
          logger.info('Data');
          logger.info(data);
          logger.info('select');
          logger.info(select);
          logger.info(Object.keys(select));
          const selectkeys = Object.keys(select);
          for(var k in selectkeys) {
            if (req.body[selectkeys[k]]!==undefined) {
              put[selectkeys[k]] = req.body[selectkeys[k]];
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
          logger.info('putputputputputput');
          logger.info(put);
          logger.info('DataDataDataDataDataData');
          logger.info(data);
          Object.assign(data, put);
          if (data.medias && data.medias.length){
            data.medias = req.body.medias
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
          logger.info(data);
          if (helpers.editable(req, data, id)) {
            logger.info('savesavesavesavesavesavesavesave');
            data.save((err) => {
              if (err) {
                if (view == "json") {
                  logger.info(err);
                  logger.info("view");
                  logger.info(view);
                  res.status(400).send({ message: `${JSON.stringify(err)}` });
                } else {
                  for (e in err.errors) err.errors[e].message = __(err.errors[e].message)
                  req.flash('errors', {msg: err});
                  res.status(400).render(view, {
                    title: view,
                    scripts: [],
                    currentUrl: req.originalUrl,
                    countries: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getCountries() : undefined,
                    languages: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getLanguages() : undefined,
                    get: req.params,
                    err: err,
                    data: data
                  });
                }
              } else {
                logger.info('USERS ?');
                logger.info(data.users);
                logger.info('MEMBERS ?');
                logger.info(data.members);
                var inin = []
                if (data.members) {
                  inin = [...data.members]
                  inin.push(data._id)
                }
                var query = {_id: {$in:data.users || inin || data._id}};
                logger.info(query);
                Promise.all(
                  [helpers.setStatsAndActivity(query)]
                ).then( (results) => {
                  select = Object.assign(config.cpanel[req.params.sez].forms[req.params.form].select, config.cpanel[req.params.sez].forms[req.params.form].selectaddon);
                  let populate = config.cpanel[req.params.sez].forms[req.params.form].populate;
      
                  Models[config.cpanel[req.params.sez].model]
                  .findById(id)
                  .select(select)
                  .populate(populate)
                  .exec((err, data) => {
                    if (err) {
                      if (view == "json") {
                        res.status(500).send({ message: `${JSON.stringify(err)}` });
                      } else {
                        for (e in err.errors) err.errors[e].message = __(err.errors[e].message)
                        req.flash('errors', {msg: `${JSON.stringify(err)}`});
                        res.status(500).render(view, {
                          title: view,
                          scripts: [],
                          currentUrl: req.originalUrl,
                          countries: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getCountries() : undefined,
                          languages: (['profile/private'].indexOf(req.params.sez+'/'+req.params.form)!== -1) ? helpers.getLanguages() : undefined,
                          msg_tmp: { message: `${JSON.stringify(err)}` }
                        });
                      }
                    } else {
                      if (!data) {
                        if (view == "json") {
                          res.status(404).send({ message: `DOC_NOT_FOUND` });
                        } else {
                          res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
                        }  
                      } else {
                        let send = {_id: data._id};
                        for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) send[item] = data[item];
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
                          res.json(send);
                        } else {
                          req.flash('success', {msg: __("DATA_SAVED_WITH_SUCCESS")});
                          res.render(view, {
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
                        /* if (data.emails && data.emails.filter(item => item.mailinglists) && data.emails.filter(item => item.mailinglists).length) {
                          router.updateSendy(data, req, (err) => {
                            let send = {_id: data._id};
                            for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) send[item] = data[item];
                            res.json(send);
                          });
                        } else {
                        } */
                      }
                    }
                  });
                });
              }
            });
          } else {
            if (view == "json") {
              res.status(401).send({ message: `DOC_NOT_OWNED` });
            } else {
              res.status(401).render('401', {path: req.originalUrl, title:__("401: Access to the content is denied"), titleicon:"icon-warning"});
            }  
          }

        } else {
          if (view == "json") {
            res.status(404).send({ message: `DOC_NOT_FOUND` });
          } else {
            res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
          }  
        }
      } else {
        if (view == "json") {
          res.status(500).send({ message: `${JSON.stringify(err)}` });
        } else {
          for (e in err.errors) err.errors[e].message = __(err.errors[e].message)
          req.flash('errors', {msg: `${JSON.stringify(err)}`});
          res.status(500).render(view, {
            title: view,
            scripts: [],
            currentUrl: req.originalUrl,
            msg_tmp: { message: `${JSON.stringify(err)}` }
          });
        }
      }
    });
  } else {
    res.status(404).send({ message: `API_NOT_FOUND` });
  }
}
export default router;
