const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const i18n = require('../../plugins/i18n');

router.get('/', (req, res) => {
  User.find({})
  .limit(90)
  .populate([{
    path: 'image',
    model: 'Asset'
  }])
  .exec((err, data) => {
    res.render('performers/list', {
      title: i18n.__('Performers'),
      data: data
    });
  });
});

module.exports = router;
