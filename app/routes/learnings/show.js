const router = require('../router')();
const dataprovider = require('../../utilities/dataprovider');

const Model = require('mongoose').model('Performance');
const section = 'learnings';

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  dataprovider.show(req, res, section, 'show', Model);
});

router.get('/print', (req, res) => {
  dataprovider.show(req, res, section, 'print', Model);
});

router.get('/galleries/:gallery', (req, res) => {
  dataprovider.show(req, res, section, 'galleries', Model);
});

router.get('/galleries/:gallery/img/:img', (req, res) => {
  dataprovider.show(req, res, section, 'galleries', Model);
});

router.get('/videos/:video', (req, res) => {
  dataprovider.show(req, res, section, 'videos', Model);
});
router.get('/galleries', (req, res) => {
  dataprovider.show(req, res, section, 'galleries', Model);
});

router.get('/videos', (req, res) => {
  dataprovider.show(req, res, section, 'videos', Model);
});

module.exports = router;

