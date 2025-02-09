import createRouter from "./router.js";
const router = createRouter();
const confirm = require('./user/confirm');
const search = require('./user/search');

router.use('/confirm', confirm);
router.use('/search', search);

export default router;
