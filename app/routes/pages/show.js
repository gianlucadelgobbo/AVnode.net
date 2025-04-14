import createRouter from '../router.js';
const router = createRouter();

import axios from 'axios';
import { logger } from '../../utilities/logger.js';

//logger.info("🚀 Debug: show.js loaded");

// Ensure router is valid
/* if (!router || typeof router.get !== "function") {
  console.error("❌ ERROR: show.js is not exporting a valid Express router!");
} else {
  logger.info("✅ show.js is exporting a valid Express router.");
} */

// Debugging: Log routes before adding GET /
//logger.info("🛤 Before adding GET /, show.js routes are:");
//logger.info(router.stack.map(m => m.route ? m.route.path : "Middleware"));

router.get('/', async (req, res) => {
  logger.info(`🌍 Fetching CMS Page: ${req.originalUrl}`);
  try {
    const response = await axios.get(`https://cms.avnode.net/${req.getLocale()}/wp-json/wp/v2/mypages${req.originalUrl}`);
    //console.log(`https://cms.avnode.net/${req.getLocale()}/wp-json/wp/v2/mypages${req.originalUrl}`)
    //logger.info(response.data);
    if (req.isApi) {
      res.send({ title: response.data.post_title, data: response.data });
    } else {
      res.render('pages/show', { title: response.data.post_title, data: response.data });
    }
  } catch (error) {
    if (req.isApi) {
      res.status(404).send({ path: req.originalUrl, currentUrl: req.originalUrl, title: req.__("404: API not found"), error: error });
    } else {
      res.status(404).render('404', { path: req.originalUrl, title: "404: Page Not Found" });
    }
    //logger.error(`❌ Error fetching page: ${error.message}`);
  }
});

// Debugging: Log routes after adding GET /
//logger.info("🛤 After adding GET /, show.js routes are:");
//logger.info(router.stack.map(m => m.route ? m.route.path : "Middleware"));

export default router;
