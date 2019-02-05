const router = require('./router')();

router.get('/', (req, res) => {
  req.session.destroy(function (err) {
    req.logout();
    res.redirect(req.get('Referrer'));
  });
});

module.exports = router;
