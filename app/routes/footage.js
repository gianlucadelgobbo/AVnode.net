import createRouter from "./router.js";
const router = createRouter();

import list from './footage/list.js'
import show from './footage/show.js';

router.use('/:slug', show);
router.use('/', list);

export default router;
