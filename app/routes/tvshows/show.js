const router = require('../router')();
const mongoose = require('mongoose');
const TVShow = mongoose.model('TVShow');

const logger = require('../../utilities/logger');

router.get('/', (req, res, next) => {
  TVShow
  .findOne({slug: req.params.slug})
  .exec((err, tvshow) => {
    if (err || tvshow === null) {
      console.log('routes/tvshows/show err:' + err);
      return next(err);
    }
    logger.debug('tvshows/show');
    res.render('tvshows/show', {
      title: tvshow.title,
      tvshow: tvshow
    });
  });
});

module.exports = router;
