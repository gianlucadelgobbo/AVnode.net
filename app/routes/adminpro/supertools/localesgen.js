const router = require('../../router')();
const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const config = require('getconfig');

const logger = require('../../../utilities/logger');

router.get('/', (req, res) => {
  res.render('adminpro/supertools/localesgen/index', {
    title: 'Locales Generator',
    currentUrl: req.originalUrl,
    script: false
  });
});

module.exports = router;