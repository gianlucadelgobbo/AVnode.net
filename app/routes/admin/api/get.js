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

router.getList = (req, res) => {
  if (config.cpanel[req.params.sez] && req.params.id) {
    const id = req.params.id;
    const select = req.query.pure ? config.cpanel[req.params.sez].list.select : Object.assign(config.cpanel[req.params.sez].list.select, config.cpanel[req.params.sez].list.selectaddon);
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].list.populate;

    Models[config.cpanel[req.params.sez].list.model]
    .findById(id)
    .select(select)
    .populate(populate)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({ error: `${JSON.stringify(err)}` });
      } else {
        let send = {_id: data._id};
        for (const item in config.cpanel[req.params.sez].list.select) send[item] = data[item];
        res.json(send);
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
  }
}

router.getData = (req, res) => {
  for (let item in config.cpanel) {
    console.log("http://localhost:8006/admin/api/"+item+"?pure=1")
    for (let item2 in config.cpanel[item].forms) {
      //console.log("http://localhost:8006/admin/api/"+item+"/"+item2);
      console.log("http://localhost:8006/admin/api/"+item+"/:ID/"+item2+"?pure=1");
      //config.cpanel[item].forms[item2].populate = [];
      //config.cpanel[item].forms[item2].select = {};
      for (let item3 in config.cpanel[item].forms[item2].validators) {
        //config.cpanel[item].forms[item2].select[item3] = 1;
        console.log(item+"/"+item2+"/"+item3);
  
      } 
    }
  }
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms[req.params.form]) {
    const id = req.params.id;
    const select = req.query.pure ? config.cpanel[req.params.sez].forms[req.params.form].select : Object.assign(config.cpanel[req.params.sez].forms[req.params.form].select, config.cpanel[req.params.sez].forms[req.params.form].selectaddon);
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].forms[req.params.form].populate;
    Models[config.cpanel[req.params.sez].model]
    .findById(id)
    .select(select)
    .populate(populate)
    .exec((err, data) => {
      if (err) {
        res.status(404).json({ error: `${JSON.stringify(err)}` });
      } else {
        if (!data) {
          res.status(204).json({ error: `DOC_NOT_FOUND` });
        } else {
          let send = {_id: data._id};
          for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) send[item] = data[item];
          res.json(send);
        }
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
  }
}
router.getSlug = (req, res) => {
  Models[config.cpanel[req.params.sez].model]
  .findOne({ slug : req.params.slug },'_id', (err, user) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    res.json({slug:req.params.slug,exist:user!==null?true:false});
  });
}

router.getCountries = (req, res) => {
  const allCountries = require('node-countries-list');
  const R = require('ramda');
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
}

/**/

/*

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
