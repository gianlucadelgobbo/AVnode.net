const router = require('../../router')();
const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const config = require('getconfig');

const logger = require('../../../utilities/logger');

router.get('/dbcheck', (req, res) => {
  Category.find({}).
  lean().
  sort('name').
  exec((err, cat) => {
    let catO = {};
    cat.forEach(function(e) {
      if (!e.ancestor) {
        if (!catO[e.rel]) {
          catO[e.rel] = {};
        }
        catO[e.rel][e._id] = e;
        catO[e.rel][e._id].son = [];
      }
    });
    catO.stocazzo = {}
    catO.stocazzo.son = [];
    cat.forEach(function(e) {
      if (e.ancestor) {
        if (catO[e.rel][e.ancestor]) {
          catO[e.rel][e.ancestor].son.push(e);
          catO[e.rel][e.ancestor].son.sort(function(a, b){
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
          });
        } else {
          catO.stocazzo.son.push(e);          
        }
      }
    });
    res.render('admindev/supertools/categories/showall', {
      title: 'Categories',
      superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
      currentUrl: req.originalUrl,
      data: catO,
      script: false
    });
  });
});

module.exports = router;