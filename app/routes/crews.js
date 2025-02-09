import createRouter from './router.js';
import list from './crews/list.js';
import show from './crews/show.js';

const router = createRouter();

router.use('/:slug', show);
router.use('/', list);

export default router;
