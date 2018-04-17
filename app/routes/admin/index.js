const router = require('../router')();
const config = require('getconfig');

const get = require('./api/get');
const put = require('./api/put');
const upload = require('./api/upload');

const logger = require('../../utilities/logger');

if (process.env.DEBUG) {
  router.get('/api/config', (req, res) => {
    res.render('json', {data: require('getconfig').cpanel});
  });
}

router.get('/api/profile/public/slugs/:slug', (req, res)=>{
  req.params.id = req.user.id;
  req.params.sez = 'profile';
  get.getSlug(req, res);
});
router.get('/api/profile/:form/', (req, res) => {
  req.params.id = req.user.id;
  req.params.sez = 'profile';
  get.getData(req, res);
});
router.put('/api/profile/:form/', (req, res) => {
  req.params.id = req.user.id;
  req.params.sez = 'profile';
  if (['profile/image','footage/public','events/image','performances/image'].indexOf(req.params.sez+'/'+req.params.form)!== -1) {
    upload.uploader(req, res, (err, data) => {
      for (const item in data) req.body[item] = data[item];
      put.putData(req, res);
    });
  } else {
    put.putData(req, res);
  }
});

router.get('/api/:sez/:id/public/slugs/:slug', (req, res)=>{
  get.getSlug(req, res);
});
router.get('/api/:sez/:id/:form/', (req, res) => {
  get.getData(req, res);
});
router.put('/api/:sez/:id/:form/', (req, res) => {
  if (['profile/image','footage/public','events/image','performances/image'].indexOf(req.params.sez+'/'+req.params.form)!== -1) {
    upload.uploader(req, res, (err, data) => {
      for (const item in data) req.body[item] = data[item];
      put.putData(req, res);
    });
  } else {
    put.putData(req, res);
  }
});

router.get('/api/countries', (req, res) => {
  get.getCountries(req, res);
});

router.get('/api/:sez', (req, res) => {
  req.params.id = req.user.id;
  get.getList(req, res);
});






router.get('/api/*', (req, res) => {
  res.status(404).json({ error: `API_NOT_FOUND` });
});

router.get('/api', (req, res) => {
  res.status(404).json({ error: `API_NOT_FOUND` });
});

router.get('/*', (req, res) => {
  res.render('admin/index', {
    title: __('Your Account'),
    is_admin: true
  });
});

module.exports = router;
