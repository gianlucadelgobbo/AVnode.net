const debug = require('debug');

module.exports.info = debug('avnode');
module.exports.debug = debug('avnode.debug');
module.exports.error = debug('avnode.error');