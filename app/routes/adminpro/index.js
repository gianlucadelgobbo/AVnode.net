import createRouter from "../router.js";
const router = createRouter();

import config from 'getconfig';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Event = mongoose.model('Event');

import events  from './events/events.js';
import organizations  from './organizations/organizations.js';
import partners  from './partners/partners.js';

import supertools  from './supertools/index.js';
import wpimport  from './supertools/wpimport.js';
import addresses  from './supertools/addresses.js';
import files  from './supertools/files.js';
import emails  from './supertools/emails.js';
import categories  from './supertools/categories.js';
import stats  from './supertools/stats.js';
import localesgen  from './supertools/localesgen.js';
import vjtv  from './vjtv/index.js';
import emailqueue  from './emailqueue/index.js';
import consolidate  from './supertools/consolidate.js';

import { logger, requestLogger, errorLogger } from '../../utilities/logger.js';
//import dataprovider from "../../utilities/dataprovider.js";


if (process.env.DEBUG === true) {
  router.get('/api/config', (req, res) => {
    res.render('json', { data: require('getconfig').cpanel });
  });
}
router.get('/', async (req, res) => {
  if (req.user.is_pro || req.user.is_admin) {
    logger.info('/adminpro');
    let results = {};
    const myids = req.user.crews.concat([req.user._id.toString()]);
    try {
      let data = await Event.
      find({ "users": { $in: myids }, "organizationsettings.call.calls.0": { $exists: true } }).
      //lean().
      select({ title: 1, createdAt: 1 }).
      exec();
      results.events = data;
      if (req.isApi) {
        res.json(results);
      } else {
        res.render('adminpro/home', {
          title: 'Advanced Tools',
          currentUrl: req.originalUrl,

          data: results,
          script: false
        });
      }
    } catch (err){
      logger.info('Some error here /adminpro');
    }
  } else {
    res.render('adminpro/home', {
      title: 'Advanced Tools',
      currentUrl: req.originalUrl,
      script: false
    });
  }
});
router.get('/*', (req, res, next) => {
 if (req.user.is_pro || req.user.is_admin) {
 next();
 } else {
 res.redirect('/adminpro/')
 }
});

router.use('/events', events);
router.use('/organizations', organizations);
router.use('/partners', partners);
router.use('/emailqueue', emailqueue);

router.use('/supertools/consolidate', consolidate);
router.use('/supertools/wpimport', wpimport);
router.use('/supertools/addresses', addresses);
router.use('/supertools/files', files);
router.use('/supertools/emails', emails);
router.use('/supertools/categories', categories);
router.use('/supertools/stats', stats);
router.use('/supertools/localesgen', localesgen);
router.use('/vjtv', vjtv);
router.use('/supertools', supertools);


router.get('/api/*', (req, res) => {
 res.status(404).send({ message: `API_NOT_FOUND` });
});

router.get('/api', (req, res) => {
 res.status(404).send({ message: `API_NOT_FOUND` });
});


router.get('/*', (req, res) => {
 res.status(404).send({ message: `API_NOT_FOUND` });
});


/* router.get('/api/profile/public/slugs/:slug', (req, res)=>{
 req.params.id = req.user._id;
 req.params.sez = 'profile';
 get.getSlug(req, res);
});

router.get('/api/profile/:form/', (req, res) => {
 req.params.id = req.user._id;
 req.params.sez = 'profile';
 dataprovider.getData(req, res);
});
router.put('/api/profile/:form/', (req, res) => {
 req.params.id = req.user._id;
 req.params.sez = 'profile';
 if (['profile/image'].indexOf(req.params.sez+'/'+req.params.form)!== -1) {
 upload.uploader(req, res, (err, data) => {
 if (err) {
 res.status(500).send(err);
 } else {
 for (const item in data) req.body[item] = data[item];
 put.putData(req, res);
 }
 });
 } else {
 put.putData(req, res);
 }
});
router.get('/api/profile/emails/verify/:email', (req, res)=>{
 req.params.id = req.user._id;
 req.params.sez = 'profile';
 get.sendEmailVerification(req, res);
});

router.get('/api/:sez/new/slugs/:slug', (req, res)=>{
 get.getSlug(req, res);
});

router.get('/api/:sez/:id/public/slugs/:slug', (req, res)=>{
 get.getSlug(req, res);
});

router.get('/api/:sez/:id/:form/', (req, res) => {
 dataprovider.getData(req, res);
});

router.put('/api/:sez/:id/:form/', (req, res) => {
 if (['profile/image','crews/image','events/image','performances/image','footage/media','galleries/public','videos/public'].indexOf(req.params.sez+'/'+req.params.form)!== -1) {
 upload.uploader(req, res, (err, data) => {
 if (err) {
 res.status(500).send(err);
 } else {
 for (const item in data) req.body[item] = data[item];
 put.putData(req, res);
 }
 });
 } else {
 put.putData(req, res);
 }
});

router.post('/api/:sez/new/', (req, res) => {
 post.postData(req, res);
});

router.post('/api/:ancestor/:id/:sez/', (req, res) => {
 post.postData(req, res);
});

router.post('/api/performances/:id/videos', (req, res)=>{
 req.params.model = 'Performance';
 get.addVideo(req, res);
});

router.post('/api/performances/:id/galleries', (req, res)=>{
 req.params.model = 'Performance';
 get.addGallery(req, res);
});

router.post('/api/events/:id/videos', (req, res)=>{
 req.params.model = 'Event';
 get.addVideo(req, res);
});

router.post('/api/events/:id/galleries', (req, res)=>{
 req.params.model = 'Event';
 get.addGallery(req, res);
});


router.get('/api/countries', (req, res) => {
 get.getCountries(req, res);
});

router.get('/api/getcategories/:rel/slug/:q', (req, res)=>{
 get.getCategories(req, res);
});

router.get('/api/getmembers/:q', (req, res)=>{
 get.getMembers(req, res);
});

router.get('/api/getauthors/:q', (req, res)=>{
 get.getAuthors(req, res);
});

router.get('/api/removeAddress', (req, res)=>{
 get.removeAddress(req, res);
});

router.get('/api/crews/:id/members/add/:member', (req, res)=>{
 get.addMember(req, res);
});

router.get('/api/crews/:id/members/remove/:member', (req, res)=>{
 get.removeMember(req, res);
});

router.get('/api/:sez/:id/users/add/:user', (req, res)=>{
 get.addUser(req, res);
});

router.get('/api/:sez/:id/users/remove/:user', (req, res)=>{
 get.removeUser(req, res);
});

router.get('/api/:sez', (req, res) => {
 req.params.id = req.user._id;
 get.getList(req, res);
});
 */

export default router;
