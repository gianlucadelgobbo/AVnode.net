const router = require('./router')();

const home = require('./home');
const performers = require('./performers');
const show = require('./performers/show');

const performances = require('./performances');
const events = require('./events');

const footage = require('./footage');
const playlists = require('./playlists');
const videos = require('./videos');
const news = require('./news');

const login = require('./login');
const logout = require('./logout');
const password = require('./password');
const search = require('./search');
const signup = require('./signup');
const verify = require('./verify');

const admin = require('./admin');

const pages = require('./pages');
/*
const user = require('./user');
const storage = require('./storage');
const crews = require('./crews');
const fourOhFour = require('./404');
*/
router.get('/__webpack_hmr', function(){});

router.use('/contacts', pages);
router.use('/terms', pages);
router.use('/privacy', pages);

// User.find({name: { $regex: '.*' + 'lex' + '.*' }})
router.use('/performers', performers);
router.use('/performers-sitemap.xml', performers);
router.use('/performances', performances);
router.use('/events', events);
router.use('/footage', footage);
router.use('/playlists', playlists);
router.use('/videos', videos);
router.use('/news', news);

router.use('/login', login);
router.use('/logout', logout);
router.use('/password', password);
router.use('/search', search);
router.use('/signup', signup);
router.use('/admin/api/signup', signup);

router.use('/verify', verify);

/*
router.get('/404', fourOhFour);
*/

router.use('/admin', admin);

router.use('/:slug', show);

router.use('/', home);
/*
router.use('/user', user);
router.use('/performers', performers);
router.use('/storage', storage);
router.use('/crews', crews);
*/

module.exports = router;