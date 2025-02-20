import createRouter from "./router.js";
const router = createRouter();

import list from './performances/list.js';
import show from './performances/show.js';

router.use('/:slug', show);
router.use('/', list);

export default router;
