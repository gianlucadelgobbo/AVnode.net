const router = require('../router')();
const mongoose = require('mongoose');
const Playlist = mongoose.model('Playlist');

const logger = require('../../utilities/logger');

router.get('/', (req, res, next) => {
  Playlist
  .findOne({slug: req.params.slug})
  .exec((err, playlist) => {
    if (err || playlist === null) {
      console.log('routes/playlist/show err:' + err);
      return next(err);
    }
    logger.debug('playlists/show');
    res.render('playlists/show', {
      title: playlist.title,
      playlist: playlist
    });
  });
});

module.exports = router;
