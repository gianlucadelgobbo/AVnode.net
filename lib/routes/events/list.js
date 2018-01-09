const router = require('../router')();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const i18n = require('../../plugins/i18n');

router.get('/', (req, res) => {
  Event.find({})
  .limit(90)  
  .populate([{
    path: 'image',
    model: 'Asset'
  }])
  .exec((err, data) => {
    res.render('events/list', {
      title: i18n.__('Events'),
      data: data
    });
  });
});

module.exports = router;
