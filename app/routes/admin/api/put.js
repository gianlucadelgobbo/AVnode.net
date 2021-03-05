const router = require('../../router')();
let config = require('getconfig');
let helpers = require('./helpers');

const mongoose = require('mongoose');
const request = require('request');

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

router.putData = (req, res, view) => {
  logger.debug('putData');
  logger.debug(req.body);
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms[req.params.form]) {
    if (req.body.mediastr) {
      if (!req.body.medias) req.body.medias = [];
      if (Array.isArray(req.body.mediastr)) {
        for (var item in req.body.mediastr) req.body.medias[item] = JSON.parse(req.body.mediastr[item])
      } else {
        req.body.medias[0] = JSON.parse(req.body.mediastr)
      }
      delete req.body.mediastr;
    }
    logger.debug(req.body);
    const id = req.params.id;
    Models[config.cpanel[req.params.sez].model]
    .findById(id, config.cpanel[req.params.sez].forms[req.params.form].select, (err, data) => {
      //, put, {new: true, runValidators: true, select: select}).
      if (!err) {
        if (data) {
          let select = config.cpanel[req.params.sez].forms[req.params.form].select;
          let put = {};
          logger.debug('Data');
          logger.debug(data);
          logger.debug('select');
          logger.debug(select);
          logger.debug('putputputputputput');
          logger.debug(put);
          logger.debug('DataDataDataDataDataData');
          logger.debug(data);
          Object.assign(data, put);
          if (data.medias){
            data.medias = req.body.medias
            data.stats.img = data.medias.length;
            data.image = data.medias[0];
            data.medias.forEach((item)=>{
              if (item && item.imageFormats) delete item.imageFormats
            });
          }
          if (data.emails){
            if (req.user.name) data.name = req.user.name;
            if (req.user.surname) data.surname = req.user.surname;
            if (req.user.stagename) data.stagename = req.user.stagename;
            if (req.user.addresses && req.user.addresses[0] && req.user.addresses[0].locality) data.addresses = req.user.addresses;
          }
          logger.debug('putDataputDataputDataputDataputDataputData');
          logger.debug(data);
          if (helpers.editable(req, data, id)) {
            logger.debug('savesavesavesavesavesavesavesave');
            data.save((err) => {
              if (err) {
                if (view == "json") {
                  logger.debug(err);
                  logger.debug("view");
                  logger.debug(view);
                  res.status(400).send({ message: `${JSON.stringify(err)}` });
                } else {
                  for (e in err.errors) err.errors[e].message = __(err.errors[e].message)
                  req.flash('errors', {msg: `${JSON.stringify(err)}`});
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
                logger.debug('USERS ?');
                logger.debug(data.users);
                logger.debug('MEMBERS ?');
                logger.debug(data.members);
                var query = {_id: {$in:data.users || data.members}};
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
              res.status(404).send({ message: `DOC_NOT_OWNED` });
            } else {
              res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
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
module.exports = router;
