const config = require('getconfig');
const mongoose = require('mongoose');
const router = require('./router')();

const Event = mongoose.model('EventShow');
const Performance = mongoose.model('Performance');
const Video = mongoose.model('Video');
const Gallery = mongoose.model('Gallery');
const Footage = mongoose.model('Footage');
const Playlist = mongoose.model('Playlist');

const dataprovider = require('../utilities/dataprovider');
const logger = require('../utilities/logger');

router.get('/', (req, res) => {
  let homedata = {stats:{}};

  logger.debug('fetchevents');
  const section = 'events';
  const model = Event;
  const query = config.sections[section].categoriesQueries[config.sections[section].categories[0]];
  const select = config.sections[section].list_fields;
  const populate = config.sections[section].list_populate;
  const limit = config.sections[section].limit;
  const skip = 0;
  const sorting = config.sections[section].ordersQueries[config.sections[section].orders[0]]

  dataprovider.fetchLists(model, query, select, populate, limit, skip, sorting, (err, data, total) => {
    homedata.events = data;
    homedata.stats.events = total;

    logger.debug('fetchperformances');
    const section = 'performances';
    const model = Performance;
    const query = config.sections[section].categoriesQueries[config.sections[section].categories[0]];
    const select = config.sections[section].list_fields;
    const populate = config.sections[section].list_populate;
    const limit = config.sections[section].limit;
    const sorting = config.sections[section].ordersQueries[config.sections[section].orders[0]]
  
    dataprovider.fetchLists(model, query, select, populate, limit, skip, sorting, (err, data, total) => {
      homedata.performances = data;
      homedata.stats.performances = total;
  
      logger.debug('fetchvideos');
      const section = 'videos';
      const model = Video;
      const query = config.sections[section].categoriesQueries[config.sections[section].categories[0]];
      const select = config.sections[section].list_fields;
      const populate = config.sections[section].list_populate;
      const limit = config.sections[section].limit;
      const skip = 0;
      const sorting = config.sections[section].ordersQueries[config.sections[section].orders[0]]
    
      dataprovider.fetchLists(model, query, select, populate, limit, skip, sorting, (err, data, total) => {
        homedata.videos = data;
        homedata.stats.videos = total;
    
        logger.debug('fetchgalleries');
        const section = 'gallery';
        const model = Gallery;
        const query = config.sections[section].categoriesQueries[config.sections[section].categories[0]];
        const select = config.sections[section].list_fields;
        const populate = config.sections[section].list_populate;
        const limit = config.sections[section].limit;
        const skip = 0;
        const sorting = config.sections[section].ordersQueries[config.sections[section].orders[0]]
      
        dataprovider.fetchLists(model, query, select, populate, limit, skip, sorting, (err, data, total) => {
          homedata.galleries = data;
          homedata.stats.galleries = total;
      
          logger.debug('fetchfootage');
          const section = 'footage';
          const model = Footage;
          const query = config.sections[section].categoriesQueries[config.sections[section].categories[0]];
          const select = config.sections[section].list_fields;
          const populate = config.sections[section].list_populate;
          const limit = config.sections[section].limit;
          const skip = 0;
          const sorting = config.sections[section].ordersQueries[config.sections[section].orders[0]]
        
          dataprovider.fetchLists(model, query, select, populate, limit, skip, sorting, (err, data, total) => {
            homedata.footage = data;
            homedata.stats.footage = total;
        
            logger.debug('fetchplaylists');
            const section = 'playlists';
            const model = Playlist;
            const query = config.sections[section].categoriesQueries[config.sections[section].categories[0]];
            const select = config.sections[section].list_fields;
            const populate = config.sections[section].list_populate;
            const limit = config.sections[section].limit;
            const skip = 0;
            const sorting = config.sections[section].ordersQueries[config.sections[section].orders[0]]
          
            dataprovider.fetchLists(model, query, select, populate, limit, skip, sorting, (err, data, total) => {
              homedata.playlists = data;
              homedata.stats.playlists = total;

              if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
                if (process.env.DEBUG) {
                  res.render('json', {data:homedata});
                } else {
                  res.json({data:homedata});
                }
                logger.debug(err);
                //return next(err);
              } else {
                res.render('home', {
                  title: __('Welcome to AVnode network'),
                  subtitle: __('AVnode is an international network of artists and professionals organising activities in the field of audio visual performing arts.'),
                  data: homedata
                });
              }
            });
          });
        });
      });
    });
  });
});

module.exports = router;
