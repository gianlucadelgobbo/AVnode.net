const router = require('../router')();
const i18n = require('../../plugins/i18n');

router.get('/*', (req, res) => {
  res.render('account/index', {
    title: i18n.__('Your Account')
  });
});

module.exports = router;
