const router = require('./router')();
const mongoose = require('mongoose');
const Asset = mongoose.model('Asset');
const getStorageFolder = require('../utilities/asset/helper').getStorageFolder;
const logger = require('../utilities/logger'); 

router.get('/:identifier/', ({params}, res) => {
  const options = {
    root: getStorageFolder()
  };
  Asset.findOne({identifier: params.identifier}, (err, asset) => {
    if (err || asset === null) {
      console.log( 'storage findOne err:' + JSON.stringify(err));
      logger.debug(`storage findOne err: ${JSON.stringify(err)}`);  
      res.redirect('/404');
      throw err;
    }
    if (asset.type === 'image' || asset.type === 'scaled') {
      res.sendFile(asset.image.filename, options, (err) => {
        if (err) {
          console.log( 'storage sendFile err:' + JSON.stringify(err));
          logger.debug(`storage sendFile err: ${JSON.stringify(err)}`);  
          res.redirect('/404');
        }
      });
    }
  });
});

module.exports = router;
