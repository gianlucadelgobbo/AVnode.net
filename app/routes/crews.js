const router = require('./router')();
const list = require('./crews/list');
const show = require('./crews/show');

router.use('/:slug', show);
router.use('/', list);

module.exports = router;
