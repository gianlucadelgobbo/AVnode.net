const router = require('../router')();


router.get('/*', (req, res) => {
  res.render('account/index', {
    title: __('Your Account')
  });
});

module.exports = router;
