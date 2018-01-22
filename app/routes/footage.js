const router = require('./router')();
const list = require('./footage/list');
const show = require('./footage/show');

router.use('/:slug', show);
router.use('/', list);

module.exports = router;
