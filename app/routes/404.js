
import { logger, requestLogger, errorLogger } from '../utilities/logger.js';


export default (req, res) => {
  console.log('404:' + req.originalUrl);
  logger.info(`404: ${JSON.stringify(req)} ${req.originalUrl}`);  
  res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
};
