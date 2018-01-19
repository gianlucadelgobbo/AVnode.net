const router = require('./router')();

router.post('/', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
