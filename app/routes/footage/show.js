import createRouter from "../router.js";
const router = createRouter();
import dataprovider from '../../utilities/dataprovider.js';

import mongoose from 'mongoose';
const Model = mongoose.model('Footage');
const section = 'footage';

import { logger, requestLogger, errorLogger } from '../../utilities/logger.js';


router.get('/', (req, res) => {
  dataprovider.show(req, res, section, 'show', Model);
});

export default router;
