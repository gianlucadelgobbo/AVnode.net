const router = require('../router')();
const axios = require('axios');

const logger = require('../../utilities/logger');

router.get('/', (req, res, next) => {
  axios.get('https://cms.avnode.net/'+global.getLocale()+'/wp-json/wp/v2/mypages'+req.baseUrl)
  .then((body) => {
    logger.debug(body)
    res.render('pages/show', {
      title: body.data.post_title,
      data: body.data
    });
  }, (error) => {
    res.status(408).render('404', {path: req.originalUrl, title:__("408: Request Timeout"), titleicon:"icon-warning"});
  });
});

module.exports = router;
