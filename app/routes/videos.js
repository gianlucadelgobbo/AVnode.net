const router = require('./router')();
const list = require('./videos/list');
const show = require('./videos/show');

router.use('/:slug', show);
router.use('/', list);

module.exports = router;
