const router = require('./router')();
const list = require('./tvshows/list');
const show = require('./tvshows/show');

router.use('/:slug', show);
router.use('/', list);

module.exports = router;
