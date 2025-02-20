import createRouter from "./router.js";
const router = createRouter();
import list from './crews/list.js';
import show from './crews/show.js';



router.use('/:slug', show);
router.use('/', list);

export default router;
