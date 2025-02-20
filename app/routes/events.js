import createRouter from "./router.js";
const router = createRouter();

import list from './events/list.js';
import show from './events/show.js';
import participate from './events/participate.js';

router.use('/:slug/participate', participate);
router.use('/:slug', show);
router.use('/', list);

export default router;
