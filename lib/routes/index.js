const router = require('./router')();
const i18n = require('../plugins/i18n');
const account = require('./account');
const user = require('./user');
const storage = require('./storage');
const performers = require('./performers');
const performances = require('./performances');
const password = require('./password');
const events = require('./events');
const crews = require('./crews');
const login = require('./login');
const logout = require('./logout');
const signup = require('./signup');
const search = require('./search');
const fourOhFour = require('./404');

const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const User = mongoose.model('User');
const Performance = mongoose.model('Performance');
// User.find({name: { $regex: '.*' + 'lex' + '.*' }})
router.get('/', (req, res) => {
  Event.findOne({})
  .populate([{
    path: 'teaserImage',
    model: 'Asset'
  }])
  .exec((err, event) => {
    User.find({})
    .populate([{
      path: 'image',
      model: 'Asset'
    }])
    .limit(40)
    .exec((err, performers) => {
      Performance.find({})
      .populate([{
        path: 'image',
        model: 'Asset'
      }])
      .limit(40)
      .exec((err, performances) => {
        res.render('home', {
          title: i18n.__('Welcome to AVnode network'),
          subtitle: i18n.__('AVnode is an international network of artists and professionals organising activities in the field of audio visual performing arts.'),
          performances: performances,
          performers: performers,
          event: event
        });
      });
    });
  });
});

router.use('/account', account);
router.use('/user', user);
router.use('/storage', storage);
router.use('/performers', performers);
router.use('/performances', performances);
router.use('/events', events);
router.use('/crews', crews);
router.use('/login', login);
router.use('/logout', logout);
router.use('/signup', signup);
router.use('/search', search);
router.use('/password', password);
router.get('/404', fourOhFour);

module.exports = router;
