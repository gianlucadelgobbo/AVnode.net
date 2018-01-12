const router = require('./router')();

const index = require('./admin/index');

router.use('/', index);

module.exports = router;
