const router = require('../router')();
const dataprovider = require('../../utilities/dataprovider');

const Model = require('mongoose').model('Event');
const section = 'events';

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  logger.debug('Show ' + section);
  dataprovider.show(req, res, section, Model);
});

module.exports = router;
