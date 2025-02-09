import config from 'getconfig';
import createRouter from "../router.js";
const router = createRouter();
import dataprovider from '../../utilities/dataprovider.js';

import mongoose from 'mongoose';
const Model = mongoose.model('News');
const section = 'news';

import { info, debugLog, error } from '../../utilities/logger.js';


router.get('/:filter/:sorting/:page', (req, res) => {
  dataprovider.list(req, res, section, Model);
});

router.get('/:filter/:sorting', (req, res) => {
  req.params.page = 1;
  dataprovider.list(req, res, section, Model);
});

router.get('/:filter', (req, res) => {
  req.params.page = 1;
  req.params.sorting = config.sections[section].orders[0];
  dataprovider.list(req, res, section, Model);
});

router.get('/', (req, res) => {
  req.params.page = 1;
  req.params.sorting = config.sections[section].orders[0];
  req.params.filter = config.sections[section].categories[0];
  dataprovider.list(req, res, section, Model);
});

export default router;
