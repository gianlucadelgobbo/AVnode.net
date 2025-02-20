import createRouter from "../../router.js";
const router = createRouter();

import mongoose from 'mongoose';
const Category = mongoose.model('Category');
import config from 'getconfig';

import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';


router.unflatten = function( array, parent, tree ){

  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : { _id: 0 };

  var children = array.filter(child => child.ancestor == parent._id || !child.ancestor);
  logger.info("children");
  logger.info(children);
  logger.info("parent");
  logger.info(parent);

  if( children.length!==0  ){
      if( parent._id == 0 ){
         tree = children;   
      }else{
         parent['children'] = children;
      }
      for(let child in children){ 
        logger.info(child);
        router.unflatten( array, child ) 
      }                    
  }
  logger.info(tree);

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
    res.render('adminpro/supertools/categories/showall', {
      title: 'Categories',
      
      currentUrl: req.originalUrl,
      data: catO,
      script: false
    });
  });
});

export default router;