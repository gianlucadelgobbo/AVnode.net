const router = require('../router')();

const config = require('getconfig');
const mongoose = require('mongoose');
const Models = {
  'User': mongoose.model('User')
}
const dataproviderAdmin = require('../../utilities/dataproviderAdmin');
const logger = require('../../utilities/logger');

const allCountries = require('node-countries-list');
const R = require('ramda');

const profilePublic = require('./api/profilePublic');
const profileImages = require('./api/profileImages');
const profileEmails = require('./api/profileEmails');
const profilePrivate = require('./api/profilePrivate');
const profilePassword = require('./api/profilePassword');

router.get('/api/:sez/:form/', (req, res) => {
  const id = req.user.id;
  Models[config.cpanel[req.params.sez].model].
  findById(id)
  .select(config.cpanel[req.params.sez].forms[req.params.form].select)
  .populate(config.cpanel[req.params.sez].forms[req.params.form].populate)
  .exec((err, data) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      res.status(500).json({ error: `${JSON.stringify(err)}` });
    } else {
      let send = {_id: data._id};
      for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) {
        send[item] = data[item];
      }
      if (process.env.DEBUG) {
        res.render('json', {data: send});
      } else {
        res.json(send);
      }
    }
  });
   /* dataproviderAdmin.getUser(, selectselect, populate, (err, user) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      res.status(500).json({ error: `${JSON.stringify(err)}` });
    } else {
      logger.debug(user);
      if (process.env.DEBUG) {
        res.render('json', {data: user});
      } else {
        res.json(user);
      }
    }
  });
*/
});
// DELETE
const user = require('./api/user');
router.use('/api/user', user);
//

const crew = require('./api/crew');
const performance = require('./api/performance');
const event = require('./api/event');
const search = require('./api/search');
const tools = require('./tools/tools');
const toolsEmails = require('./tools/toolsEmails');

router.use('/api/profile/public/', profilePublic);
router.use('/api/profile/images', profileImages);
router.use('/api/profile/emails', profileEmails);
router.use('/api/profile/private', profilePrivate);
router.use('/api/profile/password', profilePassword);
router.use('/api/crew', crew);
router.use('/api/performance', performance);
router.use('/api/event', event);
router.use('/api/search', search);
router.use('/tools/emails', toolsEmails);
router.use('/tools', tools);

router.get('/*', (req, res) => {
  res.render('admin/index', {
    title: __('Your Account'),
    is_admin: true
  });
});
/*
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
*/
module.exports = router;
