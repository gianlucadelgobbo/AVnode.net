const config = require('getconfig');
const router = require('../router')();
const dataprovider = require('../../utilities/dataprovider');

const Model = require('mongoose').model('Footage');
const section = 'footage';

const logger = require('../../utilities/logger');

router.get('/:filter/:sorting/:page', (req, res) => {
  dataprovider.list(req, res, section, Model);
});

router.get('/:filter/:sorting', (req, res) => {
  if (req.params.sorting == "tobeencoded") {
    Model
    //.findOne({"media.encoded":{$exists:true},"media.encoded": {$ne:true},"media.encoded": {$ne:1}})
    .find({"media.encoded":{$exists:true}, "media.original":{$exists:true}, "media.encoded": 1,"media.original":{$regex: '2013/12/capillary_short.mov'}})
    .limit(1)
    .select({media:1})
    .exec((err, data) => {
      if (err) {
        res.status(500).json({ error: `${JSON.stringify(err)}` });
      } else {
        res.json(data);
      }
    });
  } else {
    req.params.page = 1;
    dataprovider.list(req, res, section, Model);
  }
});

/* router.get('/:filter', (req, res) => {
  req.params.page = 1;
  req.params.sorting = config.sections[section].orders[0];
  dataprovider.list(req, res, section, Model);  
}); */

router.get('/', (req, res) => {
  req.params.page = 1;
  req.params.sorting = config.sections[section].orders[0];
  req.params.filter = config.sections[section].categories[0];
  dataprovider.list(req, res, section, Model);
});

module.exports = router;
