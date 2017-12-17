const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res, next) => {
  User
  .findOne({slug: req.params.slug})
  .populate([{
    path: 'image',
    model: 'Asset'
  },{
    path: 'teaserImage',
    model: 'Asset'
  },{
    path: 'events',
    model: 'Event',
    populate: [{
      path: 'image',
      model: 'Asset'
    }]
  },{
    path: 'performances',
    model: 'Performance',
    populate: [{
      path: 'image',
      model: 'Asset'
    }]
  }, {
    path: 'crews',
    model: 'Crew',
    populate: [{
      path: 'image',
      model: 'Asset'
    },{
      path: 'members'
    }]
  }])
  .exec((err, performer) => {
    if (err || performer === null) {
      return next(err);
    }
    res.render('performers/show', {
      title: performer.stagename,
      performer: performer
    });
  });
});

module.exports = router;
