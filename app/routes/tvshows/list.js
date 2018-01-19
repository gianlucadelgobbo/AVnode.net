const router = require('../router')();
const mongoose = require('mongoose');
const TVShow = mongoose.model('TVShow');

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  TVShow.find({})
  .limit(40)  
  //.populate()
  .exec((err, data) => {
    logger.debug('tvshows/list');
    res.render('tvshows/list', {
      title: __('TV Shows'),
      data: data
    });
  });
});

module.exports = router;
