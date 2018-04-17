const router = require('../../router')();
let config = require('getconfig');

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

router.putData = (req, res) => {
  logger.debug('putData');
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms[req.params.form]) {
    const id = req.params.id;
    
    Models[config.cpanel[req.params.sez].model]
    .findById(id, config.cpanel[req.params.sez].forms[req.params.form].select, (err, data) => {
      //, put, {new: true, runValidators: true, select: select}).
      if (!err) {
        if (data) {
          let select = config.cpanel[req.params.sez].forms[req.params.form].select;
          let put = {};
          for (const item in select) if(req.body[item]) put[item] = req.body[item];
          logger.debug(req.body);
          Object.assign(data, put);
          logger.debug(data);

          data.save((err) => {
            if (err) {
              console.log('err');
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
                  }
                }
              });
            }
          });
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
