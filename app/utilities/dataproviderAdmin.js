const dataproviderAdmin = {};

const config = require('getconfig');
const helper = require('./helper');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Footage = mongoose.model('Footage');
// const Crew = mongoose.model('Crew');
const Performance = mongoose.model('Performance');
const Category = mongoose.model('Category');
const Playlist = mongoose.model('Playlist');
const Video = mongoose.model('Video');

const logger = require('./logger');

dataproviderAdmin.fetchUser = (id, cb) => {
  logger.debug('fetchUser');
  logger.debug(id);
  User.
  findById(id).
  //.select({'-galleries': 1})
  /*
  populate([{
    path: 'events',
    model: 'Event',
    populate: [{
      path: 'venues',
      model: 'Venue'
    }]
  }, {
    path: 'performances',
    model: 'Performance',
    populate: [{
      path: 'video',
      model: 'Asset'
    }],
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
    }
  }, {
    path: 'crews',
    model: 'User',
    populate: [{
      path: 'events',
      model: 'Event'
    }, {
      path: 'members', // virtual relation
      model: 'User',
      select: { '_id': 1, 'slug': 1, 'stagename': 1, 'username': 1 }
    }, {
      path: 'performances',
      model: 'Performance',
      populate: [{
        path: 'video',
        model: 'Asset'
      }],
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
      }
    }],
    select: {
      '-members': 1,
      'slug': 1,
      'stagename': 1,
      'username': 1,
      'abouts': 1,
      'image': 1,
      'teaserImage': 1,
      'file': 1
    }
  }]).
  */
  exec(cb);
};

module.exports = dataproviderAdmin;
