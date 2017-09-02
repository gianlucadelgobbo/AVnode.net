const elasticsearch = require('elasticsearch');
const logger = require('../utilities/logger');
const INDEX = 'avnode';

let instance = null;

const getClient = () => {
  if (instance === null) {
    logger.info('Connecting to elasticsearch');
    if (process.env.ELASTICSEARCH == null || process.env.ELASTICSEARCH === '') {
      throw new Error('Missing ELASTICSEARCH config value');
    }

    instance = new elasticsearch.Client({
      host: process.env.ELASTICSEARCH
    });
  }
  return instance;
};

module.exports.getClient = getClient;

module.exports.INDEX = INDEX;

// Default remove function one can use
module.exports.remover = (type) => {
  return function remove(entity) {
    logger.debug(`Removing ${type} from index`);
    getClient().delete({
      type: type,
      index: INDEX,
      id: `${entity._id}`
    }, (error, _res) => {
      if (error) {
        logger.debug(`Removing ${type} failed`);
        logger.debug(error);
      } else {
        logger.debug(`Removing ${type} success`);
      }
    });
  };
};
