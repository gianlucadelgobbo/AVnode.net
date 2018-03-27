const router = require('../router')();
const list = require('./assets/list');
const create = require('./assets/create');

router.use('/create', create);
router.use('/', list);

module.exports = router;
