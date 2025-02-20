import createRouter from "../../router.js";
const router = createRouter();

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Emailqueue = mongoose.model('Emailqueue');

import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';

router.get('/', (req, res) => {
  router.getEmailqueue(req, res);
});

router.getEmailqueue = (req, res) => {
  logger.info('/getEmailqueue/'+req.params.id);
  logger.info("req.body");
  var ids = req.user.crews.map(item => {return item._id});
      logger.info(ids);
      logger.info(req.body);
      logger.info("req.params");
      logger.info(req.params);

      var query = {$or:[{organization: {$in: ids}}, {user: req.user._id}]};
      if (req.params.event) query.event = req.params.event;
      var populate = [
        {path: "organization", select: {stagename:1, slug:1}, model:"UserShow"},
        {path: "user", select: {stagename:1, slug:1}, model:"UserShow"},
        {path: "event", select: {title:1, slug:1}, model:"EventShow"}
      ];
      Emailqueue.
      find(query).
      //sort({stagename: 1}).
      //select({stagename: 1, createdAt: 1, crews:1}).
      populate(populate).
      exec((err, data) => {
        logger.info("data");
        logger.info(data);
        if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
          res.json(data);
        } else {
          res.render('adminpro/emailqueue/send', {
            title: 'Email queue',
            currentUrl: req.originalUrl,
            map: req.query.map,
            csv: req.query.csv,
            body: req.body,
            event: req.params.event,
            
            owner: req.params.id,
            //events: events,
            user: req.user,
            data: data,
            script: false
          });
        }
      });
}

export default router;