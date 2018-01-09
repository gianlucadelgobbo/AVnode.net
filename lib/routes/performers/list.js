const router = require('../router')();
const logger = require('../../utilities/logger');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const i18n = require('../../plugins/i18n');

router.get('/', (req, res) => {
  logger.debug('LIST');
  User.find({})
  .populate([{
    path: 'image',
    model: 'Asset'
  }])
  .limit(5)
  .exec((err, data) => {
    res.render('performers/list', {
      title: i18n.__('Performers'),
      data: data
    });
  });
});

module.exports = router;