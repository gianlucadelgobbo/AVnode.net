const config = require('getconfig');
const mongoose = require('mongoose');
const router = require('./router')();

const EventShow = mongoose.model('EventShow');
const Performance = mongoose.model('Performance');
const News = mongoose.model('News');

const dataprovider = require('../utilities/dataprovider');

const logger = require('../utilities/logger');

router.get('/', (req, res) => {
  if (req.originalUrl.indexOf("sitemap.xml")!==-1) {
  } else {
    let homedata = {stats:{}};
    const section = 'events';
    const model = EventShow;
    const query = config.sections[section].categoriesQueries[config.sections[section].categories[0]];
    const select = config.sections[section].list_fields;
    const populate = config.sections[section].list_populate;
    const limit = 3;
    const skip = 0;
    const sorting = config.sections[section].ordersQueries[config.sections[section].orders[0]];
  
    dataprovider.fetchLists(model, query, select, populate, limit, skip, sorting, (err, data, total) => {
      homedata.events = data;
      homedata.stats.events = total;
      const section = 'performances';
      const model = Performance;
      const populate = config.sections[section].list_populate;
      //const query = config.sections[section].categoriesQueries[config.sections[section].categories[0]];
      let select = config.sections[section].list_fields;
      select.abouts = 1;
      const query = {"categories": "5be8708afc3961000000011b","image.file": {$exists: true},"abouts.abouttext": {$exists: true},"bookings.0": {$exists: true},"createdAt": {$gte: new Date(new Date().setYear(new Date().getFullYear()-2))}};

      dataprovider.fetchRandomPerformance(model, query, select, populate, limit, skip, sorting, (err, data, total) => {
        homedata.performances = data;
        homedata.stats.performances = total;
    
        const section = 'news';
        const model = News;
        const query = config.sections[section].categoriesQueries[config.sections[section].categories[0]];
        const select = config.sections[section].list_fields;
        const populate = config.sections[section].list_populate;
        const limit = 3;
        const skip = 0;
        const sorting = config.sections[section].ordersQueries[config.sections[section].orders[0]]
      
        dataprovider.fetchLists(model, query, select, populate, limit, skip, sorting, (err, data, total) => {
          homedata.news = data;
          homedata.stats.news = total;
      

  
                if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
                  if (process.env.DEBUG) {
                    res.render('json', {data:homedata});
                  } else {
                    res.json({data:homedata});
                  }
                  //return next(err);
                } else {
                  res.render('home', {
                    title: __('Welcome to AVnode network'),
                    subtitle: __('AVnode is an international network and database of artists and professionals organising activities in the field of audio visual performing arts.'),
                    data: homedata,
                    canonical: (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl.split("?")[0],
                    jsonld: {
                      "@context": "http://schema.org",
                      "@type": "WebSite",
                      "url": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl,
                      "description": __('AVnode is an international network and database of artists and professionals organising activities in the field of audio visual performing arts.'),
                      "image": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+"images/avnode_mainimg.jpg",
                      "potentialAction": {
                        "@type": "SearchAction",
                        "target": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+"search?&q={q}",
                        "query-input": {
                          "@type": "PropertyValueSpecification",
                          "valueRequired": false,
                          "valueName": "q"
                        }
                      }
                    }          
                  });
                }
              });
            });
          });
  }
});

module.exports = router;
