const router = require('../router')();
const dataprovider = require('../../utilities/dataprovider');

const Model = require('mongoose').model('EventShow');
const section = 'events';

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  logger.debug('Show ' + section);
  dataprovider.show(req, res, section, 'show', Model);
});

module.exports = router;
