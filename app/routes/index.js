const router = require('./router')();

const home = require('./home');
const performers = require('./performers');
const performances = require('./performances');
const events = require('./events');

const footage = require('./footage');
const playlists = require('./playlists');
const videos = require('./videos');

const login = require('./login');
const logout = require('./logout');
const password = require('./password');
const search = require('./search');
const signup = require('./signup');

const admin = require('./admin');
/*
const user = require('./user');
const storage = require('./storage');
const crews = require('./crews');
const fourOhFour = require('./404');
*/
router.get('/__webpack_hmr', function(){});

// User.find({name: { $regex: '.*' + 'lex' + '.*' }})
router.use('/performers', performers);
router.use('/performances', performances);
router.use('/events', events);
router.use('/footage', footage);
router.use('/playlists', playlists);
router.use('/videos', videos);

router.use('/login', login);
router.use('/logout', logout);
router.use('/password', password);
router.use('/search', search);
router.use('/signup', signup);
/*
router.get('/404', fourOhFour);
*/

router.use('/admin', admin);
const show = require('./performers/show');

router.use('/:slug', show);

router.use('/', home);
/*
router.use('/user', user);
router.use('/performers', performers);
router.use('/storage', storage);
router.use('/crews', crews);
*/

module.exports = router;