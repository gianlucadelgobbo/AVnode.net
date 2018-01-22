const router = require('./router')();
const list = require('./playlists/list');
const show = require('./playlists/show');

router.use('/:slug', show);
router.use('/', list);

module.exports = router;
