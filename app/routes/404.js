
const logger = require('../utilities/logger');

module.exports = (req, res) => {
  console.log('404:' + req.originalUrl);
  logger.debug(`404: ${JSON.stringify(req)} ${req.originalUrl}`);  
  res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"lnr-warning"});
};
