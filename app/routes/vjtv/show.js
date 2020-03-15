const router = require('../router')();
const dataprovider = require('../../utilities/dataprovider');

const Model = require('mongoose').model('Video');

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  res.render('vjtv', {
    title: 'VJTV',
    currentUrl: req.originalUrl,
  });
});

module.exports = router;

