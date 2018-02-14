const router = require('../router')();

const user = require('./api/user');
const crew = require('./api/crew');
const performance = require('./api/performance');
const event = require('./api/event');
const search = require('./api/search');
const tools = require('./tools/tools');

router.use('/api/user', user);
router.use('/api/crew', crew);
router.use('/api/performance', performance);
router.use('/api/event', event);
router.use('/api/search', search);
router.use('/tools', tools);

router.get('/*', (req, res) => {
  res.render('admin/index', {
    title: __('Your Account'),
    is_admin: true
  });
});

router.get('/api/countries', (req, res) => {
  // FIXME: Later evaluate language param to return
  // localized list depending on the user settings.
  const convert = R.compose(
    R.map(
      R.zipObj(['key', 'name'])
    ),
    R.toPairs
  );

  allCountries('en', (err, countries) => {
    if (err) {
      throw err;
    }
    res.json(convert(countries));
  });
});

module.exports = router;
