const router = require('./router')();
const show = require('./vjtv/show');

router.use('/', show);

module.exports = router;
