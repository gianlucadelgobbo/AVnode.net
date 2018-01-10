const router = require('./router')();

const api = require('./admin/api');
const index = require('./admin/index');

router.use('/api', api);
router.use('/', index);

module.exports = router;
