import createRouter from "./router.js";
const router = createRouter();
import forgot from './password/forgot.js';
import verify from './password/verify.js';
import reset from './password/reset.js';

router.use('/forgot', forgot);
router.use('/verify', verify);
router.use('/reset', reset);

export default router;
