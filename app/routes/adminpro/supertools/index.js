import createRouter from "../../router.js";
const router = createRouter();
import mongoose from 'mongoose';
import config from 'getconfig';

import { info, debugLog, error } from '../../../utilities/logger.js';


// V > db.events.findOne({"schedule.venue.location.locality":{$exists: true}},{schedule:1});
// V {"addresses.country": "Italy", "addresses.locality":{$in: ["Rome","Roma"]}},{addresses:1}

router.get('/', (req, res) => {
  debugLog('/adminpro/supertools/');
  res.render('adminpro/supertools/home', {
    title: 'SUPER Tools',
    sez: 'adminpro/supertools/home',
    
    currentUrl: req.originalUrl,
    data: 'LOAD DATA'
  });
});

export default router;