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

const populate = [
  { 
    "path": "performance", 
    "select": "title image categories abouts", 
    "model": "Performance", 
    "populate": [
      { 
        "path": "users" , 
        "select": "stagename image abouts addresses social web",
        "model": "UserShow",
        "populate": [
          { 
            "path": "members" , 
            "select": "stagename image abouts web social",
            "model": "UserShow"
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
  //lean().
  select({title: 1, creation_date: 1}).
  exec((err, event) => {
    data.event = event;
    Subscription.
    find({"event": event._id}).
    //lean().
    populate(populate).
    //select({title: 1, creation_date: 1}).
    exec((err, subscriptions) => {
      data.subscriptions = subscriptions;
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        console.log(data);
        res.render('admindev/events/acts', {
          title: 'Events',
          currentUrl: req.originalUrl,
          data: data,
          script: false
        });
      }
    });
  });
});

module.exports = router;