const router = require('../../router')();
const nav = require('../nav');
const subnav = require('./subnav');
const mongoose = require('mongoose');
const Asset = mongoose.model('Asset');

router.get('/', (req, res, next) => {
  Asset
  .find({type: 'video'})
  .exec((err, assets) => {
    if (err) {
      return next(err);
    }
    res.render('admin/assets/list', {
      title: 'Assets',
      subtitle: 'Manage your crews',
      nav: nav,
      navkey: 'assets',
      subnav: subnav,
      path: req.originalUrl,
      assets: assets
    });
  });
});

module.exports = router;
