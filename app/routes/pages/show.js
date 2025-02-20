import createRouter from '../router.js';
const router = createRouter();

import axios from 'axios';
import { logger } from '../../utilities/logger.js';

console.log("🚀 Debug: show.js loaded");

// Ensure router is valid
if (!router || typeof router.get !== "function") {
  console.error("❌ ERROR: show.js is not exporting a valid Express router!");
} else {
  console.log("✅ show.js is exporting a valid Express router.");
}

// Debugging: Log routes before adding GET /
console.log("🛤 Before adding GET /, show.js routes are:");
console.log(router.stack.map(m => m.route ? m.route.path : "Middleware"));

router.get('/', async (req, res) => {
  console.log(`🌍 Fetching CMS Page: ${req.originalUrl}`);
  try {
    const response = await axios.get(`https://cms.avnode.net/${global.getLocale()}/wp-json/wp/v2/mypages${req.originalUrl}`);
    logger.info(response.data);
    res.render('pages/show', { title: response.data.post_title, data: response.data });
  } catch (error) {
    console.error(`❌ Error fetching page: ${error.message}`);
    res.status(404).render('404', { path: req.originalUrl, title: "404: Page Not Found" });
  }
});

// Debugging: Log routes after adding GET /
console.log("🛤 After adding GET /, show.js routes are:");
console.log(router.stack.map(m => m.route ? m.route.path : "Middleware"));

export default router;
