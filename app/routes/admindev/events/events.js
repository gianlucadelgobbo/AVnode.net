const router = require('../../router')();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = mongoose.model('Event');
const ObjectId = Schema.ObjectId;
const User = mongoose.model('User');
const Performance = mongoose.model('Performance');
const Category = mongoose.model('Category');
const Gallery = mongoose.model('Gallery');
const Video = mongoose.model('Video');
const Subscription = mongoose.model('Subscription');

const request = require('request');
const fs = require('fs');
const config = require('getconfig');
const sharp = require('sharp');

const logger = require('../../../utilities/logger');

const populate_sub = [
  { 
    "path": "performance", 
    "select": "title image categories abouts", 
    "model": "Performance", 
    "populate": [
      { 
        "path": "users" , 
        "select": "stagename image abouts addresses social web",
        "model": "User",
        "populate": [
          { 
            "path": "members" , 
            "select": "stagename image abouts web social",
            "model": "User"
          }
        ]
      },{ 
        "path": "categories" , 
        "select": "name slug",
        "model": "Category",
        "populate": [
          { 
            "path": "ancestor" , 
            "select": "name slug",
            "model": "Category"
          }
        ]
      }
    ] 
  },{ 
    "path": "reference", 
    "select": "stagename image name surname email mobile", 
    "model": "User"
  }
];

const populate_event = [
      { 
        "path": "program.performance" , 
        "select": "title image abouts stats duration tech_arts tech_reqs",
        "model": "Performance",
        "populate": [
          { 
            "path": "users" , 
            "select": "stagename image abouts addresses social web",
            "model": "UserShow"
          },{ 
            "path": "videos" , 
            "select": "title image",
            "model": "Video"
          },{ 
            "path": "galleries" , 
            "select": "title image",
            "model": "Gallery"
          },{ 
            "path": "categories" , 
            "select": "name slug",
            "model": "Category",
            "populate": [
              { 
                "path": "ancestor" , 
                "select": "name slug",
                "model": "Category"
              }
            ]
          }
        ]
      },{ 
        "path": "program.schedule.categories" , 
        "select": "name slug",
        "model": "Category",
        "populate": [
          { 
            "path": "ancestor" , 
            "select": "name slug",
            "model": "Category"
          }
        ]
      },{ 
        "path": "program.subscription_id" , 
        //"select": "name slug",
        "model": "Subscription"
      }
    ];

const status = [
  { "_id" : "5be8708afc39610000000013", "name" : "accepted" },
  { "_id" : "5be8708afc39610000000097", "name" : "to be completed" },
  { "_id" : "5be8708afc3961000000011a", "name" : "not_accepted" },
  { "_id" : "5be8708afc3961000000019e", "name" : "accepted - waiting for payment" },
  { "_id" : "5be8708afc39610000000221", "name" : "refused from user" },
  { "_id" : "5c38c57d9d426a9522c15ba5", "name" : "to be evaluated" }
];

// V > db.events.findOne({"schedule.venue.location.locality":{$exists: true}},{schedule:1});
// V {"addresses.country": "Italy", "addresses.locality":{$in: ["Rome","Roma"]}},{addresses:1}

router.get('/:event', (req, res) => {
  logger.debug('/events/'+req.params.event);
  let data = {};
  Event.
  findOne({"_id": req.params.event}).
  //lean().
  select({title: 1, creation_date: 1}).
  exec((err, event) => {
    data.event = event;
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      console.log(data);
      res.render('admindev/events/dett', {
        title: 'Events',
        currentUrl: req.originalUrl,
        data: data,
        script: false
      });
    }
  });
});

router.get('/:event/acts', (req, res) => {
  logger.debug('/events/'+req.params.event+'/acts');
  let data = {};
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1, creation_date: 1, program: 1,organizationsettings: 1}).
  populate(populate_event).
  exec((err, event) => {
    if (err) {
      console.log(err);
    }
    console.log(event);
    data.event = event;
    Subscription.
    find({"event": event._id}).
    //lean().
    populate(populate_sub).
    //select({title: 1, creation_date: 1}).
    exec((err, subscriptions) => {
      console.log(subscriptions);
      for (let a=0; a<event.program.length;a++) {
        logger.debug("event.program[a].performance._id");
        logger.debug(event.program[a].performance._id);
        for (let b=0; b<subscriptions.length;b++) {
          logger.debug("subscriptions[b].performance");
          logger.debug(subscriptions[b].performance);
        }
      }
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        console.log(req.query);
        res.render('admindev/events/acts', {
          title: 'Events',
          status: status,
          currentUrl: req.originalUrl,
          get: req.query,
          data: data,
          script: false
        });
      }
    });
  });
});

module.exports = router;