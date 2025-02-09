import createRouter from "../../router.js";
const router = createRouter();
import config from 'getconfig';
import helpers from './helpers.js';

import mongoose from 'mongoose';
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
import { info, debugLog, error } from '../../../utilities/logger.js';
import pkg from 'i18n';
const { __ } = pkg;

import pkg2 from 'ssh2';
const { Client } = pkg2;

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
  debugLog("streamCommand");
  const conn = new Client();
  conn.on('ready', () => {
    debugLog('Client :: ready');
    debugLog(cmd);
    conn.exec(cmd, (err, stream) => {
      if (err) res.json(err);
      stream.on('close', (code, signal) => {
        debugLog('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', (data) => {
        debugLog(data);
        debugLog('STDOUT: ' + data);
        res.json({
          'CMD': cmd,
          'STDOUT': (""+data).replace("\n",""),
        });
      }).stderr.on('data', (data) => {
        //debugLog(data);
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
  debugLog("streamStop");
  var cmd = 'cd /home/hyo/streaming/ffplayout-engine/ && sh ./FFplayout_update_and_restart.sh';
  router.streamCommand(req, res, cmd);
}

router.streamStop = (req, res) => {
  debugLog("streamStop");
  var cmd = 'cd /home/hyo/streaming/ffplayout-engine/ && sh ./FFplayout_stop.sh';
  router.streamCommand(req, res, cmd);
}

router.streamRestart = (req, res) => {
  debugLog("streamStop");
  var cmd = 'cd /home/hyo/streaming/ffplayout-engine/ && sh ./FFplayout_restart.sh';
  router.streamCommand(req, res, cmd);
}

export default router;
