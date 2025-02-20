import createRouter from "./router.js";
const router = createRouter();

import list from './galleries/list.js';
import show from './galleries/show.js';

router.use('/:slug/img/:img', show);
router.use('/:slug', show);
router.use('/', list);

export default router;
