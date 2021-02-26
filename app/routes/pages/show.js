const router = require('../router')();
const request = require('axios');

const logger = require('../../utilities/logger');

router.get('/', (req, res, next) => {
  request.get({
      url: 'https://cms.avnode.net/'+global.getLocale()+'/wp-json/wp/v2/mypages'+req.baseUrl,
      json: true
    }, function (error, response, body) {
      if (body) {
        res.render('pages/show', {
          title: body.post_title,
          data: body
        });
      } else {
        res.status(408).render('404', {path: req.originalUrl, title:__("408: Request Timeout"), titleicon:"lnr-warning"});
      }
    }
  );
});

module.exports = router;
