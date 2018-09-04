
const logger = require('../utilities/logger');

module.exports = (req, res) => {
  console.log('404:' + req.originalUrl);
  logger.debug(`404: ${JSON.stringify(req)} ${req.originalUrl}`);  
  res.status(404).render('404'  res.status(404).render('404', {path: req.originalUrl, title:"<span class=\"lnr lnr-warning\" style=\"font-size:  200%;vertical-align:  middle;padding-right: 20px;\"></span><span style=\"vertical-align:  middle;\">"+__("404: Page not found")+"</span>"});
};
