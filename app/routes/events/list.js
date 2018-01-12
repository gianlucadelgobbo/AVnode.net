const router = require('../router')();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');


router.get('/', (req, res) => {
  Event.find({})
  .limit(90)  
  .populate([{
    path: 'image',
    model: 'Asset'
  }])
  .exec((err, data) => {
    res.render('events/list', {
      title: __('Events'),
      data: data
    });
  });
});

module.exports = router;
