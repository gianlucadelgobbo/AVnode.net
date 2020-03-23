const router = require('../router')();

const Vjtv = require('mongoose').model('Vjtv');

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  Vjtv.
  aggregate([
    {"$group":{
     "_id":{
       "$dateToString":{"format":"%Y-%m-%d","date":"$programming"}
     }
  }}]).
  exec((err, days) => {
    res.render('vjtv', {
      title: 'VJTV',
      currentUrl: req.originalUrl,
      availabledays: days.map(item =>{return item._id})
    });
  });
});

module.exports = router;

