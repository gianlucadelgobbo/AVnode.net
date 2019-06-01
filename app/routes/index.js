const router = require('./router')();

const home = require('./home');
const performers = require('./performers');
const show = require('./performers/show');

const performances = require('./performances');
const events = require('./events');

const footage = require('./footage');
const playlists = require('./playlists');
const videos = require('./videos');
const galleries = require('./galleries');
const news = require('./news');
const api = require('./api');

const login = require('./login');
const logout = require('./logout');
const password = require('./password');
const search = require('./search');
const signup = require('./signup');
const verify = require('./verify');

const likes = require('./likes');

const admin = require('./admin');
const admindev = require('./admindev');

const pages = require('./pages');
const dataprovider = require('../utilities/dataprovider');
const helper = require('../utilities/helper');

const organizations = require('./organizations');

/*
const user = require('./user');
const storage = require('./storage');
const fourOhFour = require('./404');
const crews = require('./crews');
router.get('/__webpack_hmr', function(){});
*/

router.use('/likes', likes);

router.use('/contacts', pages);
router.use('/terms', pages);
router.use('/privacy', pages);
router.use('/cookies-in-use-on-this-site', pages);

// User.find({name: { $regex: '.*' + 'lex' + '.*' }})
router.use('/performers', performers);
router.use('/organizations', organizations);
router.use('/performances', performances);
router.use('/events', events);
router.use('/footage', footage);
router.use('/playlists', playlists);
router.use('/videos', videos);
router.use('/galleries', galleries);
router.use('/news', news);
router.use('/api', api);

router.use('/login', login);
router.use('/flxerlogin', login);
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
router.use('/admindev', admindev);

router.get('/sitemap.xml', (req, res) => {
    let lastmod = new Date();
    lastmod.setHours( lastmod.getHours() -2 );
    lastmod.setMinutes(0);
    lastmod = helper.dateoW3CString(lastmod);
    res.set('Content-Type', 'text/xml');
    res.render('sitemaps/index', {
      pretty: true,
      host: (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/+"://"+req.headers.host,
      data: config.sections,
      lastmod: lastmod
    });
});

router.get('/:section-page-:page-sitemap.xml', (req, res) => {
  const section = req.params.section;
  const Model = require('mongoose').model(config.sections[section].model);
  req.params.sorting = config.sections[section].orders[0];
  req.params.filter = config.sections[section].categories[0];
  dataprovider.list(req, res, section, Model);
});

router.get('/:section-sitemap.xml', (req, res) => {
  const section = req.params.section;
  const Model = require('mongoose').model(config.sections[section].model);
  req.params.page = 1;
  req.params.sorting = config.sections[section].orders[0];
  req.params.filter = config.sections[section].categories[0];
  dataprovider.list(req, res, section, Model);
});

router.use('/:slug', show);

router.use('/', home);

/*
router.use('/user', user);
router.use('/performers', performers);
router.use('/*', fourOhFour);
router.use('/storage', storage);
router.use('/crews', crews);
*/

module.exports = router;