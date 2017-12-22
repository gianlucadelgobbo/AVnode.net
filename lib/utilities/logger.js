/*const debug = require('debug');

module.exports.info = debug('avnode');
module.exports.debug = debug('avnode.debug');
module.exports.error = debug('avnode.error'); */

const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');

const consoleConfig = [
  new winston.transports.Console({
    'colorize': true
  })
];

const createLogger = new winston.Logger({
  'transports': consoleConfig
});

const successLogger = createLogger;
successLogger.add(winstonRotator, {
  'name': 'access-file',
  'level': 'info',
  'filename': './logs/access.log',
  'json': false,
  'datePattern': 'yyyy-MM-dd-',
  'prepend': true
});

const errorLogger = createLogger;
errorLogger.add(winstonRotator, {
  'name': 'error-file',
  'level': 'error',
  'filename': './logs/error.log',
  'json': false,
  'datePattern': 'yyyy-MM-dd-',
  'prepend': true
});

module.exports = {
  'successlog': successLogger,
  'errorlog': errorLogger
};

module.exports.info = successLogger;
module.exports.debug = successLogger;
module.exports.error = errorLogger; 