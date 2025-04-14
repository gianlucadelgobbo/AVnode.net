import createRouter from "./router.js";
const router = createRouter();

import mongoose from 'mongoose';
import config from 'getconfig';

// Import route handlers
import home from './home.js';
import performersList from './performers/list.js';
import performersShow from './performers/show.js';
import performances from './performances.js';
import learnings from './learnings.js';
import events from './events.js';
import videos from './videos.js';
import galleries from './galleries.js';
import news from './news.js';
import api from './api/index.js';
import login from './login.js';
import logout from './logout.js';
import password from './password.js';
import search from './search.js';
import signup from './signup.js';
import verify from './verify.js';
import admin from './admin/index.js';
import adminpro from './adminpro/index.js';
import pages from './pages.js';
import organizations from './organizations.js';
//import vjtv from './vjtv.js';

// Utilities
import dataprovider from '../utilities/dataprovider.js';
import helpers from '../utilities/helpers.js';


// Route mappings
router.use('/contacts', pages);

router.use('/manifesto', pages);
router.use('/terms-and-conditions', pages);
router.use('/privacy-policy', pages);
router.use('/cookie-policy', pages);
router.use('/model-231', pages);

router.use('/performers', performersList);
router.use('/organizations', organizations);
router.use('/performances', performances);
router.use('/learnings', learnings);
router.use('/events', events);
router.use('/videos', videos);
router.use('/galleries', galleries);
router.use('/news', news);
router.use('/api', api);
//router.use('/vjtv', vjtv);

router.use('/login', login);
router.use('/logout', logout);
router.use('/password', password);
router.use('/search', search);
router.use('/signup', signup);
//router.use('/admin/api/signup', signup);
router.use('/verify', verify);

router.use('/admin', admin);
router.use('/adminpro', adminpro);

// Models for Sitemap
const Models = {
  User: mongoose.model('User'),
  Performance: mongoose.model('Performance'),
  Event: mongoose.model('Event'),
  Gallery: mongoose.model('Gallery'),
  News: mongoose.model('News'),
  Video: mongoose.model('Video')
};

// Test locale route
/* router.get('/testlocale', (req, res) => {
  res.send('global.getLocale: ' + $locals.locale);
});

router.post('/testlocale', (req, res) => {
  res.send('global.getLocale: ' + $locals.locale);
}); */
router.post("/session", (req, res) => {
  //console.log(req.session.user)
  if (req.session && req.session.user) {
    return res.status(200).json({ loggedIn: true, user: req.session.user });
  }
  return res.status(401).json({ loggedIn: false, message: "Not authenticated" });
});
// Generate Sitemap XML
router.get('/sitemap.xml', async (req, res) => {
  try {
    const [
      performers,
      organizations,
      events,
      performances,
      galleries,
      videos,
      news
    ] = await Promise.all([
      Models.User.find({ "performances.0": { "$exists": true }, "is_public": true }).select("_id updatedAt"),
      Models.User.find({ "$or": [{ "partner_owner.owner": "5be8772bfc39610000007065" }, { "activity_as_organization": { "$gt": 0 } }], "is_crew": true, "is_public": true }).select("_id updatedAt"),
      Models.Event.find({ "is_public": true }).select("_id updatedAt"),
      Models.Performance.find({ "is_public": true }).select("_id updatedAt"),
      Models.Gallery.find({ "is_public": true }).select("_id updatedAt"),
      Models.Video.find({ "is_public": true }).select("_id updatedAt"),
      Models.News.find({ "is_public": true }).select("_id updatedAt")
    ]);

    config.sections.performers.sitemap_pages = Math.ceil(performers.length / config.sections.performers.limit);
    config.sections.organizations.sitemap_pages = Math.ceil(organizations.length / config.sections.organizations.limit);
    config.sections.events.sitemap_pages = Math.ceil(events.length / config.sections.events.limit);
    config.sections.performances.sitemap_pages = Math.ceil(performances.length / config.sections.performances.limit);
    config.sections.galleries.sitemap_pages = Math.ceil(galleries.length / config.sections.galleries.limit);
    config.sections.videos.sitemap_pages = Math.ceil(videos.length / config.sections.videos.limit);
    config.sections.news.sitemap_pages = Math.ceil(news.length / config.sections.news.limit);

    const lastmod = [
      helpers.dateoW3CString(performers.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helpers.dateoW3CString(organizations.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helpers.dateoW3CString(events.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helpers.dateoW3CString(performances.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helpers.dateoW3CString(galleries.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helpers.dateoW3CString(videos.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helpers.dateoW3CString(news.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0])
    ];

    res.set('Content-Type', 'text/xml');
    res.render('sitemaps/index', {
      pretty: true,
      host: res.locals.host,
      data: config.sections,
      lastmod: lastmod.sort().reverse()[0]
    });
  } catch (err) {
    console.error("Error generating sitemap:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Dynamic Sitemap Routes
router.get('/:section-page-:page-sitemap.xml', (req, res) => {
  const section = req.params.section;
  if (config.sections[section]?.model) {
    const Model = mongoose.model(config.sections[section].model);
    req.params.sorting = config.sections[section].orders[0];
    req.params.filter = config.sections[section].categories[0];
    dataprovider.list(req, res, section, Model);
  } else {
    res.status(404).send("Section not found");
  }
});

router.get('/:section-sitemap.xml', (req, res) => {
  const section = req.params.section;
  if (config.sections[section]?.model) {
    const Model = mongoose.model(config.sections[section].model);
    req.params.page = 1;
    req.params.sorting = config.sections[section].orders[0];
    req.params.filter = config.sections[section].categories[0];
    dataprovider.list(req, res, section, Model);
  } else {
    res.status(404).send("Section not found");
  }
});

router.use('/:slug', performersShow);
/* router.use('/', home); */

router.use((req, res, next) => {
  if (req.isApi) {
    return home(req, res, next);
  } else {
    return login(req, res, next);
  }
});

// Log all registered routes
/* router.stack.forEach(middleware => {
  if (middleware.route) {
    console.log(`🛤 Registered route: ${middleware.route.path}`);
  }
}); */
export default router;
