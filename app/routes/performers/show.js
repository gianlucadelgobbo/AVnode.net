const router = require('../router')();
const dataprovider = require('../../utilities/dataprovider');

const Model = require('mongoose').model('UserShow');
const section = 'performers';

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  logger.debug('Show ' + section);
  dataprovider.show(req, res, section, 'show', Model);
});

router.get('/events', (req, res) => {
  logger.debug('Show ' + section + ' events');
  dataprovider.show(req, res, section, 'events', Model);
});

router.get('/events/page/:page', (req, res) => {
  logger.debug('Show ' + section + ' events');
  dataprovider.show(req, res, section, 'events', Model);
});

router.get('/footage', (req, res) => {
  logger.debug('Show ' + section + ' footage');
  dataprovider.show(req, res, section, 'footage', Model);
});

router.get('/footage/page/:page', (req, res) => {
  logger.debug('Show ' + section + ' footage');
  dataprovider.show(req, res, section, 'footage', Model);
});

router.get('/galleries', (req, res) => {
  logger.debug('Show ' + section + ' galleries');
  dataprovider.show(req, res, section, 'galleries', Model);
});

router.get('/galleries/page/:page', (req, res) => {
  logger.debug('Show ' + section + ' galleries');
  dataprovider.show(req, res, section, 'galleries', Model);
});

router.get('/tvshows', (req, res) => {
  logger.debug('Show ' + section + ' tvshows');
  dataprovider.show(req, res, section, 'tvshows', Model);
});

router.get('/tvshows/page/:page', (req, res) => {
  logger.debug('Show ' + section + ' tvshows');
  dataprovider.show(req, res, section, 'tvshows', Model);
});

router.get('/performances', (req, res) => {
  logger.debug('Show ' + section + ' performances');
  dataprovider.show(req, res, section, 'performances', Model);
});

router.get('/performances/page/:page', (req, res) => {
  logger.debug('Show ' + section + ' performances');
  dataprovider.show(req, res, section, 'performances', Model);
});

router.get('/crews', (req, res) => {
  logger.debug('Show ' + section + ' crews');
  dataprovider.show(req, res, section, 'crews', Model);
});

router.get('/crews/page/:page', (req, res) => {
  logger.debug('Show ' + section + ' crews');
  dataprovider.show(req, res, section, 'crews', Model);
});

module.exports = router;

