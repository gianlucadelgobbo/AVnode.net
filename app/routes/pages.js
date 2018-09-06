const router = require('./router')();
const page = require('./pages/show');

router.use('/', page);
  
module.exports = router;