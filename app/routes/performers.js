import createRouter from "./router.js";
const router = createRouter();
import list from './performers/list.js';

router.use('/', list);
  
export default router;