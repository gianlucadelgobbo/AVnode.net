const router = require('../router')();
const mongoose = require('mongoose');
const Footage = mongoose.model('Footage');

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  logger.debug('Footage');
  Footage.find({})
  .limit(40)  
  //.populate()
  .exec((err, data) => {
    logger.debug('Footage/list');
    logger.debug(data);
    res.render('footage/list', {
      title: __('Footage'),
      data: data
    });
  });
});

module.exports = router;
