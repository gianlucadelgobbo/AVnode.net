const logger = require('../../utilities/logger');
const elasticsearch = require('../elasticsearch');
const TYPE = 'venue';

const cleanForIndex = (venue) => {
  return {
    index: elasticsearch.INDEX,
    type: TYPE,
    id: `${venue._id}`,
    body: {
      name: venue.name
    }
  };
};

module.exports = (es = elasticsearch) => {
  return function elasticsearchIndexPlugin(schema, _opts) {
    schema.post('save', function save() {
      const clean = cleanForIndex(this);
      logger.debug(`Indexing ${TYPE}`);
      logger.debug(clean);
      es.getClient().index(clean, (error, _res) => {
        if (error) {
          logger.debug(`Indexing ${TYPE} failed`);
        } else {
          logger.debug(`Indexing ${TYPE} success`);
        }
      });
    });

    schema.post('remove', (entity) => es.remover(TYPE)(entity));
  };
};

module.exports.cleanForIndex = cleanForIndex;