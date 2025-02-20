import createRouter from "./router.js";
const router = createRouter();

const list = require('./performers/list');

router.use('/', list);
  
export default router;