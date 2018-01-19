const router = require('../router')();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
// const User = mongoose.model('User');

router.get('/', (req, res, next) => {
  Event
  .findOne({slug: req.params.slug})
  .exec((err, event) => {
    if (err || event === null) {
      console.log('routes/events/show err:' + err);
      return next(err);
    }
    res.render('events/show', {
      title: event.title,
      event: event
    });
  });
});

module.exports = router;
