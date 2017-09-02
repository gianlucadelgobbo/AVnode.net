const router = require('./router')();
const list = require('./performers/list');
const show = require('./performers/show');

router.use('/:slug', show);
router.use('/', list);

module.exports = router;
