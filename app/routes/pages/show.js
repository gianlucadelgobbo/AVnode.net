import createRouter from "../router.js";
const router = createRouter();
import axios from 'axios';

import { logger, requestLogger, errorLogger } from '../../utilities/logger.js';


router.get('/', (req, res, next) => {
  axios.get('https://cms.avnode.net/'+global.getLocale()+'/wp-json/wp/v2/mypages'+req.baseUrl)
  .then((body) => {
    logger.info(body)
    res.render('pages/show', {
      title: body.data.post_title,
      data: body.data
    });
  }, (error) => {
    res.status(408).render('404', {path: req.originalUrl, title:__("408: Request Timeout"), titleicon:"icon-warning"});
  });
});

export default router;
