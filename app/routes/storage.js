import createRouter from "./router.js";
const router = createRouter();
import mongoose from 'mongoose';
const Asset = mongoose.model('Asset');
const getStorageFolder = require('../utilities/asset/helper').getStorageFolder;
import { info, debugLog, error } from '../utilities/logger.js';
 

router.get('/:identifier/', ({params}, res) => {
  const options = {
    root: getStorageFolder()
  };
  Asset.findOne({identifier: params.identifier}, (err, asset) => {
    if (err || asset === null) {
      res.redirect('/404');
      // throw err;
    }
    if (asset.type === 'image' || asset.type === 'scaled') {
      res.sendFile(asset.image.filename, options, (err) => {
        if (err) {
          res.redirect('/404');
        }
      });
    }
  });
});

export default router;
