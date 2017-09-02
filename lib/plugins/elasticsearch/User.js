const logger = require('../../utilities/logger');
const elasticsearch = require('../elasticsearch');
const TYPE = 'user';

const cleanForIndex = (user) => {
  return {
    index: elasticsearch.INDEX,
    type: TYPE,
    id: `${user._id}`,
    body: {
      publicUrl: user.publicUrl,
      name: user.name,
      stagename: user.stagename,
      about: user.about,
      imageUrl: user.imageUrl
    }
  };
};

module.exports = (es = elasticsearch) => {
  return function elasticsearchIndexPlugin(schema, _opts) {
    schema.post('save', function save() {
      const clean = cleanForIndex(this);
      logger.debug('Indexing user');
      logger.debug(clean);
      es.getClient().index(clean, (error, _res) => {
        if (error) {
          logger.debug('Indexing user failed');
        } else {
          logger.debug('Indexing user success');
        }
      });
    });

    schema.post('remove', (entity) => es.remover(TYPE)(entity));
  };
};
module.exports.cleanForIndex = cleanForIndex;
