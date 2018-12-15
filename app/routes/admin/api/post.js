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

router.postData = (req, res) => {
  logger.debug('postData');
  logger.debug(req.body);
  logger.debug('req.params.sez');
  logger.debug(req.params.sez);
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms.new) {
    let select = config.cpanel[req.params.sez].forms.new.select;
    let selectaddon = config.cpanel[req.params.sez].forms.new.selectaddon;
    let post = {};
    //for (const item in select) if(req.body[item]) post[item] = req.body[item];
    // db.users.updateOne({slug:'gianlucadelgobbo'},{$unset: {oldpassword:""}});
    logger.debug('select');
    logger.debug(select);
    for (const item in select) if(req.body[item]) {
      post[item] = req.body[item];
    }
    for (const item in selectaddon) {
      post[item] = selectaddon[item];
    }
    logger.debug('postpostpostpostpostpost');
    logger.debug(post);
    if (req.params.sez == "crews") {
      post.members = [req.user.id];
    } else {
      post.users = [req.user.id];
    }

    Models[config.cpanel[req.params.sez].model]
    .create(post, (err, data) => {
      if (!err) {
        console.log('create success');
        console.log(data);
        const id = req.user.id;
        logger.debug('req.user.id');
        logger.debug(req.user.id);
        Models['User']
        .findById(id, req.params.sez, (err, user) => {
          logger.debug('findById user');
          logger.debug(user);
          if (!err) {
            if (user) {
              user[req.params.sez].push(data._id);
              logger.debug('save user');
              logger.debug(user);
              user.save((err) => {
                if (err) {
                  console.log('save user err');
                  console.log(err);
                  res.status(400).json(err);
                } else {
                  logger.debug('save user success');
                  res.json(data);
                  /* select = req.query.pure ? config.cpanel[req.params.sez].list.select : Object.assign(config.cpanel[req.params.sez].list.select, config.cpanel[req.params.sez].list.selectaddon);
                  const populate = req.query.pure ? [] : config.cpanel[req.params.sez].list.populate;
                    
                  Models[config.cpanel[req.params.sez].list.model]
                  .findById(id)
                  .select(select)
                  .populate(populate)
                  .exec((err, data) => {
                    if (err) {
                      res.status(500).json({ error: `${JSON.stringify(err)}` });
                    } else {
                      let send = {_id: data._id};
                      for (const item in config.cpanel[req.params.sez].list.select) send[item] = data[item];
                      console.log('sendsendsendsendsendsendsend');
                      console.log(send);
                      res.json(send);
                    }
                  }); */
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
        console.log('create err');
        console.log(err);
        res.status(400).json(err);
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
  }
}

module.exports = router;
