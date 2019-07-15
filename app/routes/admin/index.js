const router = require('../router')();
const config = require('getconfig');

const get = require('./api/get');
const put = require('./api/put');
const post = require('./api/post');
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

router.get('/api/profile/emails/verify/:email', (req, res)=>{
  req.params.id = req.user.id;
  req.params.sez = 'profile';
  get.sendEmailVericaition(req, res);
});

router.get('/api/profile/emails/email/:email', (req, res)=>{
  get.getEmail(req, res);
});

router.get('/api/:sez/new/slugs/:slug', (req, res)=>{
  get.getSlug(req, res);
});

router.get('/api/:sez/:id/public/slugs/:slug', (req, res)=>{
  get.getSlug(req, res);
});

router.get('/api/:sez/:id/delete', (req, res) => {
  get.getDelete(req, res);
});

router.get('/api/:sez/:id/:form/', (req, res) => {
  get.getData(req, res);
});

router.get('/api/countries', (req, res) => {
  get.getCountries(req, res);
});

router.get('/api/getcategories/:rel/slug/:q', (req, res)=>{
  get.getCategories(req, res);
});

router.get('/api/getmembers/:q', (req, res)=>{
  get.getMembers(req, res);
});

router.get('/api/getauthors/:q', (req, res)=>{
  get.getAuthors(req, res);
});

router.get('/api/removeAddress', (req, res)=>{
  get.removeAddress(req, res);
});

router.get('/api/crews/:id/members/add/:member', (req, res)=>{
  get.addMember(req, res);
});

router.get('/api/crews/:id/members/remove/:member', (req, res)=>{
  get.removeMember(req, res);
});

router.get('/api/:sez/:id/users/add/:user', (req, res)=>{
  get.addUser(req, res);
});

router.get('/api/:sez/:id/users/remove/:user', (req, res)=>{
  get.removeUser(req, res);
});

router.get('/api/galleries/:id/mediaremove/:image', (req, res)=>{
  req.params.sez = 'galleries';
  get.removeImage(req, res);
});

router.get('/api/playlists/:id/footageremove/:footage', (req, res)=>{
  req.params.sez = 'playlists';
  get.removeFootage(req, res);
});

router.get('/api/events/:id/performance/add/:performance', (req, res)=>{
  get.addPerformance(req, res);
});

router.get('/api/events/:id/performance/remove/:performance', (req, res)=>{
  get.removePerformance(req, res);
});

router.get('/api/events/:id/gallery/add/:gallery', (req, res)=>{
  get.addGallery(req, res);
});

router.get('/api/events/:id/gallery/remove/:gallery', (req, res)=>{
  get.removeGallery(req, res);
});

router.get('/api/subscriptions', (req, res) => {
  req.params.id = req.user.id;
  req.params.sez = 'subscriptions';
  req.query.api = true;
  get.getSubscriptions(req, res);
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

router.get('/subscriptions', (req, res) => {
  req.params.id = req.user.id;
  req.params.sez = 'subscriptions';
  get.getSubscriptions(req, res);
});

router.get('/*', (req, res) => {
  res.render('admin/index', {
    title: __('Your Account'),
    is_admin: true
  });
});

router.post('/api/profile/emails/updateSendy', (req, res)=>{
  post.updateSendy(req, res);
});

router.post('/api/:sez/new/', (req, res) => {
  post.postData(req, res);
});

router.post('/api/partner/unlink/', (req, res) => {
  post.unlinkPartner(req, res);
});

router.post('/api/partner/link/', (req, res) => {
  post.linkPartner(req, res);
});

router.post('/api/partnershipsupdate', (req, res) => {
  post.updatePartnerships(req, res);
});

router.post('/api/:ancestor/:id/:sez/', (req, res) => {
  post.postData(req, res);
});

/* router.post('/api/performances/:id/videos', (req, res)=>{
  req.params.model = 'Performance';
  get.addVideo(req, res);
});

router.post('/api/performances/:id/galleries', (req, res)=>{
  req.params.model = 'Performance';
  get.addGallery(req, res);
});

router.post('/api/events/:id/videos', (req, res)=>{
  req.params.model = 'Event';
  get.addVideo(req, res);
});

router.post('/api/events/:id/galleries', (req, res)=>{
  req.params.model = 'Event';
  get.addGallery(req, res);
}); */

router.post('/api/programupdate', (req, res)=>{
  post.updateProgram(req, res);
});

router.post('/api/subscriptionupdate', (req, res)=>{
  post.updateSubscription(req, res);
});

router.post('/api/cancelsubscription', (req, res)=>{
  post.cancelSubscription(req, res);
});

router.post('/api/editsubscription', (req, res)=>{
  post.editSubscription(req, res);
});

router.post('/api/editsubscriptionsave', (req, res)=>{
  post.editSubscriptionSave(req, res);
});

router.put('/api/profile/:form/', (req, res) => {
  req.params.id = req.user.id;
  req.params.sez = 'profile';
  if (['profile/image'].indexOf(req.params.sez+'/'+req.params.form)!== -1) {
    req.params.comp = req.params.form;
    upload.uploader(req, res, (err, data) => {
      if (err) {
        res.status(500).json(err);
      } else {
        for (const item in data) req.body[item] = data[item];
        put.putData(req, res);
      }
    });
  } else {
    put.putData(req, res);
  }
});

router.put('/api/:sez/:id/:form/', (req, res) => {
  if (['profile/image','crews/image','events/image','performances/image','footage/media','galleries/medias','videos/video'].indexOf(req.params.sez+'/'+req.params.form)!== -1) {
    req.params.comp = ['footage/media','videos/video'].indexOf(req.params.sez+'/'+req.params.form)!== -1 ? "media" : ['galleries/medias'].indexOf(req.params.sez+'/'+req.params.form)!== -1 ? "image" : req.params.form;
    console.log("stocaupload");
    upload.uploader(req, res, (err, data) => {
      if (err) {
        res.status(500).json(err);
      } else {
        for (const item in data) req.body[item] = data[item];
        put.putData(req, res);
      }
    });
  } else {
    put.putData(req, res);
  }
});

module.exports = router;
