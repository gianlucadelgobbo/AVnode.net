import express from 'express';
import mongoose from 'mongoose';

// Import route handlers
import home from './home.js';
import performers from './performers.js';
import show from './performers/show.js';
import performances from './performances.js';
import learnings from './learnings.js';
import events from './events.js';
import footage from './footage.js';
import playlists from './playlists.js';
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
import likes from './likes.js';
import admin from './admin/index.js';
import adminpro from './adminpro/index.js';
import pages from './pages.js';
import organizations from './organizations.js';
import vjtv from './vjtv.js';

// Utilities
import dataprovider from '../utilities/dataprovider.js';
import helper from '../utilities/helper.js';

const router = express.Router();

// Route mappings
router.use('/likes', likes);
router.use('/contacts', pages);
router.use('/terms', pages);
router.use('/manifesto', pages);
router.use('/privacy', pages);
router.use('/cookies-in-use-on-this-site', pages);

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
router.use('/logout', logout);
router.use('/password', password);
router.use('/search', search);
router.use('/signup', signup);
router.use('/admin/api/signup', signup);
router.use('/verify', verify);

router.use('/admin', admin);
router.use('/adminpro', adminpro);

// Models for Sitemap
const Models = {
  User: mongoose.model('User'),
  Performance: mongoose.model('Performance'),
  Event: mongoose.model('Event'),
  Footage: mongoose.model('Footage'),
  Gallery: mongoose.model('Gallery'),
  News: mongoose.model('News'),
  Playlist: mongoose.model('Playlist'),
  Video: mongoose.model('Video')
};

// Generate Sitemap XML
router.get('/sitemap.xml', async (req, res) => {
  try {
    const [
      performers,
      organizations,
      events,
      performances,
      learnings,
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
      helper.dateoW3CString(performers.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helper.dateoW3CString(organizations.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helper.dateoW3CString(events.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helper.dateoW3CString(performances.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helper.dateoW3CString(galleries.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helper.dateoW3CString(videos.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0]),
      helper.dateoW3CString(news.map(item => item.updatedAt || new Date("1970-01-01T00:00:00.00Z")).sort().reverse()[0])
    ];

    res.set('Content-Type', 'text/xml');
    res.render('sitemaps/index', {
      pretty: true,
      host: (req.get('host') === "localhost:8006" ? "http" : "https") + "://" + req.headers.host,
      data: config.sections,
      lastmod: lastmod.sort().reverse()[0]
    });
  } catch (err) {
    console.error("Error generating sitemap:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Test locale route
router.get('/testlocale', (req, res) => {
  res.send('global.getLocale: ' + global.getLocale());
});

router.post('/testlocale', (req, res) => {
  res.send('global.getLocale: ' + global.getLocale());
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

router.use('/:slug', show);
router.use('/', home);

export default router;
