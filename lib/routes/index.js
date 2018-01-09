const router = require('./router')();

const home = require('./home');
const performers = require('./performers');
const performances = require('./performances');
const events = require('./events');

const login = require('./login');
const logout = require('./logout');
const password = require('./password');
const search = require('./search');
const signup = require('./signup');

const account = require('./account');
/*
const user = require('./user');
const storage = require('./storage');
const crews = require('./crews');
const fourOhFour = require('./404');
*/

// User.find({name: { $regex: '.*' + 'lex' + '.*' }})
router.use('/performers', performers);
router.use('/performances', performances);
router.use('/events', events);
router.use('/login', login);
router.use('/logout', logout);
router.use('/password', password);
router.use('/search', search);
router.use('/signup', signup);
/*
router.get('/404', fourOhFour);
*/

router.use('/account', account);
const show = require('./performers/show');

router.use('/:slug', show);

router.use('/', home);
/*
router.use('/user', user);
router.use('/performers', performers);
router.use('/storage', storage);
router.use('/crews', crews);
*/

module.exports = router;