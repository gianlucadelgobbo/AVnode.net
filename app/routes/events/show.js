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

router.get('/artists', (req, res) => {
  dataprovider.show(req, res, section, 'artists', Model);
});

router.get('/artists/:artist', (req, res) => {
  dataprovider.show(req, res, "performers", 'show', Model);
});

router.get('/program', (req, res) => {
  dataprovider.show(req, res, section, 'program', Model);
});

router.get('/program/:performance', (req, res) => {
  dataprovider.show(req, res, section, 'program', Model);
});

router.get('/program/day/:day', (req, res) => {
  dataprovider.show(req, res, section, 'program', Model);
});

router.get('/program/type/:type', (req, res) => {
  dataprovider.show(req, res, section, 'program', Model);
});

router.get('/program/:sub', (req, res) => {
  const sub = new Date(req.params.sub);
  if (sub.getFullYear()+"-"+(("0" + (sub.getMonth()+1)).slice(-2))+"-"+(("0" + (sub.getDate())).slice(-2)) == sub) {
    dataprovider.show(req, res, section, 'program', Model);
  } else {
    console.log("stocazzo");
    dataprovider.show(req, res, "performances", 'show', require('mongoose').model('Performance'));
  }
});

router.get('/galleries', (req, res) => {
  dataprovider.show(req, res, section, 'galleries', Model);
});

router.get('/videos', (req, res) => {
  dataprovider.show(req, res, section, 'videos', Model);
});

module.exports = router;
