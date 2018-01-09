const router = require('../router')();
const logger = require('../../utilities/logger');

const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res, next) => {
  logger.debug('DETAIL');

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
      //return next(err);
      res.status(404).render('404', {});
    } else {
      if (req.query.api) {
        //return next(err);
        res.send(performer);
      } else {
        res.render('performers/show', {
          title: performer.stagename,
          performer: performer
        });  
      }  
    }
   });
});

module.exports = router;