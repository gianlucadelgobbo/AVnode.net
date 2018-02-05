const router = require('./router')();
const list = require('./performers/list');

router.use('/', list);
  
module.exports = router;