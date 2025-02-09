import createRouter from "./router.js";
const router = createRouter();
import page from "./pages/show.js";

router.use('/', page);
  
export default router;