const router = require('./router')();
const elasticsearch = require('../plugins/elasticsearch');
const _ = require('lodash');
const logger = require('../utilities/logger');
const i18n = require('../plugins/i18n');

const allowedTypes = ['event', 'user', 'crew'];

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
  
  logger.debug('Search with the following query', JSON.stringify(q));
  esClient.search(q, (err, results) => {
    if (err) {
      logger.debug('Search returned this error:', err.message);
      res.render('search', {
        title: '😱 – Oh noo!',
        subtitle: i18n.__('Search is currently unavailable…'),
        searchAvailable: false
      });
    } else {
      logger.debug('Results', results.hits.hits);
      res.render('search', {
        title: i18n.__('Results'),
        data: results.hits.hits,
        resultCount: results.hits.total,
        searchAvailable: true,
        q: query.q
      });
    }
  });
});

module.exports = router;
