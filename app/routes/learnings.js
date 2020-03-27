const router = require('./router')();
const list = require('./learnings/list');
const show = require('./learnings/show');

router.use('/:slug', show);
router.use('/', list);

module.exports = router;
