const router = require('../../router')();
let config = require('getconfig');
let helpers = require('./helpers');

const mongoose = require('mongoose');
const Models = {
  'Category': mongoose.model('Category'),
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'EventShow': mongoose.model('EventShow'),
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Video': mongoose.model('Video'),
  'VenueDB': mongoose.model('VenueDB'),
  'AddressDB': mongoose.model('AddressDB'),
  'Program': mongoose.model('Program'),
  'Emailqueue': mongoose.model('Emailqueue')
}
const logger = require('../../../utilities/logger');
const { __ } = require('i18n');
const partners_categories = [
  {
    "_id" : ("5be8708afc396100000001e8"),
    "name" : "CO-ORGANIZER"
  },
  {
    "_id" : ("5be8708afc396100000000fe"),
    "name" : "SUPPORTED BY"
  },
  {
    "_id" : ("5be8708afc3961000000026c"),
    "name" : "IN COLLABORATION"
  },
  {
    "_id" : ("5be8708afc3961000000005e"),
    "name" : "FRIENDS / CONTENTS"
  },
  {
    "_id" : ("5be8708afc3961000000007a"),
    "name" : "TECHNICAL PARTNERS"
  },
  {
    "_id" : ("5be8708afc3961000000007b"),
    "name" : "LPM NETWORK"
  },
  {
    "_id" : ("5be8708afc396100000000e0"),
    "name" : "TOP MEDIA PARTNERS"
  },
  {
    "_id" : ("5be8708afc39610000000165"),
    "name" : "MEDIA PARTNERS"
  },
  {
    "_id" : ("5be8708afc396100000000e1"),
    "name" : "APPROVED BY"
  },
  {
    "_id" : ("5be8708afc39610000000164"),
    "name" : "ISTITUZIONI"
  },
  {
    "_id" : ("5be8708afc396100000000e2"),
    "name" : "NETWORK EVENTS"
  }
];

router.streamCommand = (req, res, cmd) => {
  logger.debug("streamCommand");
  const { Client } = require('ssh2');  
  const conn = new Client();
  conn.on('ready', () => {
    logger.debug('Client :: ready');
    logger.debug(cmd);
    conn.exec(cmd, (err, stream) => {
      if (err) res.json(err);
      stream.on('close', (code, signal) => {
        logger.debug('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', (data) => {
        logger.debug(data);
        logger.debug('STDOUT: ' + data);
        res.json({
          'CMD': cmd,
          'STDOUT': (""+data).replace("\n",""),
        });
      }).stderr.on('data', (data) => {
        //logger.debug(data);
      });
    });
  }).connect({
    host: process.env.STREAM_SSH_HOST,
    port: 22,
    username: process.env.STREAM_SSH_USER,
    password: process.env.STREAM_SSH_PASSWORD
  });
}

router.streamUpdateAndRestart = (req, res) => {
  logger.debug("streamStop");
  var cmd = 'cd /home/hyo/streaming/ffplayout-engine/ && sh ./FFplayout_update_and_restart.sh';
  router.streamCommand(req, res, cmd);
}

router.streamStop = (req, res) => {
  logger.debug("streamStop");
  var cmd = 'cd /home/hyo/streaming/ffplayout-engine/ && sh ./FFplayout_stop.sh';
  router.streamCommand(req, res, cmd);
}

router.streamRestart = (req, res) => {
  logger.debug("streamStop");
  var cmd = 'cd /home/hyo/streaming/ffplayout-engine/ && sh ./FFplayout_restart.sh';
  router.streamCommand(req, res, cmd);
}

module.exports = router;
