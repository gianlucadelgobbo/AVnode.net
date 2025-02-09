import createRouter from "./router.js";
const router = createRouter();
import list from './playlists/list.js';
import show from './playlists/show.js';

router.use('/:slug', show);
router.use('/', list);

export default router;
