import createRouter from "../router.js";
const router = createRouter();

import config from 'getconfig';
import get from './api/get.js';
import put from './api/put.js';
import { logger, requestLogger, errorLogger } from '../../utilities/logger.js'; // Logger
import dataprovider from '../../utilities/dataprovider.js'; // Logger

// API Routes
import apiRoutes from './api/index.js';
router.use('/api', apiRoutes);

// GET Route for fetching data
router.get('/:sez/:id/:form/', async (req, res) => {
  try {
    if (req.params.sez === "performances" && req.params.form === "public") {
      req.params.rel = "performances";
      req.params.q = "type";
      
      config.types = await get.getPerfCategories(req, res);
      console.log("✅ types loaded:", config.types);

      req.params.q = "genre";
      config.genres = await get.getPerfCategories(req, res);
      console.log("✅ genres loaded:", config.genres);

      // 🔥 Ensure dataprovider.getData is only called *after* types and genres are set
      await dataprovider.getData(req, res, `admin/${req.params.sez}_${req.params.form}`);
    } else if (req.params.sez === "subscriptions" && req.params.form === "private") {
      await get.getSubscriptions(req, res);
    } else if (req.params.sez === "events" && req.params.form === "partners") {
      await get.getPartners(req, res);
    } else {
      await dataprovider.getData(req, res, `admin/${req.params.sez}_${req.params.form}`);
    }
  } catch (err) {
    error("🔥 Error fetching data:", err);
    res.status(500).send("Internal Server Error");
  }
});


// POST Route for updating data
router.post('/:sez/:id/:form/', async (req, res) => {
  try {
    if (req.params.sez === "performances" && req.params.form === "public") {
      req.params.rel = "performances";
      req.params.q = "type";
      
      const types = await get.getPerfCategories(req, res);
      config.types = types;
      req.params.q = "genre";

      const genres = await get.getPerfCategories(req, res);
      config.genres = genres;

      put.putData(req, res, `admin/${req.params.sez}_${req.params.form}`);
    } else if (req.params.sez === "events" && req.params.form === "partners") {
      get.getPartners(req, res);
    } else if (req.params.sez === "partners" && req.params.form === "message") {
      dataprovider.getData(req, res, `admin/${req.params.sez}_${req.params.form}`);
    } else if (req.params.sez === "events" && req.params.form === "partners-message") {
      dataprovider.getData(req, res, `admin/${req.params.sez}_${req.params.form}`);
    } else {
      put.putData(req, res, `admin/${req.params.sez}_${req.params.form}`);
    }
  } catch (err) {
    logger.error("Error processing data:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Mailer Route
router.get('/mailer', (req, res) => {
  get.getEmailqueue(req, res, "admin/mailer");
});

// Section-based Redirections & Data Fetching
router.get('/:sez', (req, res) => {
  if (req.params.sez === "profile") {
    res.redirect(`/admin/profile/${req.user.id}/public`);
  } else if (req.params.sez === "subscriptions") {
    res.redirect(`/admin/subscriptions/${req.user.id}/private`);
  } else {
    req.params.id = req.user.id;
    get.getList(req, res, `admin/${req.params.sez}`);
  }
});

// Section-based Redirections & Data Posting
router.post('/:sez', (req, res) => {
  if (req.params.sez === "profile") {
    res.redirect(`/admin/profile/${req.user.id}/public`);
  } else if (req.params.sez === "subscriptions") {
    res.redirect(`/admin/subscriptions/${req.user.id}/private`);
  } else {
    req.params.id = req.user.id;
    get.getList(req, res, `admin/${req.params.sez}`);
  }
});

// Catch-All Routes
router.get('/*', (req, res) => {
  if (req.user && req.user.id) {
    res.redirect(`/admin/profile/${req.user.id}/public`);
  } else {
    res.redirect("/404");
  }
});

router.post('/*', (req, res) => {
  if (req.user && req.user.id) {
    res.redirect(`/admin/profile/${req.user.id}/public`);
  } else {
    res.redirect("/404");
  }
});

export default router;
