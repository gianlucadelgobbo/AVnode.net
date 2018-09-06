const router = require('../router')();
const request = require('request');

const logger = require('../../utilities/logger');

router.get('/', (req, res, next) => {
/*   res.render('pages/show', {
    title: "body.post_name",
    data: "body"
  }); */
  logger.debug("pages");
  logger.debug(request.get);
  logger.debug(request);
  request.get({
      url: 'https://cms.avnode.net/'+global.getLocale()+'/wp-json/wp/v2/mypages'+req.baseUrl,
      json: true
    }, function (error, response, body) {
      logger.debug("request");
      logger.debug(error);
      logger.debug(response);
      logger.debug(body);
      if (body) {
        res.render('pages/show', {
          title: body.post_name,
          data: body
        });
      } else {
        res.status(404).render('404', {title:"<span class=\"lnr lnr-warning\" style=\"font-size:  200%;vertical-align:  middle;padding-right: 20px;\"></span><span style=\"vertical-align:  middle;\">"+__("404: Page not found")+"</span>"});
      }
    }
  );
});

module.exports = router;
