const router = require('./router')();
const list = require('./events/list');
const show = require('./events/show');

router.use('/:slug', show);
router.use('/', list);

module.exports = router;
