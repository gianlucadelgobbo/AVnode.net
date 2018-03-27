const router = require('../../router')();
let config = require('getconfig');

const mongoose = require('mongoose');
const Models = {
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Video': mongoose.model('Video')
}
const logger = require('../../../utilities/logger');

/*
for (let item in addconfig) {
  for (let item2 in addconfig[item].forms) {
    addconfig[item].forms[item2].populate = [];
    //addconfig[item].forms[item2].select = {};
    for (let item3 in addconfig[item].forms[item2].validators) {
      //addconfig[item].forms[item2].select[item3] = 1;

    } 
  }
}
*/
router.getList = (req, res) => {
  if (config.cpanel[req.params.sez]) {
    logger.debug(config.cpanel[req.params.sez].list.select);
    const id = req.user.id;
    Models['User'].
    findById(id)
    .select(config.cpanel[req.params.sez].list.select)
    .populate(config.cpanel[req.params.sez].list.populate)
    .exec((err, data) => {
      if (err) {
        logger.debug(`${JSON.stringify(err)}`);
        res.status(500).json({ error: `${JSON.stringify(err)}` });
      } else {
        let send = {_id: data._id};
        for (const item in config.cpanel[req.params.sez].list.select) {
          send[item] = data[item];
        }
        if (process.env.DEBUG) {
          res.render('json', {data: data});
        } else {
          res.json(send);
        }
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
  }
}

router.getSlug = (req, res) => {
  const apiCall = 'api, router.get(/user/slugs)';
  logger.debug(`${apiCall} checks slug: ${JSON.stringify(req.params.slug)}`);
  Models[config.cpanel[req.params.sez].model]
  .findOne({ slug : req.params.slug }, (err, user) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${JSON.stringify(err)}` });    
    }
    //console.log(err +','+ user);s
    var response = {slug:req.params.slug,exist:user!==null?true:false};
    res.json(response);

  });
}

router.getData = (req, res) => {
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms[req.params.form]) {
    logger.debug(config.cpanel[req.params.sez].model);
    logger.debug(req.params.id);
    Models[config.cpanel[req.params.sez].model]
    .findById(req.params.id)
    .select(config.cpanel[req.params.sez].forms[req.params.form].select)
    .populate(config.cpanel[req.params.sez].forms[req.params.form].populate)
    .exec((err, data) => {
      if (err) {
        logger.debug(`${JSON.stringify(err)}`);
        res.status(404).json({ error: `${JSON.stringify(err)}` });
      } else {
        if (!data) {
          logger.debug(`DOC_NOT_FOUND`);
          res.status(500).json({ error: `DOC_NOT_FOUND` });
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
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
  }
}
/*
const allCountries = require('node-countries-list');
const R = require('ramda');

const profilePublic = require('./api/profilePublic');
const profileImages = require('./api/profileImages');
const profileEmails = require('./api/profileEmails');
const profilePrivate = require('./api/profilePrivate');
const profilePassword = require('./api/profilePassword');


router.get('/countries', (req, res) => {
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
