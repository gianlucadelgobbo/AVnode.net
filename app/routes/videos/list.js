const config = require('getconfig');
const router = require('../router')();
const dataprovider = require('../../utilities/dataprovider');

const Model = require('mongoose').model('Video');
const section = 'videos';

const logger = require('../../utilities/logger');

router.get('/:filter/:sorting/:page', (req, res) => {
  dataprovider.list(req, res, section, Model);
});

router.get('/:filter/:sorting', (req, res) => {
  req.params.page = 1;
  dataprovider.list(req, res, section, Model);
});

router.get('/:filter', (req, res) => {
  req.params.page = 1;
  req.params.sorting = config.sections[section].orders[0];
  dataprovider.list(req, res, section, Model);
});

router.get('/', (req, res) => {
  req.params.page = 1;
  req.params.sorting = config.sections[section].orders[0];
  req.params.filter = config.sections[section].categories[0];
  dataprovider.list(req, res, section, Model);
});

module.exports = router;
