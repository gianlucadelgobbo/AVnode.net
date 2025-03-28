
import { logger, requestLogger, errorLogger } from '../utilities/logger.js';


export default (req, res) => {
  logger.info(`404: ${JSON.stringify(req)} ${req.originalUrl}`); 
  if (req.isApi) {
    res.status(404).send({ path: req.originalUrl, currentUrl: req.originalUrl, user: req.user, title: req.__("404: API not found"), error: error });
  } else {
    res.status(404).render('404', {path: req.originalUrl, currentUrl: req.originalUrl, user: req.user, title:req.__("404: Page not found"), titleicon:"icon-warning"});
  }

};
