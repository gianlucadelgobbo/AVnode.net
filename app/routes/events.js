const router = require('./router')();
const list = require('./events/list');
const show = require('./events/show');
const participate = require('./events/participate');

router.use('/:slug/participate', participate);
router.use('/:slug', show);
router.use('/', list);

module.exports = router;
