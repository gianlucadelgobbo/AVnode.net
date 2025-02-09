import createRouter from "../../router.js";
const router = createRouter();

import config from 'getconfig';
import get from './get.js';
import put from './put.js';
import * as post from './post.js';
import ssh from './ssh.js';
import upload from './upload.js';
import { info, debugLog as debug, error } from '../../../utilities/logger.js'; // Logger

// Debugging Route (Only in DEBUG mode)
if (process.env.DEBUG) {
  router.get('/config', (req, res) => {
    res.render('json', { data: config.cpanel });
  });
}

// SSH Routes
router.get('/stream-stop', ssh.streamStop);
router.get('/stream-update-and-restart', ssh.streamUpdateAndRestart);
router.get('/stream-restart', ssh.streamRestart);

// Utilities
router.get('/loggeduser', (req, res) => res.json(req.user));
router.get('/countries', get.getCountries);
router.get('/removeAddress', get.removeAddress);
router.get('/getmembers/:q', get.getMembers);
router.get('/getauthors/:q', get.getAuthors);
router.get('/getperformances/:q', get.getPerformances);
router.get('/getgalleries/:q', get.getGalleries);
router.get('/getvideos/:q', get.getVideos);
router.get('/setstatsandactivity/:id', get.setStatsAndActivity);

// Profile Routes
router.get('/profile/:form', (req, res) => {
  req.params.id = req.user.id;
  req.params.sez = 'profile';
  get.getData(req, res, "json");
});

router.get('/profile/public/slugs/:slug', (req, res) => {
  req.params.id = req.user.id;
  req.params.sez = 'profile';
  get.getSlug(req, res);
});

router.get('/profile/emails/verify/:email', (req, res) => {
  req.params.id = req.user.id;
  req.params.sez = 'profile';
  get.sendEmailVerification(req, res);
});

router.get('/profile/emails/email/:email', get.getEmail);

// Generic GET Routes
router.get('/:sez/:id/delete', get.getDelete);
router.get('/:sez/:id/duplicate', get.getDuplicate);
router.get('/getcategories/:rel/slug/:q', get.getCategories);
router.get('/:sez/new/slugs/:slug', get.getSlug);
router.get('/:sez/:id/public/slugs/:slug', get.getSlug);

// Membership & User Relationships
router.get('/crews/:id/members/add/:member', get.addMember);
router.get('/crews/:id/members/remove/:member', get.removeMember);
router.get('/:sez/:id/users/add/:user', get.addUser);
router.get('/:sez/:id/users/remove/:user', get.removeUser);

// Gallery & Media Management
router.get('/galleries/:id/mediaremove/:image', (req, res) => {
  req.params.sez = 'galleries';
  get.removeImage(req, res);
});
router.get('/playlists/:id/footageremove/:footage', (req, res) => {
  req.params.sez = 'playlists';
  get.removeFootage(req, res);
});

// Event & Performance Management
router.get('/events/:id/getfreezed', get.eventGetFreezed);
router.get('/events/:id/performance/add/:performance', get.eventAddPerformance);
router.get('/events/:id/performance/remove/:performance', get.eventRemovePerformance);
router.get('/performances/:id/event/add/:event', get.performanceAddEvent);
router.get('/performances/:id/event/remove/:event', get.performanceRemoveEvent);

// Media Associations
router.get('/:sez/:id/gallery/add/:gallery', get.addGallery);
router.get('/:sez/:id/gallery/remove/:gallery', get.removeGallery);
router.get('/:sez/:id/video/add/:video', get.addVideo);
router.get('/:sez/:id/video/remove/:video', get.removeVideo);

// Profile & Subscription Routes
router.get('/:sez/:id/:form/', async (req, res) => {
  try {
    if (req.params.sez === "performances" && req.params.form === "public") {
      req.params.rel = "performances";
      
      req.params.q = "type";
      const types = await get.getPerfCategories(req, res);
      config.types = types;

      req.params.q = "genre";
      const genres = await get.getPerfCategories(req, res);
      config.genres = genres;

      get.getData(req, res, "json");
    } else if (req.params.sez === "profile" && req.params.form === "subscriptions") {
      get.getSubscriptions(req, res);
    } else {
      get.getData(req, res, "json");
    }
  } catch (err) {
    error("Error fetching data:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Redirects for Profile & Subscriptions
router.get('/:sez', (req, res) => {
  if (req.params.sez === "profile") {
    res.redirect(`/admin/api/profile/${req.user.id}/public`);
  } else if (req.params.sez === "subscriptions") {
    res.redirect(`/admin/api/subscriptions/${req.user.id}/public`);
  } else {
    req.params.id = req.user.id;
    get.getList(req, res, "json");
  }
});

// Catch-All for 404
router.get('/*', (req, res) => {
  res.status(404).send({ message: "API_NOT_FOUND" });
});

// POST Routes
router.post('/setvideocategory', post.setVideoCategory);
router.post('/reordered', post.setReordered);
router.post('/shareontelegram', post.shareOnTelegram);
router.post('/setvideoexclude', post.setVideoExclude);
router.post('/programupdate', post.updateProgram);
router.post('/subscriptionupdate', post.updateSubscription);
router.post('/cancelsubscription', post.cancelSubscription);
router.post('/editsubscription', post.editSubscription);
router.post('/editsubscriptionprice', post.editSubscriptionPrice);
router.post('/editsubscriptioncost', post.editSubscriptionCost);
router.post('/editsubscriptionsave', post.editSubscriptionSave);
router.post('/bookingrequest', post.bookingRequest);
router.post('/contact', post.contact);
router.post('/:ancestor/:id/:sez/new', post.postData);
router.post('/partnershipsupdate', post.updatePartnerships);
router.post('/partner/unlink/', post.unlinkPartner);
router.post('/partner/link/', post.linkPartner);
router.post('/:sez/new/', post.postData);
router.post('/partners/status/', post.setStatus);
router.post('/partners/categories/', post.setCategories);
router.post('/partners/contacts/add/', post.addContacts);
router.post('/partners/contacts/delete/', post.deleteContacts);
router.post('/profile/emails/updateSendy', post.updateSendy);
router.post('/galleries/:id/medias', upload.galleryAddImages);
router.post('/:sez/:id/image', upload.setImage);
router.post('/:sez/:id/video', upload.setVideo);
router.post('/:sez/:id/:form/', (req, res) => {
  if (req.params.sez === "performances" && req.params.form === "public") {
    req.params.rel = "performances";
    req.params.q = "type";
    get.getPerfCategories(req, res, (types) => {
      config.types = types;
      req.params.q = "genre";
      get.getPerfCategories(req, res, (genres) => {
        config.genres = genres;
        put.putData(req, res, "json");
      });
    });
  } else {
    put.putData(req, res, "json");
  }
});

// Catch-All for 404 on POST
router.post('/*', (req, res) => {
  res.status(404).send({ message: "API_NOT_FOUND" });
});

export default router;
