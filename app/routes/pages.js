const router = require('./router')();
const page = require('./pages/page');

router.use('/', page);
  
module.exports = router;