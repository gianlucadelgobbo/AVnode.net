import createRouter from "./router.js";
const router = createRouter();
import list from "./organizations/list.js";
import show from "./organizations/show.js";

router.use('/:slug', show);
router.use('/', list);

export default router;
