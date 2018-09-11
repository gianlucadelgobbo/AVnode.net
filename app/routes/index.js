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

const likes = require('./likes');

const admin = require('./admin');

const pages = require('./pages');
const dataprovider = require('../utilities/dataprovider');

/*
const user = require('./user');
const storage = require('./storage');
const crews = require('./crews');
const fourOhFour = require('./404');
*/
router.get('/__webpack_hmr', function(){});

router.use('/likes', likes);

router.use('/contacts', pages);
router.use('/terms', pages);
router.use('/privacy', pages);

// User.find({name: { $regex: '.*' + 'lex' + '.*' }})
router.use('/performers', performers);
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

router.use('/sitemap.xml', home);
router.get('/performances-page-:page-sitemap.xml', (req, res) => {
    const Model = require('mongoose').model('Performance');
    const section = "performances";
    console.log("BINGOOOOOOO");
    req.params.sorting = config.sections[section].orders[0];
    req.params.filter = config.sections[section].categories[0];
    dataprovider.list(req, res, section, Model);
});

router.get('/performances-sitemap.xml', (req, res) => {
    const Model = require('mongoose').model('Performance');
    const section = "performances";
    console.log("BINGOOOOOOO");
    req.params.page = 1;
    req.params.sorting = config.sections[section].orders[0];
    req.params.filter = config.sections[section].categories[0];
    dataprovider.list(req, res, section, Model);
});
/* router.use('/performers-sitemap.xml', performers);
router.use('/performances-sitemap.xml', performances);
router.use('/events-sitemap.xml', events);
router.use('/footage-sitemap.xml', footage);
router.use('/playlists-sitemap.xml', playlists);
router.use('/videos-sitemap.xml', videos);
router.use('/news-sitemap.xml', news);
 */
router.use('/:slug', show);

router.use('/', home);
/*
router.use('/user', user);
router.use('/performers', performers);
router.use('/storage', storage);
router.use('/crews', crews);
*/

module.exports = router;