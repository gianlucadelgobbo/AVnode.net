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

router.putData = (req, res) => {
  logger.debug('putData');
  logger.debug(req.body);
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms[req.params.form]) {
    const id = req.params.id;
    Models[config.cpanel[req.params.sez].model]
    .findById(id, config.cpanel[req.params.sez].forms[req.params.form].select, (err, data) => {
      //, put, {new: true, runValidators: true, select: select}).
      if (!err) {
        if (data) {
          let select = config.cpanel[req.params.sez].forms[req.params.form].select;
          let put = {};
          //for (const item in select) if(req.body[item]) put[item] = req.body[item];
          // db.users.updateOne({slug:'gianlucadelgobbo'},{$unset: {oldpassword:""}});
          logger.debug('Data');
          logger.debug(data);
          logger.debug('select');
          logger.debug(select);
          for (const item in select) if(item in req.body) {
            logger.debug(item);
            if (item == "medias" && data[item] && data[item].length && req.params.form == "medias") {
              put[item] = data[item].concat(req.body[item]);
            } else {
              put[item] = req.body[item];
            }
          }
          logger.debug('putputputputputput');
          logger.debug(put);
          logger.debug('DataDataDataDataDataData');
          logger.debug(data);
          Object.assign(data, put);
          logger.debug('putDataputDataputDataputDataputDataputData');
          logger.debug(data);
          if (data.medias){
            data.stats.img = data.medias.length;
            data.image = data.medias[0];
          }
          if (data.emails){
            if (req.user.name) data.name = req.user.name;
            if (req.user.surname) data.surname = req.user.surname;
            if (req.user.stagename) data.stagename = req.user.stagename;
            if (req.user.addresses && req.user.addresses[0] && req.user.addresses[0].locality) data.addresses = req.user.addresses;
          }
          if (helpers.editable(req, data, id)) {
            data.save((err) => {
              if (err) {
                res.status(400).json(err);
              } else {
                select = Object.assign(config.cpanel[req.params.sez].forms[req.params.form].select, config.cpanel[req.params.sez].forms[req.params.form].selectaddon);
                let populate = config.cpanel[req.params.sez].forms[req.params.form].populate;
    
                Models[config.cpanel[req.params.sez].model]
                .findById(id)
                .select(select)
                .populate(populate)
                .exec((err, data) => {
                  if (err) {
                    res.status(500).json({ error: `${JSON.stringify(err)}` });
                  } else {
                    if (!data) {
                      res.status(204).json({ error: `DOC_NOT_FOUND` });
                    } else {
                      let send = {_id: data._id};
                      for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) send[item] = data[item];
                      res.json(send);
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
              }
            });
          } else {
            res.status(204).json({ error: `DOC_NOT_OWNED` });
          }

        } else {
          res.status(204).json({ error: `DOC_NOT_FOUND` });
        }
      } else {
        res.status(500).json({ error: `${JSON.stringify(err)}` });
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
  }
}
module.exports = router;
