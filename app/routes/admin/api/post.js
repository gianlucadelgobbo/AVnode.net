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
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms.new) {
    let select = config.cpanel[req.params.sez].forms.new.select;
    let post = {};
    //for (const item in select) if(req.body[item]) post[item] = req.body[item];
    // db.users.update({slug:'gianlucadelgobbo'},{$unset: {oldpassword:""}});
    logger.debug('select');
    logger.debug(select);
    for (const item in select) if(req.body[item]) {
      post[item] = req.body[item];
    }
    logger.debug('postpostpostpostpostpost');
    logger.debug(post);

    Models[config.cpanel[req.params.sez].model]
    .create(post, (err, data) => {
      if (err) {
        console.log('err');
        console.log(err);
        res.status(400).json(err);
      } else {
        logger.debug('DataDataDataDataDataData');
        logger.debug(data);
        res.json(data);
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
  }
}

module.exports = router;
