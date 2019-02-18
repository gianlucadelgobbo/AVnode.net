const router = require('../router')();
const dataprovider = require('../../utilities/dataprovider');

const Model = require('mongoose').model('EventShow');
const section = 'events';

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  dataprovider.show(req, res, section, 'show', Model);
});

router.get('/partners', (req, res) => {
  dataprovider.show(req, res, section, 'partners', Model);
});

module.exports = router;
