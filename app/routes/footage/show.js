const router = require('../router')();
const dataprovider = require('../../utilities/dataprovider');

const Model = require('mongoose').model('Footage');
const section = 'footage';

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  dataprovider.show(req, res, section, 'show', Model);
});

module.exports = router;
