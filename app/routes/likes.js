import createRouter from "./router.js";
const router = createRouter();
import like from './likes/like.js';

router.use('/', like);
  
export default router;