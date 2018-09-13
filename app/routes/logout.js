const router = require('./router')();

router.get('/', (req, res) => {
  req.logout();
  res.redirect(req.get('Referrer'));
});

module.exports = router;
