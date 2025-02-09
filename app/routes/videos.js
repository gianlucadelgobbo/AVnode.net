import createRouter from "./router.js";
const router = createRouter();
import list from './videos/list.js';
import show from './videos/show.js';

router.use('/:slug', show);
router.use('/', list);

export default router;
