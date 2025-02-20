import createRouter from "./router.js";
const router = createRouter();

import list from './learnings/list.js';
import show from './learnings/show.js';

router.use('/:slug', show);
router.use('/', list);

export default router;
