const router = require('../../router')();
const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const config = require('getconfig');

const logger = require('../../../utilities/logger');

router.unflatten = function( array, parent, tree ){

  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : { _id: 0 };

  var children = array.filter(child => child.ancestor == parent._id || !child.ancestor);
  logger.debug("children");
  logger.debug(children);
  logger.debug("parent");
  logger.debug(parent);

  if( children.length!==0  ){
      if( parent._id == 0 ){
         tree = children;   
      }else{
         parent['children'] = children;
      }
      for(let child in children){ 
        logger.debug(child);
        router.unflatten( array, child ) 
      }                    
  }
  logger.debug(tree);

  return tree;
}

router.get('/dbcheck', (req, res) => {
  Category.find({}).
  lean().
  sort('name').
  exec((err, cat) => {
    let catO = router.unflatten( cat );;
    cat.forEach(function(e) {
     /*  if (e.ancestor) {
        if (!catO[e.ancestor]) catO[e.ancestor] = []; 
        catO[e.ancestor].push(e);
      } */
      /* if (!e.ancestor) {
        if (!catO[e.rel]) {
          catO[e.rel] = {};
        }
        catO[e.rel][e._id] = e;
        catO[e.rel][e._id].son = [];
      } */
    });
    /* catO.stocazzo = {}
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
          for (var item in catO[e.rel]) {
            if (catO[e.rel][item][e.ancestor]) {
              catO[e.rel][item][e.ancestor].son.push(e);
              catO[e.rel][item][e.ancestor].son.sort(function(a, b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
              });
            } 
          }
          //catO.stocazzo.son.push(e);          
        }
      }
    }); */
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