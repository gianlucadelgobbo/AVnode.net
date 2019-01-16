const router = require('./router')();
const list = require('./galleries/list');
const show = require('./galleries/show');

router.use('/:slug/img/:img', show);
router.use('/:slug', show);
router.use('/', list);

module.exports = router;
