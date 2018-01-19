const router = require('./router')();
const confirm = require('./user/confirm');
const search = require('./user/search');

router.use('/confirm', confirm);
router.use('/search', search);

module.exports = router;
