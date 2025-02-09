import createRouter from "../router.js";
const router = createRouter();
import dataprovider from '../../utilities/dataprovider.js';

import mongoose from 'mongoose';
const Model = mongoose.model('Performance');
const section = 'performances';

import { info, debugLog, error } from '../../utilities/logger.js';


router.get('/', (req, res) => {
  dataprovider.show(req, res, section, 'show', Model);
});

router.get('/print', (req, res) => {
  dataprovider.show(req, res, section, 'print', Model);
});

router.get('/galleries/:gallery', (req, res) => {
  dataprovider.show(req, res, section, 'galleries', Model);
});

router.get('/galleries/:gallery/img/:img', (req, res) => {
  dataprovider.show(req, res, section, 'galleries', Model);
});

router.get('/videos/:video', (req, res) => {
  dataprovider.show(req, res, section, 'videos', Model);
});
router.get('/galleries', (req, res) => {
  dataprovider.show(req, res, section, 'galleries', Model);
});

router.get('/videos', (req, res) => {
  dataprovider.show(req, res, section, 'videos', Model);
});

export default router;

