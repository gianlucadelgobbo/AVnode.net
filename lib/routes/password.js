const router = require('./router')();
const forgot = require('./password/forgot');
const verify = require('./password/verify');
const reset = require('./password/reset');

router.use('/forgot', forgot);
router.use('/verify', verify);
router.use('/reset', reset);

module.exports = router;
