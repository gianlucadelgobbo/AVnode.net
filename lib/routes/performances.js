const router = require('./router')();
const list = require('./performances/list');
const show = require('./performances/show');

router.use('/:slug', show);
router.use('/', list);

module.exports = router;
