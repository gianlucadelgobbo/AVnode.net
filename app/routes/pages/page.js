const router = require('../router')();
const User = require('../../models/User');
const request = require('request');
//const Crew = require('../../models/Crew');

router.get('/', (req, res, next) => {
  console.log("stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo stocazzo ");
  if(req.baseUrl.indexOf('/contacts')===0) {
    var sez = 'contacts';
  }
  request.get({
      url: 'https://cms.avnode.net/wp-json/wp/v2/mypages/'+sez,
      json:true
    }, function (error, response, body) {
      res.render('pages/index', {
        title: body.post_name,
        data: body
      });
    }
  );
});

module.exports = router;
