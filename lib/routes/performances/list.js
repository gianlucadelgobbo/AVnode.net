const router = require('../router')();
const mongoose = require('mongoose');
const Performance = mongoose.model('Performance');
const i18n = require('../../plugins/i18n');

router.get('/', (req, res) => {
  Performance.find({})
  .limit(90)  
  .populate([{
    path: 'image',
    model: 'Asset'
  }, {
    path: 'teaserImage',
    model: 'Asset'
  }])
  .exec((err, data) => {
    res.render('performances/list', {
      title: i18n.__('Performances'),
      data: data
    });
  });
});

module.exports = router;
