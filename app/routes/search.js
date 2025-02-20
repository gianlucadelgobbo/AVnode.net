import createRouter from "./router.js";
const router = createRouter();

router.use('/', (req, res) => {
  res.render('search', {
    title: 'Search results',
    url: req.originalUrl,
    q: req.query.q
  });
});

/*
import { logger, requestLogger, errorLogger } from '../utilities/logger.js';

const elasticsearch = require('../utilities/elasticsearch');
const _ = require('lodash');


const allowedTypes = ['event', 'user', 'crew', 'performance'];

router.use('/:type?', ({ params, query }, res) => {
  const esClient = elasticsearch.getClient();
  const luceneEscapePattern = /(\+|\-|\&|\||\!|\(|\)|\{|\}|\[|\]|\^|\"|\~|\?|\:|\\)/g;
  const saneQuery = query.q.replace(luceneEscapePattern, '\\$1');

  const q = {
    index: elasticsearch.INDEX,
    body: {
      query: {
        query_string: {
          query: saneQuery
        }
      }
    }
  };
  if (params.type !== null && _.includes(allowedTypes, params.type)) {
    q.type = params.type;
  }
  
  logger.info('Search with the following query', JSON.stringify(q));
  esClient.search(q, (err, results) => {
    if (err) {
      logger.info('Search returned this error:', err.message);
      res.render('search', {
        title: '😱 – Oh noo!',
        subtitle: __('Search is currently unavailable…'),
        searchAvailable: false
      });
    } else {
      logger.info('Results', results.hits.hits);
      res.render('search', {
        title: __('Results'),
        data: results.hits.hits,
        resultCount: results.hits.total,
        searchAvailable: true,
        q: query.q
      });
    }
  });
}); */

export default router;
