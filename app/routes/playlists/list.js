const router = require('../router')();
const mongoose = require('mongoose');
const Playlist = mongoose.model('Playlist');

const logger = require('../../utilities/logger');

router.get('/', (req, res) => {
  logger.debug('Playlist');
  Playlist.find({})
  .limit(40)  
  //.populate()
  .exec((err, data) => {
    logger.debug('Playlist/list');
    res.render('playlists/list', {
      title: __('Playlists'),
      data: data
    });
  });
});

module.exports = router;
