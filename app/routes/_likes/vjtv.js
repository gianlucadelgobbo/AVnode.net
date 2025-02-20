import createRouter from "./router.js";
const router = createRouter();

import show from "./vjtv/show.js";

router.use('/', show);

export default router;
