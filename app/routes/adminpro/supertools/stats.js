
const router = require('../../router')();
const helpers = require('../../admin/api/helpers.js');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Performance = mongoose.model('Performance');
const Gallery = mongoose.model('Gallery');
const Video = mongoose.model('Video');
const News = mongoose.model('News');
const Footage = mongoose.model('Footage');
const Playlist = mongoose.model('Playlist');
const Category = mongoose.model('Category');
const config = require('getconfig');

const logger = require('../../../utilities/logger');

/* router.unflatten = function( array, parent, tree ){

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
} */


const query = {
  "stats.date": {$lt: new Date(new Date().getTime()-86400000)},
  $or:[
    {"performances.0":{"$exists": true}},
    {"events.0":{"$exists": true}},
    {"news.0":{"$exists": true}},
    {"galleries.0":{"$exists": true}},
    {"videos.0":{"$exists": true}},
    {"news.0":{"$exists": true}}
  ]
};
router.get('/usersstatsupdate', (req, res) => {
  User.count(query).
  lean().
  exec((err, count) => {
    //console.log(count)
    res.render('adminpro/supertools/stats', {
      title: 'Users Update Statistics',
      
      currentUrl: req.originalUrl,
      body: req.body,
      data: {usertoupdate:count},
      script: false
    });
  });

});

router.post('/usersstatsupdate', (req, res) => {
  User.find(query).
  lean().
  select({slug:100}).
  limit(400).
  exec((err, qq) => {
    console.log(qq)
    //let query = JSON.parse('{"q": '+req.body.q+'}').q;
    logger.debug(qq);
    var promises = [];
    for (item in qq) promises.push(helpers.setStatsAndActivity(qq[item]));
    //for (item in qq) console.log(query[item])
    Promise.all(
      promises
    ).then( (results) => {
      User.count(query).
      lean().
      exec((err, count) => {
        res.render('adminpro/supertools/stats', {
          title: 'Users Update',
          
          currentUrl: req.originalUrl,
          body: req.body,
          data: {usertoupdate:count,results:results},
          script: false
        });
      })
    });
  })
});


module.exports = router;