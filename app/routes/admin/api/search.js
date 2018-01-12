const router = require('../../router')();

const logger = require('../../../utilities/logger');
const elasticsearch = require('../../../utilities/elasticsearch');

router.get('/search/user', (req, res) => {
    const q = req.query.q;
    const apiCall = `api, router.get(/search/user/${JSON.stringify(req.query.q)})`;
    logger.debug(`${apiCall} searching: ${JSON.stringify(req.query.q)}`);
    const s = {
      index: elasticsearch.INDEX,
      type: 'user',
      body: {
        query: {
          // FIXME: only return three necessary fields…
          query_string: {
            query: q
          }
        }
      }
    };
    elasticsearch.getClient().search(s, (err, results) => {
      // BL FIXED results can be undefined -> app crash
      if (results.hits) {
        const flatResults = results.hits.hits.map((h) => {
          logger.debug(`${apiCall} hit: ${JSON.stringify(h)}`);
          return {
            id: h._id,
            stagename: h._source.stagename,
            name: '',
            imageUrl: h._source.imageUrl
          };
        });
        res.json(flatResults);
      } else {
        logger.debug(`${apiCall} results.hits undefined`);
        res.json([]);
      }
    });
  });
  
  router.get('/search/crew', (req, res) => {
    const q = req.query.q;
    const s = {
      index: elasticsearch.INDEX,
      type: 'crew',
      body: {
        query: {
          // FIXME: only return three necessary fields…
          query_string: {
            query: q
          }
        }
      }
    };
    elasticsearch.getClient().search(s, (err, results) => {
      const flatResults = results.hits.hits.map((h) => {
        return {
          id: h._id,
          name: h._source.name
        };
      });
      res.json(flatResults);
    });
  });
  
  router.get('/search/performance', (req, res) => {
    const q = req.query.q;
    const s = {
      index: elasticsearch.INDEX,
      type: 'performance',
      body: {
        query: {
          // FIXME: only return three necessary fields…
          query_string: {
            query: q
          }
        }
      }
    };
    elasticsearch.getClient().search(s, (err, results) => {
      const flatResults = results.hits.hits.map((h) => {
        return {
          id: h._id,
          title: h._source.title
        };
      });
      res.json(flatResults);
    });
  });
  module.exports = router;  