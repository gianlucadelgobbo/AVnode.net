const router = require('../router')();

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  res.render('vjtv', {
    title: 'VJTV',
    currentUrl: req.originalUrl
  });
});

module.exports = router;

