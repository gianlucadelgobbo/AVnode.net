import createRouter from "./router.js";
const router = createRouter();

import list from './news/list.js';
import show from './news/show.js';

router.use('/:slug', show);
router.use('/', list);

export default router;
