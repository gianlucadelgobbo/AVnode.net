const router = require('../../router')();
const nav = require('../nav');
const subnav = require('./subnav');

const assetUtil = require('../../../utilities/asset');

router.get('/', (req, res) => {
  res.render('account/assets/create', {
    title: 'Assets',
    subtitle: 'Manage your crews',
    nav: nav,
    navkey: 'assets',
    subnav: subnav,
    path: req.originalUrl
  });
});

router.post('/', (req, res) => {
  if (req.body.url) {
    assetUtil.create('video', req.body.url, req.user, (err) => {
      if (err) {
        throw err;
      }
      res.redirect('/account/assets');
    });
  }
});

module.exports = router;
