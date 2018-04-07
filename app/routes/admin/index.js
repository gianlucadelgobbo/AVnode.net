const router = require('../router')();
const get = require('./api/get');
const put = require('./api/put');

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
  put.putData(req, res);
});



router.get('/api/:sez/:id/public/slugs/:slug', (req, res)=>{
  get.getSlug(req, res);
});


router.get('/api/:sez/:id/:form/', (req, res) => {
  get.getData(req, res);
});

router.get('/api/:sez/:id', (req, res) => {
  req.params.form = 'public';
  get.getData(req, res);
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
