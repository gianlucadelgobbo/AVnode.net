import createRouter from "../../router.js";
const router = createRouter();


import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';

import pkg2 from 'ssh2';
const { Client } = pkg2;

router.streamCommand = (req, res, cmd) => {
  logger.info("streamCommand");
  const conn = new Client();
  conn.on('ready', () => {
    logger.info('Client :: ready');
    logger.info(cmd);
    conn.exec(cmd, (err, stream) => {
      if (err) res.json(err);
      stream.on('close', (code, signal) => {
        logger.info('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', (data) => {
        logger.info(data);
        logger.info('STDOUT: ' + data);
        res.json({
          'CMD': cmd,
          'STDOUT': (""+data).replace("\n",""),
        });
      }).stderr.on('data', (data) => {
        //logger.info(data);
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
  logger.info("streamStop");
  var cmd = 'cd /home/hyo/streaming/ffplayout-engine/ && sh ./FFplayout_update_and_restart.sh';
  router.streamCommand(req, res, cmd);
}

router.streamStop = (req, res) => {
  logger.info("streamStop");
  var cmd = 'cd /home/hyo/streaming/ffplayout-engine/ && sh ./FFplayout_stop.sh';
  router.streamCommand(req, res, cmd);
}

router.streamRestart = (req, res) => {
  logger.info("streamStop");
  var cmd = 'cd /home/hyo/streaming/ffplayout-engine/ && sh ./FFplayout_restart.sh';
  router.streamCommand(req, res, cmd);
}

export default router;
