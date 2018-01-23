const router = require('../router')();
const User = require('../../models/User');
//const Crew = require('../../models/Crew');

router.get('/', (req, res, next) => {
  //Crew
  User.findOne({slug: req.params.slug})
  .populate([{
    path: 'image',
    model: 'Asset'
  }, {
    path: 'teaserImage',
    model: 'Asset'
  }, {
    path: 'members',
    model: 'User',
    populate: [{
      path: 'image',
      model: 'Asset'
    }]
  }])
  .exec((err, crew) => {
    if (err || crew === null) {
      console.log('routes/crews/show err:' + err);
      return next(err);
    }
    res.render('crews/show', {
      title: crew.name,
      crew: crew
    });
  });
});

module.exports = router;
