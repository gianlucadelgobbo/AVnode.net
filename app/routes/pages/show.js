const router = require('../router')();
const User = require('../../models/User');
const request = require('request');
//const Crew = require('../../models/Crew');

router.get('/', (req, res, next) => {
  request.get({
      url: 'https://cms.avnode.net/'+global.getLocale()+'/wp-json/wp/v2/mypages'+req.baseUrl,
      json:true
    }, function (error, response, body) {
      if (body) {
        res.render('pages/show', {
          title: body.post_name,
          data: body
        });
      } else {

      }
    }
  );
});

module.exports = router;
