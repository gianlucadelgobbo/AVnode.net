const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
// const Crew = mongoose.model('Crew');
const Performance = mongoose.model('Performance');
const Venue = mongoose.model('Venue');
const slugify = require('../../utilities/slug').parse;
const logger = require('../../utilities/logger');
const mailer = require('../../utilities/mailer');
const allCountries = require('node-countries-list');
const R = require('ramda');

// All for the image upload…
const multer = require('multer');
const uuid = require('uuid');
const mime = require('mime');
const async = require('async');
const imageUtil = require('../../utilities/image');
const assetUtil = require('../../utilities/asset');


const elasticsearch = require('../../utilities/elasticsearch');
const config = require('getconfig');

let errorMessage;
let infoMessage;


const fetchCrewMemberById = (id, cb) => {
  User
    .findById(id)
    .select({ '_id': 1, 'slug': 1, 'stagename': 1, 'username': 1, 'email': 1, 'file': 1 })
    .populate({
      path: 'crews',
      model: 'User',
      select: { '_id': 1, 'slug': 1, 'stagename': 1, 'username': 1, 'email': 1, 'file': 1 }
    })
    .exec(cb);
};
/* const fetchUserCrews = (id, cb) => {
  console.log('crewid:' + id);
  User
    .findById(id)
    .select({ 
      '-members':1, 
      '-abouts':1, 
      'org_name': 1, 
      'slug': 1, 
      'stagename': 1, 
      'username': 1
    })
    .exec(cb);
}; */
const checkImageFile = (file, apiCall) => {
  let valid = true;
  if (file.size > config.maxImageSize) {
    errorMessage = `${apiCall} file too large`;
    logger.debug(errorMessage);
    valid = false;
  }
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
    errorMessage = `${apiCall} Only image files are allowed ${file.originalname}`;
    logger.debug(errorMessage);
    valid = false;
  }
  return valid;
};

const user = require('./api/user');
router.use('/user', user);

const crew = require('./api/crew');
router.use('/crew', crew);

const performance = require('./api/performance');
router.use('/performance', performance);

const event = require('./api/event');
router.use('/event', event);

const search = require('./api/search');
router.use('/search', search);


// countries
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

module.exports = router;
