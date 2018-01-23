const logger = require('../../utilities/logger');
const elasticsearch = require('../elasticsearch');
const TYPE = 'performance';

const cleanForIndex = (performance) => {
  return {
    index: elasticsearch.INDEX,
    type: TYPE,
    id: `${performance._id}`,
    body: {
      publicUrl: performance.publicUrl,
      title: performance.title,
      about: performance.about,
      imageUrl: performance.imageUrl
    }
  };
};

module.exports = (es = elasticsearch) => {
  return function elasticsearchIndexPlugin(schema, _opts) {
    schema.post('save', function save() {
      logger.debug(`Indexing ${TYPE}`);
      if (this.is_public) {
        const clean = cleanForIndex(this);
        logger.debug(clean);
        es.getClient().index(clean, (error, _res) => {
          if (error) {
            logger.debug(`Indexing ${TYPE} failed`);
          } else {
            logger.debug(`Indexing ${TYPE} success`);
          }
        });
      } else {
        es.getClient().exists({
          index: elasticsearch.INDEX,
          type: TYPE,
          id: this.id
        }, (err, exists) => {
          if (exists === true) {
            es.remover(TYPE)(this);
            logger.debug('Performance is switched to private');
          } else {
            logger.debug('Indexing skipped, performance is not public');
          }
        });
      }
    });

    schema.post('remove', (entity) => es.remover(TYPE)(entity));
  };
};
module.exports.cleanForIndex = cleanForIndex;
