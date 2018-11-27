const router = require('./router')();
const list = require('./organizations/list');
const show = require('./organizations/show');

router.use('/:slug', show);
router.use('/', list);

module.exports = router;
