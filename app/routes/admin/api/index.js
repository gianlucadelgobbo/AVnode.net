import createRouter from "../../router.js";
const router = createRouter();


import config from 'getconfig';
import getRoutes from './get.js';
import getUsersRoutes from './getusers.js';
import getMembersRoutes from './getmembers.js';
import getPerformances from './getperformances.js';
import getVideos from './getvideos.js';
import getGalleries from './getgalleries.js';
import deleteRoutes from "./delete.js";
import put from './put.js';
import post from './post.js';
import ssh from './ssh.js';
import upload from './upload.js';
import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js'; // Logger
import { setStatsAndActivity, setStatsAndActivitySingle } from "../../../utilities/userstats.js";
import dataprovider from "../../../utilities/dataprovider.js";

// Debugging Route (Only in DEBUG mode)
if (process.env.DEBUG === true) {
  router.get('/config', (req, res) => {
    res.render('json', { data: config.cpanel });
  });
}

// Event & Performance Management
router.get('/events/:id/getfreezed', async (req, res) => {
  logger.info("getfreezed");

  await dataprovider.freezeEventProgram(req, res);
});

// SSH Routes
router.get('/stream-stop', ssh.streamStop);
router.get('/stream-update-and-restart', ssh.streamUpdateAndRestart);
router.get('/stream-restart', ssh.streamRestart);

// Utilities
//remove router.get('/loggeduser', (req, res) => res.json(req.user));
router.get('/countries', getRoutes.getCountries);
router.get('/setstatsandactivity/:id', setStatsAndActivity);

// Profile Routes
router.get('/profile/:form', (req, res) => {
  req.params.id = req.user._id;
  req.params.sez = 'profile';
  dataprovider.getData(req, res, "json");
});

router.get('/profile/emails/verify/:email', (req, res) => {
  req.params.id = req.user._id;
  req.params.sez = 'profile';
  getRoutes.sendEmailVerification(req, res);
});

//router.get('/profile/emails/email/:email', getRoutes.getEmail);

// Generic GET Routes
router.get('/:sez/:id/delete', deleteRoutes.getDelete);
// TODO router.get('/:sez/:id/duplicate', getRoutes.getDuplicate);
//router.get('/getcategories/:rel/slug/:q', getRoutes.getCategories);
//remove router.get('/:sez/new/slugs/:slug', getRoutes.getSlug);
//remove router.get('/:sez/:id/public/slugs/:slug', getRoutes.getSlug);

// Membership & User Relationships
router.get('/getmembers/:q', getMembersRoutes.getMembers);
router.get('/crews/:id/members/add/:member', getMembersRoutes.addMember);
router.get('/crews/:id/members/remove/:member', getMembersRoutes.removeMember);

router.get('/getauthors/:q', getUsersRoutes.getUsers);
router.get('/:sez/:id/users/add/:user', getUsersRoutes.addUser);
router.get('/:sez/:id/users/remove/:user', getUsersRoutes.removeUser);

///remove  Gallery & Media Management
/* router.get('/galleries/:id/mediaremove/:image', (req, res) => {
  req.params.sez = 'galleries';
  getRoutes.removeImage(req, res);
});
 */


router.get('/getperformances/:q', getPerformances.getPerformances);
router.get('/events/:id/performance/add/:performance', getPerformances.eventAddPerformance);
router.get('/events/:id/performance/remove/:performance', getPerformances.eventRemovePerformance);

//remove router.get('/performances/:id/event/add/:event', getRoutes.performanceAddEvent);
//remove router.get('/performances/:id/event/remove/:event', getRoutes.performanceRemoveEvent);

// Media Associations
router.get('/getgalleries/:q', getGalleries.getGalleries);
router.get('/:sez/:id/gallery/add/:gallery', getGalleries.addGallery);
router.get('/:sez/:id/gallery/remove/:gallery', getGalleries.removeGallery);

router.get('/getvideos/:q', getVideos.getVideos);
router.get('/:sez/:id/video/add/:video', getVideos.addVideo);
router.get('/:sez/:id/video/remove/:video', getVideos.removeVideo);

// Profile & Subscription Routes
router.get('/:sez/:id/:form/', async (req, res) => {
  try {
    if (req.params.sez === "performances" && req.params.form === "public") {
      req.params.rel = "performances";
      
      req.params.q = "type";
      const types = await getRoutes.getPerfCategories(req, res);
      config.types = types;

      req.params.q = "genre";
      const genres = await getRoutes.getPerfCategories(req, res);
      config.genres = genres;
      logger.info("dataprovider.getData:", err);

      dataprovider.getData(req, res, "json");
    } else if (req.params.sez === "profile" && req.params.form === "subscriptions") {
      getRoutes.getSubscriptions(req, res);
    } else {
      dataprovider.getData(req, res, "json");
    }
  } catch (err) {
    error("Error fetching data:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Redirects for Profile & Subscriptions
router.get('/:sez', (req, res) => {
  if (req.params.sez === "profile") {
    res.redirect(`/admin/api/profile/${req.user._id}/public`);
  } else if (req.params.sez === "subscriptions") {
    res.redirect(`/admin/api/subscriptions/${req.user._id}/public`);
  } else {
    req.params.id = req.user._id;
    getRoutes.getList(req, res, "json");
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
router.post('/emailqueue/hide', post.hideEmailqueue);
router.post('/profile/emails/updateSendy', post.updateSendy);
router.post('/galleries/:id/medias', upload.galleryAddImages);
router.post('/:sez/:id/image', upload.setImage);
router.post('/:sez/:id/video', upload.setVideo);
router.post('/:sez/:id/:form/', (req, res) => {
  if (req.params.sez === "performances" && req.params.form === "public") {
    req.params.rel = "performances";
    req.params.q = "type";
    getRoutes.getPerfCategories(req, res, (types) => {
      config.types = types;
      req.params.q = "genre";
      getRoutes.getPerfCategories(req, res, (genres) => {
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
