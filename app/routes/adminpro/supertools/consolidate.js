
import createRouter from "../../router.js";
const router = createRouter();

import helpers from '../../../utilities/helpers.js';
import mongoose from 'mongoose';
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Performance = mongoose.model('Performance');
const Gallery = mongoose.model('Gallery');
const Video = mongoose.model('Video');
const News = mongoose.model('News');
const Category = mongoose.model('Category');
import config from 'getconfig';

import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';
import { setStatsAndActivity, setStatsAndActivitySingle } from "../../../utilities/userstats.js";


/* router.unflatten = function( array, parent, tree ){

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
router.get('/', (req, res) => {
  console.log(query)
  User.count(query).
  lean().
  exec((err, count) => {
    console.log(count)
    res.render('adminpro/supertools/consolidate', {
      title: 'Consolidate Data',
      
      currentUrl: req.originalUrl,
      body: req.body,
      data: {usertoupdate:count},
      script: false
    });
  });

});

router.post('/users', (req, res) => {
  User.findOne({slug:"flyer"}).
  lean().
  select({_id:1}).
  exec((err, user) => {
    router.consolidateUser(user, req, res, (update) => {
      res.render('adminpro/supertools/consolidate', {
        title: 'Consolidate Data',
      
        currentUrl: req.originalUrl,
        body: req.body,
        data: {usertoupdate:update},
        script: false
      });
    })
  });
});

router.consolidateUser = (user, req, res, cb) => {
  var update = {
    performances: [],
    events: [],
    partnerships: [],
    news: [],
    galleries: [],
    videos: [],
  }
  const id = user._id
  Performance.find({users: id}).
  lean().
  select({_id:1}).
  exec((err, performances) => {
    console.log("performancesperformancesperformancesperformancesperformancesperformancesperformances")
    console.log(performances)
    update.performances = performances.map(item =>{return item._id})
    Event.find({users:id}).
    lean().
    select({_id:1}).
    exec((err, events) => {
      console.log("eventseventseventseventseventseventseventseventseventseventseventseventseventsevents")
      console.log(events)
      update.events = events.map(item =>{return item._id})
      Event.find({"partners.users":id}).
      lean().
      select({_id:1}).
      exec((err, partnerships) => {
        console.log("partnershipspartnershipspartnershipspartnershipspartnershipspartnershipspartnershipspartnershipspartnerships")
        console.log(partnerships)
        update.partnerships = partnerships.map(item =>{return item._id})
        News.find({users:id}).
        lean().
        select({_id:1}).
        exec((err, news) => {
          console.log("newsnewsnewsnewsnewsnewsnewsnewsnews")
          console.log(news)
          update.news = news.map(item =>{return item._id})
          Gallery.find({users:id}).
          lean().
          select({_id:1}).
          exec((err, galleries) => {
            console.log("galleriesgalleriesgalleriesgalleriesgalleriesgalleriesgalleries")
            console.log(galleries)
            update.galleries = galleries.map(item =>{return item._id})
            Video.find({users:id}).
            lean().
            select({_id:1}).
            exec((err, videos) => {
              console.log("videosvideosvideosvideosvideosvideosvideosvideosvideosvideos")
              console.log(videos)
              update.videos = videos.map(item =>{return item._id})
              console.log("updateupdateupdateupdateupdateupdateupdateupdateupdateupdate")
              console.log(update)
              var stats = {
                performances: update.performances.length,
                events: update.events.length,
                partnerships: update.partnerships.length,
                news: update.news.length,
                galleries: update.galleries.length,
                videos: update.videos.length
              }
              console.log(stats)

              cb(update)

            });
          });
        });
      });
    });
  });
}


router.post('/', (req, res) => {
  User.find(query).
  lean().
  //select({slug:100}).
  limit(1).
  exec((err, qq) => {
    console.log(qq)
    //let query = JSON.parse('{"q": '+req.body.q+'}').q;
    logger.info(qq);
    var promises = [];
    for (item in qq) promises.push(helpers.consolidateUser(qq[item]));
    for (item in qq) promises.push(setStatsAndActivity(qq[item]));
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


export default router;