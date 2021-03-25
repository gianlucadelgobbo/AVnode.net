const router = require('../router')();
const Vjtv = require('mongoose').model('Vjtv');

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  res.render('vjtv', {
    title: 'VJTV',
    currentUrl: req.originalUrl
  });
});

router.get('/post/', (req, res) => {
  router.getVjtvPost(req, res);
});

router.get('/post/:day', (req, res) => {
  router.getVjtvPost(req, res);
});

router.getVjtvPost = (req, res) => {
  logger.debug("getprogram by date");
  //req.body.month = "2020-03";
  logger.debug(req.params);
  if(req.params.day) {
    var pieces = req.params.day.split("-");
    var date = new Date(Date.UTC(parseInt(pieces[0]), parseInt(pieces[1])-1, parseInt(pieces[2]), 0, 0,0,0));
  } else {
    var date = new Date();
  }
  logger.debug(date);
  // 1 Month
  //var start = new Date(new Date(date.getFullYear(), date.getMonth(), 1, 0, 0,0,0).getTime()+offset);
  //var end = new Date(new Date(date.getFullYear(), date.getMonth()+1, 1, 0, 0,0,0).getTime()+offset+offset);
  
  //1 Week
  var week = 7*24*60*60*1000;
  //1 Full day
  //var start = new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0,0,0).getTime()+offset);
  //var end = new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59,0,0).getTime()+offset+offset);

  //1 Full day
  var day = 24*60*60*1000;
  //var start = new Date(date.getTime()+offset);
  var start = date;
  var end = new Date(date.getTime()+day);

  logger.debug(start);
  logger.debug(end);
  Vjtv
  .find({programming: { $lt: end, $gt: start}})
  //.select(select)
  .sort({programming: 1})
  .populate([{path: "video", select: {title: 1, slug: 1, "media.preview": 1, "media.duration": 1,"media.file": 1}, populate: {path:"users", select: {stagename: 1}}},{path:"category", select: "name"}])
  .exec((err, data) => {
    if (req.params.api) {
      res.send(data)
    } else {
      res.render('vjtv/vjtv_post', {
        title: 'VJTV',
        currentUrl: req.originalUrl,
        data: data
      });
    }
  });
};

module.exports = router;

