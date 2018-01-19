const router = require('../router')();
const mongoose = require('mongoose');
const Footage = mongoose.model('Footage');

const logger = require('../../utilities/logger');

router.get('/', (req, res, next) => {
  Footage
  .findOne({slug: req.params.slug})
  .exec((err, footage) => {
    if (err || footage === null) {
      console.log('routes/footage/show err:' + err);
      return next(err);
    }
    logger.debug('footage/show');
    res.render('footage/show', {
      title: footage.title,
      footage: footage
    });
  });
});

module.exports = router;
