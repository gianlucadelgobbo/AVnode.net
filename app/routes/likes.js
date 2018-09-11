const router = require('./router')();
const like = require('./likes/like');

router.use('/', like);
  
module.exports = router;