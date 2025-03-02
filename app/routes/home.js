import createRouter from "./router.js";
const router = createRouter();

import config from 'getconfig';
import mongoose from 'mongoose';


const EventShow = mongoose.model('EventShow');
const Performance = mongoose.model('Performance');
const News = mongoose.model('News');

import dataprovider from '../utilities/dataprovider.js';

import { logger, requestLogger, errorLogger } from '../utilities/logger.js';


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
      const query = {"type": "5be8708afc3961000000011b","image.file": {$exists: true},"abouts.abouttext": {$exists: true},"bookings.0": {$exists: true},"createdAt": {$gte: new Date(new Date().setYear(new Date().getFullYear()-2))}};

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
          if (req.query.api || (req.headers.host && req.headers.host.split('.')[0]=='api') || (req.headers.host && req.headers.host.split('.')[1]=='api')) {
            if (process.env.DEBUG) {
              res.render('json', {data:homedata});
            } else {
              res.json({data:homedata});
            }
            //return next(err);
          } else {
            res.render('home', {
              title: req.__('Welcome to AVnode network'),
              subtitle: req.__('AVnode is an international network and database of artists and professionals organising activities in the field of audio visual performing arts.'),
              data: homedata,
              session: req.session,
              jsonld: {
                "@context": "http://schema.org",
                "@type": "WebSite",
                "url": res.locals.canonical,  // ✅ Usa il valore già calcolato!
                "description": req.__('AVnode is an international network and database of artists and professionals organising activities in the field of audio visual performing arts.'),
                "image": res.locals.canonical + "/images/sez/avnode.net-home.jpg",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": res.locals.canonical + "/search?&q={q}",
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

export default router;
