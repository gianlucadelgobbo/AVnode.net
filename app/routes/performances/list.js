const router = require('../router')();
const mongoose = require('mongoose');
const Performance = mongoose.model('Performance');


router.get('/', (req, res) => {
  Performance.find({})
  .limit(40)  
  .populate([{
    path: 'image',
    model: 'Asset'
  }, {
    path: 'teaserImage',
    model: 'Asset'
  }])
  .exec((err, data) => {
    res.render('performances/list', {
      title: __('Performances'),
      data: data
    });
  });
});

module.exports = router;
