const dataprovider = {};

const config = require('getconfig');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Performer = mongoose.model('Performer');
// const Crew = mongoose.model('Crew');
const Performance = mongoose.model('Performance');

const logger = require('./logger');

dataprovider.fetchUser = (id, cb) => {
  logger.debug('fetchUser');
  logger.debug(id);
  User
      .findById(id)
      //.select({'-galleries': 1})
      .populate([{
        path: 'image',
        model: 'Asset'
      }, {
        path: 'teaserImage',
        model: 'Asset'
      }, {
        path: 'events',
        model: 'Event',
        populate: [{
          path: 'image',
          model: 'Asset'
        }, {
          path: 'teaserImage',
          model: 'Asset'
        }, {
          path: 'venues',
          model: 'Venue'
        }]
      }, {
        path: 'performances',
        model: 'Performance',
        select: {
          'slug': 1,
          'title': 1,
          'about': 1,
          'aboutlanguage': 1,
          'abouts': 1,
          'image': 1,
          'teaserImage': 1,
          'file': 1,
          'categories': 1,
          'tech_art': 1,
          'tech_req': 1,
          'video': 1
        },
        populate: [{
          path: 'image',
          model: 'Asset'
        }, {
          path: 'teaserImage',
          model: 'Asset'
        }, {
          path: 'video',
          model: 'Asset'
        }] //, {
        //path: 'performers', select: { 'stagename': 1 } // virtual relation
        //}//, { //, 'events': 0, 'crews': 0, 'performances': 0, 'addresses': 0, 'emails': 0
        //path: 'crews' // virtual relation
        //}   
      }, {
        path: 'crews',
        select: {
          '-members': 1,
          'slug': 1,
          'stagename': 1,
          'username': 1,
          'abouts': 1,
          'image': 1,
          'teaserImage': 1,
          'file': 1
        },
        model: 'User',
        populate: [{
          path: 'image',
          model: 'Asset'
        }, {
          path: 'teaserImage',
          model: 'Asset'
        }, {
          path: 'events',
          model: 'Event'
        }, {
          path: 'members', // virtual relation
          model: 'User',
          select: { '_id': 1, 'slug': 1, 'stagename': 1, 'username': 1 }
        }]
      }])
      .exec(cb);
};

dataprovider.fetchPerformer = (req, cb) => {
  logger.debug('fetchPerformer'+req.params.slug);  
  Performer.
  findOne({slug: req.params.slug}).
  populate([{
    path: 'image',
    model: 'Asset'
  }]).
  exec((err, performer) => {
    logger.debug("exec");
    logger.debug(performer);
    cb(err, performer);
  });
};

dataprovider.fetchPerformers = (query, limit, skip, sorting, cb) => {
  logger.debug('fetchPerformers');  
  User.count(query, function(error, total) {
    User.find(query)
    .populate([{
      path: 'image',
      model: 'Asset'
    }])  
    .limit(limit)
    .skip(skip)
    .sort(sorting)
    /*.select(config.sections[section].list_fields)*/
    .exec(function(err, data) {
      cb(err, data, total);
    });
  });
/*
  User.find({})
  .populate([{
    path: 'image',
    model: 'Asset'
  }])
  .limit(5)
  .exec((err, data) => {
    cb(err, data);
  });
  */
};


module.exports = dataprovider;