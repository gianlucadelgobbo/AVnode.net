const router = require('./router')();

router.get('/', (req, res) => {
  console.log("LOGOUT LOGOUT LOGOUT LOGOUT LOGOUT LOGOUT ");
  req.session.destroy(function (err) {
    req.logout();
    res.redirect(req.get('Referrer'));
  });
});

module.exports = router;
