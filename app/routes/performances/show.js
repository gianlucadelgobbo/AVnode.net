const router = require('../router')();
const mongoose = require('mongoose');
const Performance = mongoose.model('Performance');

router.get('/', (req, res, next) => {
  Performance
  .findOne({slug: req.params.slug})
  /*.populate([{
    path: 'crews',
    model: 'User'
  },{
    path: 'performers',
    model: 'User'
  },{
    path: 'events',
    model: 'Event'
  }])*/
  .exec((err, performance) => {
    if (err || performance === null) {
      console.log('routes/performances/show err:' + err);
      return next(err);
    }
    res.render('performances/show', {
      title: performance.title,
      performance: performance
    });
  });
});

module.exports = router;
