
const router = require('../../router')();
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

router.unflatten = function( array, parent, tree ){

  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : { _id: 0 };

  var children = array.filter(child => child.ancestor == parent._id || !child.ancestor);
  console.log("children");
  console.log(children);
  console.log("parent");
  console.log(parent);

  if( children.length!==0  ){
      if( parent._id == 0 ){
         tree = children;   
      }else{
         parent['children'] = children;
      }
      for(let child in children){ 
        console.log(child);
        router.unflatten( array, child ) 
      }                    
  }
  console.log(tree);

  return tree;
}

router.get('/usersstatsupdate', (req, res) => {
  res.render('admindev/supertools/stats', {
    title: 'Users Update',
    superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
    currentUrl: req.originalUrl,
    body: {q:'[{"slug":"gianlucadelgobbo"},{"slug":"liz"}]'},
    //data: catO,
    script: false
  });

});

router.post('/usersstatsupdate', (req, res) => {
  let query = JSON.parse('{"q": '+req.body.q+'}').q;
  console.log(query);
  var promises = [];
  for (item in query) promises.push(router.setStatsAndActivity(query[item]));
  Promise.all(
    promises
  ).then( (results) => {
    res.render('admindev/supertools/stats', {
      title: 'Users Update',
      superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
      currentUrl: req.originalUrl,
      body: req.body,
      data: results,
      script: false
    });
  });
});


module.exports = router;