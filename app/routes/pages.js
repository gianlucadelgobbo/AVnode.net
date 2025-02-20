import createRouter from "./router.js";
const router = createRouter();
import page from "./pages/show.js";

console.log("🚀 Debug: pages.js loaded");

// Debugging: Log routes before adding show.js
console.log("🛤 Before adding show.js, pages.js routes are:");
console.log(router.stack.map(m => m.route ? m.route.path : "Middleware"));

// Instead of `router.use('/', page)`, use `router.use(page)`
router.use(page);

// Debugging: Log routes after adding show.js
console.log("🛤 After adding show.js, pages.js routes are:");
console.log(router.stack.map(m => m.route ? m.route.path : "Middleware"));

console.log("✅ pages.js is exporting a valid Express router.");
export default router;

