const router = require('./router')();

const home = require('./home');
const performers = require('./performers');
const show = require('./performers/show');

const performances = require('./performances');
const learnings = require('./learnings');
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
const adminpro = require('./adminpro');

const pages = require('./pages');
const dataprovider = require('../utilities/dataprovider');
const helper = require('../utilities/helper');

const organizations = require('./organizations');
const vjtv = require('./vjtv');

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
router.use('/learnings', learnings);
router.use('/events', events);
router.use('/footage', footage);
router.use('/playlists', playlists);
router.use('/videos', videos);
router.use('/galleries', galleries);
router.use('/news', news);
router.use('/api', api);
router.use('/vjtv', vjtv);

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
router.use('/adminpro', adminpro);

const mongoose = require('mongoose');
const Models = {
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Video': mongoose.model('Video')
}


router.get('/sitemap.xml', (req, res) => {
  Promise.all([
    Models['User'].find(  {"performances.0":{"$exists": true}, "is_public": true}).select("_id updatedAt"),
    Models['User'].find(  {"$or" : [{"partner_owner.owner": "5be8772bfc39610000007065"},{"activity_as_organization" : {"$gt": 0}}], "is_crew" : true, "is_public": true}).select("_id updatedAt"),
    Models['Event'].find( {"is_public": true}).select("_id updatedAt"),
    Models['Performance'].find({"is_public": true, "type": {"$nin":["5be8708afc39610000000099", "5be8708afc396100000001a1", "5be8708afc3961000000011c"]}}).select("_id updatedAt"),
    Models['Performance'].find({"is_public": true, "type": {"$in":["5be8708afc39610000000099", "5be8708afc396100000001a1", "5be8708afc3961000000011c"]}}).select("_id updatedAt"),
    Models['Gallery'].find({"is_public": true}).select("_id updatedAt"),
    Models['Video'].find({"is_public": true}).select("_id updatedAt"),
    Models['News'].find({"is_public": true}).select("_id updatedAt"),
    Models['Footage'].find({"is_public": true}).select("_id updatedAt"),
    Models['Playlist'].find({"is_public": true}).select("_id updatedAt")
  ]).then( ([
    performers,
    organizations,
    events,
    performances,
    learnings,
    galleries,
    videos,
    news,
    footage,
    playlists
  ]) => {
    config.sections.performers.sitemap_pages = Math.ceil(performers.length/config.sections.performers.limit);
    config.sections.organizations.sitemap_pages = Math.ceil(organizations.length/config.sections.organizations.limit);
    config.sections.events.sitemap_pages = Math.ceil(events.length/config.sections.events.limit);
    config.sections.performances.sitemap_pages = Math.ceil(performances.length/config.sections.performances.limit);
    config.sections.learnings.sitemap_pages = Math.ceil(learnings.length/config.sections.learnings.limit);
    config.sections.videos.sitemap_pages = Math.ceil(videos.length/config.sections.videos.limit);
    config.sections.news.sitemap_pages = Math.ceil(news.length/config.sections.news.limit);
    config.sections.footage.sitemap_pages = Math.ceil(footage.length/config.sections.footage.limit);
    config.sections.playlists.sitemap_pages = Math.ceil(playlists.length/config.sections.playlists.limit);
    config.sections.galleries.sitemap_pages = Math.ceil(galleries.length/config.sections.galleries.limit);

    config.sections.performers.lastmod = helper.dateoW3CString(performers.map(item => {return item.updatedAt ? item.updatedAt : item.createdAt ? item.createdAt : new Date("1970-01-01T00:00:00.00Z")}).sort().reverse()[0]);;
    config.sections.organizations.lastmod = helper.dateoW3CString(organizations.map(item => {return item.updatedAt ? item.updatedAt : item.createdAt ? item.createdAt : new Date("1970-01-01T00:00:00.00Z")}).sort().reverse()[0]);;
    config.sections.events.lastmod = helper.dateoW3CString(events.map(item => {return item.updatedAt ? item.updatedAt : item.createdAt ? item.createdAt : new Date("1970-01-01T00:00:00.00Z")}).sort().reverse()[0]);;
    config.sections.performances.lastmod = helper.dateoW3CString(performances.map(item => {return item.updatedAt ? item.updatedAt : item.createdAt ? item.createdAt : new Date("1970-01-01T00:00:00.00Z")}).sort().reverse()[0]);;
    config.sections.learnings.lastmod = helper.dateoW3CString(learnings.map(item => {return item.updatedAt ? item.updatedAt : item.createdAt ? item.createdAt : new Date("1970-01-01T00:00:00.00Z")}).sort().reverse()[0]);;
    config.sections.videos.lastmod = helper.dateoW3CString(videos.map(item => {return item.updatedAt ? item.updatedAt : item.createdAt ? item.createdAt : new Date("1970-01-01T00:00:00.00Z")}).sort().reverse()[0]);;
    config.sections.news.lastmod = helper.dateoW3CString(news.map(item => {return item.updatedAt ? item.updatedAt : item.createdAt ? item.createdAt : new Date("1970-01-01T00:00:00.00Z")}).sort().reverse()[0]);;
    config.sections.footage.lastmod = helper.dateoW3CString(footage.map(item => {return item.updatedAt ? item.updatedAt : item.createdAt ? item.createdAt : new Date("1970-01-01T00:00:00.00Z")}).sort().reverse()[0]);;
    config.sections.playlists.lastmod = helper.dateoW3CString(playlists.map(item => {return item.updatedAt ? item.updatedAt : item.createdAt ? item.createdAt : new Date("1970-01-01T00:00:00.00Z")}).sort().reverse()[0]);;
    config.sections.galleries.lastmod = helper.dateoW3CString(galleries.map(item => {return item.updatedAt ? item.updatedAt : item.createdAt ? item.createdAt : new Date("1970-01-01T00:00:00.00Z")}).sort().reverse()[0]);;

    let lastmod = [];
    lastmod.push(config.sections.performers.lastmod);
    lastmod.push(config.sections.organizations.lastmod);
    lastmod.push(config.sections.events.lastmod);
    lastmod.push(config.sections.performances.lastmod);
    lastmod.push(config.sections.learnings.lastmod);
    lastmod.push(config.sections.videos.lastmod);
    lastmod.push(config.sections.news.lastmod);
    lastmod.push(config.sections.footage.lastmod);
    lastmod.push(config.sections.playlists.lastmod);
    lastmod.push(config.sections.galleries.lastmod);
  
    res.set('Content-Type', 'text/xml');
    res.render('sitemaps/index', {
      pretty: true,
      host: (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/+"://"+req.headers.host,
      data: config.sections,
      lastmod: lastmod.sort().reverse()[0]
    });

  });
});

router.get('/testlocale', (req, res) => {
  res.send('global.getLocale: '+global.getLocale());
});

router.post('/testlocale', (req, res) => {
  res.send('global.getLocale: '+global.getLocale());
});

router.get('/:section-page-:page-sitemap.xml', (req, res) => {
  const section = req.params.section;
  let Model =  undefined;
  if (config.sections[section] && config.sections[section].model) {
    Model = require('mongoose').model(config.sections[section].model);
    req.params.sorting = config.sections[section].orders[0];
    req.params.filter = config.sections[section].categories[0];
  }
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