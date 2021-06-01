const router = require('../router')();
const config = require('getconfig');

const get = require('./api/get');
const put = require('./api/put');

const logger = require('../../utilities/logger');

const api = require('./api');
router.use('/api', api);

router.get('/:sez/:id/:form/', (req, res) => {
  if (req.params.sez == "performances" && req.params.form == "public") {
    req.params.rel = "performances";
    req.params.q = "type";
    get.getPerfCategories(req, res, (types) => {
      config.types = types;
      req.params.q = "genre";
      get.getPerfCategories(req, res, (genres) => {
        config.genres = genres;
        get.getData(req, res, "admin/"+req.params.sez+"_"+req.params.form);
      });
    });
  } else if (req.params.sez == "profile" && req.params.form == "subscriptions") {
    get.getSubscriptions(req, res);
  } else if (req.params.sez == "events" && req.params.form == "partners") {
    get.getPartners(req, res);
  } else {
    get.getData(req, res, "admin/"+req.params.sez+"_"+req.params.form);
  }
});

router.post('/:sez/:id/:form/', (req, res) => {
  if (req.params.sez == "performances" && req.params.form == "public") {
    req.params.rel = "performances";
    req.params.q = "type";
    get.getPerfCategories(req, res, (types) => {
      config.types = types;
      req.params.q = "genre";
      get.getPerfCategories(req, res, (genres) => {
        config.genres = genres;
        put.putData(req, res, "admin/"+req.params.sez+"_"+req.params.form);
      });
    });
  } else if (req.params.sez == "events" && req.params.form == "partners") {
    get.getPartners(req, res);
  } else if (req.params.sez == "partners" && req.params.form == "message") {
    get.getData(req, res, "admin/"+req.params.sez+"_"+req.params.form);
  } else if (req.params.sez == "events" && req.params.form == "partners-message") {
    get.getData(req, res, "admin/"+req.params.sez+"_"+req.params.form);
  } else {
    put.putData(req, res, "admin/"+req.params.sez+"_"+req.params.form);
  }
});

router.get('/mailer', (req, res) => {
  get.getEmailqueue(req, res, "admin/mailer");
});

router.get('/:sez', (req, res) => {
  if (req.params.sez == "profile") {
    res.redirect("/admin/profile/"+req.user.id+"/public")
  } else if (req.params.sez == "subscriptions") {
    res.redirect("/admin/subscriptions/"+req.user.id+"/public")
  } else {
    req.params.id = req.user.id;
    get.getList(req, res, "admin/"+req.params.sez);
  }
});

router.post('/:sez', (req, res) => {
  if (req.params.sez == "profile") {
    res.redirect("/admin/profile/"+req.user.id+"/public")
  } else if (req.params.sez == "subscriptions") {
    res.redirect("/admin/subscriptions/"+req.user.id+"/public")
  } else {
    req.params.id = req.user.id;
    get.getList(req, res, "admin/"+req.params.sez);
  }
});

router.get('/*', (req, res) => {
  if (req.user.id) {
    res.redirect("/admin/profile/"+req.user.id+"/public")
  } else {
    res.redirect("/404")
  }
});

router.post('/*', (req, res) => {
  if (req.user.id) {
    res.redirect("/admin/profile/"+req.user.id+"/public")
  } else {
    res.redirect("/404")
  }
});

/* router.post('/:ancestor/:id/:sez/', (req, res) => {
  post.postData(req, res);
}); */

module.exports = router;
