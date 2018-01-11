const router = require('../router')();
const logger = require('../../utilities/logger');

const dataprovider = require('../../utilities/dataprovider');

router.get('/', (req, res, next) => {
  logger.debug('Performer');
  dataprovider.fetchPerformer(req, (err, performer) => {
    logger.debug(err);

    if (err || performer === null) {
      //return next(err);
      res.status(404).render('404', {});
    } else {
      if (req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        //return next(err);
        res.send(performer);
      } else {
        res.render('performers/show', {
          title: performer.stagename,
          performer: performer
        });  
      }  
    }
   });
});

module.exports = router;