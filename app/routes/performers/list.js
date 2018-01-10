const router = require('../router')();
const logger = require('../../utilities/logger');
const mongoose = require('mongoose');
const User = mongoose.model('User');

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
      title: __('Performers'),
      data: data
    });
  });
});

module.exports = router;