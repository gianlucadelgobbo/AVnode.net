import createRouter from "./router.js";
const router = createRouter();

import index from './admin/index.js';

router.use('/', index);

export default router;
