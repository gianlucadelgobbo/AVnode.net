const router = require('../router')();


router.get('/*', (req, res) => {
  res.render('admin/index', {
    title: __('Your Account')
  });
});

module.exports = router;
