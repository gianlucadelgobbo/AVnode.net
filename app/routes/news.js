const router = require('./router')();
const list = require('./news/list');
const show = require('./news/show');

router.use('/:slug', show);
router.use('/', list);

module.exports = router;
