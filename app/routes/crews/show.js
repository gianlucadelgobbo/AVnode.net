import createRouter from "../router.js";
const router = createRouter();

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
      return next(err);
    }
    res.render('crews/show', {
      title: crew.name,
      crew: crew
    });
  });
});

export default router;
