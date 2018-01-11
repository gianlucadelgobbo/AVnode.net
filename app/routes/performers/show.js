const router = require('../router')();
const logger = require('../../utilities/logger');

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
    logger.debug(err);

    if (err || performer === null) {
      //return next(err);
      res.status(404).render('404', {});
    } else {
      if (req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
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