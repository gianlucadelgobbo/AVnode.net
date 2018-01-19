const config = require('getconfig');
const router = require('../router')();
const dataprovider = require('../../utilities/dataprovider');

const Model = require('mongoose').model('Performance');
const section = 'performances';

const logger = require('../../utilities/logger');

router.get('/:filter/:sorting/:page', (req, res) => {
  logger.debug('LIST page ' + section);
  dataprovider.list(req, res, section, Model);
});

router.get('/:filter/:sorting', (req, res) => {
  logger.debug('LIST sorting ' + section);
  req.params.page = 1;
  dataprovider.list(req, res, section, Model);
});

router.get('/:filter', (req, res) => {
  logger.debug('LIST filter ' + section);
  req.params.page = 1;
  req.params.sorting = config.sections[section].orders[0];
  dataprovider.list(req, res, section, Model);
});

router.get('/', (req, res) => {
  logger.debug('LIST ' + section);
  req.params.page = 1;
  req.params.sorting = config.sections[section].orders[0];
  req.params.filter = config.sections[section].categories[0];
  dataprovider.list(req, res, section, Model);
});

module.exports = router;
