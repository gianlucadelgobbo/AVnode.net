
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

router.setStatsAndActivity = function(query) {
  return new Promise(function (resolve, reject) {
    //let query = JSON.parse('{"q": '+req.body.q+'}').q;
    console.log("router.setStatsAndActivity 1");
    console.log(query);
    User.
    findOne(query).
    exec((err, e) => {
      var myids = [e._id];
      console.log("router.setStatsAndActivity 2");
      Promise.all([
        Event.find({"users": {$in: myids}, "is_public": true}).select("_id"),
        Event.find({"partners.users": {$in: myids}, "is_public": true}).select("_id"),
        Performance.find({"users": {$in: myids}, "is_public": true}).select("_id"),
        Gallery.find({"users": {$in: myids}, "is_public": true}).select("_id"),
        Video.find({"users": {$in: myids}, "is_public": true}).select("_id"),
        News.find({"users": {$in: myids}, "is_public": true}).select("_id"),
        Footage.find({"users": {$in: myids}, "is_public": true}).select("_id"),
        Playlist.find({"users": {$in: myids}, "is_public": true}).select("_id"),

        Performance.countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc39610000000017"}),
        Performance.countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc39610000000016"}),
        Performance.countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc39610000000014"}),
        Performance.countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc39610000000099"}),
        Performance.countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc3961000000011b"}),
        Performance.countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc3961000000011c"}),
        Performance.countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc3961000000011d"}),
        Performance.countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc3961000000019f"}),
        Performance.countDocuments({"users": {$in: myids}, "is_public": true, "type": "5be8708afc396100000001a1"}),

        Performance.countDocuments({"users": {$in: myids}, "is_public": true, creation_date:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Event.countDocuments({"users": {$in: myids}, "is_public": true, creation_date:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Event.countDocuments({"partners.users": {$in: myids}, "is_public": true, creation_date:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Footage.countDocuments({"users": {$in: myids}, "is_public": true, creation_date:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Playlist.countDocuments({"users": {$in: myids}, "is_public": true, creation_date:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Video.countDocuments({"users": {$in: myids}, "is_public": true, creation_date:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        Gallery.countDocuments({"users": {$in: myids}, "is_public": true, creation_date:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}}),
        News.countDocuments({"users": {$in: myids}, "is_public": true, creation_date:{"$gte": new Date(new Date().getTime()-(365*3*24*60*60*1000))}})

      ]).then( ([ events, partnerships, performances, galleries, videos, news, footage, playlists, lightsinstallation,mapping,vjset,workshop,avperformance,projectshowcase,djset,videoinstallation,lecture, recent_events, recent_partnerships, recent_performances, recent_galleries, recent_videos, recent_news, recent_footage, recent_playlists ]) => {
        e.events = events;
        e.performances = performances;
        e.partnerships = partnerships;
        e.galleries = galleries;
        e.videos = videos;
        e.news = news;
        e.footage = footage;
        e.playlists = playlists;

        e.stats = {};
        if (e.is_crew && e.members && e.members.length) e.stats.members = e.members.length;
        if (!e.is_crew && e.crews && e.crews.length) e.stats.crews = e.crews.length;
    
        if (e.performances && e.performances.length) e.stats.performances = e.performances.length;
        if (e.events && e.events.length) e.stats.events = e.events.length;
        if (e.partnerships && e.partnerships.length) e.stats.partnerships = e.partnerships.length;
        if (e.footage && e.footage.length) e.stats.footage = e.footage.length;
        if (e.playlists && e.playlists.length) e.stats.playlists = e.playlists.length;
        if (e.videos && e.videos.length) e.stats.videos = e.videos.length;
        if (e.galleries && e.galleries.length) e.stats.galleries = e.galleries.length;
        if (e.news && e.news.length) e.stats.news = e.news.length;

        e.stats["lights-installation"] = lightsinstallation;
        e.stats["mapping"] = mapping;
        e.stats["vj-set"] = vjset;
        e.stats["workshop"] = workshop;
        e.stats["av-performance"] = avperformance;
        e.stats["project-showcase"] = projectshowcase;
        e.stats["dj-set"] = djset;
        e.stats["video-installation"] = videoinstallation;
        e.stats["lecture"] = lecture;

        e.stats.recent = {};
        e.stats.recent.events = recent_events;
        e.stats.recent.partnerships = recent_partnerships;
        e.stats.recent.performances = recent_performances;
        e.stats.recent.galleries = recent_galleries;
        e.stats.recent.videos = recent_videos;
        e.stats.recent.news = recent_news;
        e.stats.recent.footage = recent_footage;
        e.stats.recent.playlists = recent_playlists;

        console.log("router.setStatsAndActivity 3");
        console.log(e.stats);
        e.activity = router.getActivity(e.stats);
        e.activity_as_performer = router.getActivityAsPerformer(e.stats);
        e.activity_as_organization = router.getActivityAsOrganization(e.stats);
        e.save((err) => {
          if (err) {
            console.log('save user err');
            console.log(err);
            setTimeout(function() {
              resolve(err);
            }, 1000);
          } else {
            console.log("router.setStatsAndActivity 4");
            console.log(e.stats);
            setTimeout(function() {
              resolve(e.stats);
            }, 1000);
          }
        });
      });
    });
  });
}
router.getActivity = (stats) => {
  let activity = 0;
  activity+= (stats.performances ? stats.performances * 100 : 0);
  activity+= (stats.events ? stats.events             * 50 : 0);
  activity+= (stats.partnerships ? stats.partnerships * 5 : 0);
  //activity+= (stats.footage ? stats.footage           * 1 : 0);
  //activity+= (stats.playlists ? stats.playlists       * 2 : 0);
  activity+= (stats.videos ? stats.videos             * 3 : 0);
  activity+= (stats.galleries ? stats.galleries       * 1 : 0);
  activity+= (stats.news ? stats.news                 * 1 : 0);
  activity+= (stats.recent.performances ? stats.recent.performances * 1000 : 0);
  activity+= (stats.recent.events ? stats.recent.events             * 500 : 0);
  activity+= (stats.recent.partnerships ? stats.recent.partnerships * 50 : 0);
  //activity+= (stats.recent.footage ? stats.recent.footage           * 10 : 0);
  //activity+= (stats.recent.playlists ? stats.recent.playlists       * 20 : 0);
  activity+= (stats.recent.videos ? stats.recent.videos             * 30 : 0);
  activity+= (stats.recent.galleries ? stats.recent.galleries       * 10 : 0);
  activity+= (stats.recent.news ? stats.recent.news                 * 10 : 0);

  return activity;
}

router.getActivityAsPerformer = (stats) => {
  let activity_as_performer = 0;
  activity_as_performer+= (stats.performances ? stats.performances * 100 : 0);
  //activity_as_performer+= (stats.footage ? stats.footage           * 1 : 0);
  //activity_as_performer+= (stats.playlists ? stats.playlists       * 1 : 0);

  activity_as_performer+= (stats.recent.performances ? stats.recent.performances * 1000 : 0);
  //activity_as_performer+= (stats.recent.footage ? stats.recent.footage           * 10 : 0);
  //activity_as_performer+= (stats.recent.playlists ? stats.recent.playlists       * 10 : 0);
  return activity_as_performer;
}

router.getActivityAsOrganization = (stats) => {
  let activity_as_organization = 0;
  activity_as_organization+= (stats.events ? stats.events             * 10 : 0);
  activity_as_organization+= (stats.partnerships ? stats.partnerships * 1 : 0);
  activity_as_organization+= (stats.videos ? stats.videos             * 1 : 0);
  activity_as_organization+= (stats.galleries ? stats.galleries       * 1 : 0);
  activity_as_organization+= (stats.news ? stats.news                 * 1 : 0);

  activity_as_organization+= (stats.recent.events ? stats.recent.events             * 100 : 0);
  activity_as_organization+= (stats.recent.partnerships ? stats.recent.partnerships * 10 : 0);
  activity_as_organization+= (stats.recent.videos ? stats.recent.videos             * 10 : 0);
  activity_as_organization+= (stats.recent.galleries ? stats.recent.galleries       * 10 : 0);
  activity_as_organization+= (stats.recent.news ? stats.recent.news                 * 10 : 0);

  return activity_as_organization;
}


module.exports = router;