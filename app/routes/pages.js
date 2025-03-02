import createRouter from "./router.js";
const router = createRouter();
import page from "./pages/show.js";

//logger.info("🚀 Debug: pages.js loaded");

// Debugging: Log routes before adding show.js
//logger.info("🛤 Before adding show.js, pages.js routes are:");
//logger.info(router.stack.map(m => m.route ? m.route.path : "Middleware"));

// Instead of `router.use('/', page)`, use `router.use(page)`
router.use(page);

// Debugging: Log routes after adding show.js
//logger.info("🛤 After adding show.js, pages.js routes are:");
//logger.info(router.stack.map(m => m.route ? m.route.path : "Middleware"));

//logger.info("✅ pages.js is exporting a valid Express router.");
export default router;

