const config = require('getconfig');
const router = require('../../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');

const logger = require('../../../utilities/logger');

const dataproviderAdmin = require('../../../utilities/dataproviderAdmin');
const upload = require('./upload');

const section = 'performers';

router.get('/', (req, res) => {
    dataproviderAdmin.fetchUser(req.user.id, (err, user) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${JSON.stringify(err)}` });
    }
    res.json(user);
  });
});

router.post('/', (req, res) => {
  upload.uploader(req, res, 'user', 'image', (uploadererr, files) => {
    if (uploadererr) {
      logger.debug(uploadererr);
      req.flash('errors', { msg: `${JSON.stringify(uploadererr)}` });
      res.json(null); // USER COULD BE NULL
    } else {
      User.findById(req.params.id, (finderr, user) => {
        if (finderr) {
          logger.debug(JSON.stringify(finderr));
          req.flash('errors', { msg: `${JSON.stringify(finderr)}` });
          res.json(user); // USER COULD BE NULL
        } else {
          logger.debug('save');
          logger.debug(files);
          logger.debug('user.image');
          logger.debug(user[media]);
          user[media] = {
            file: files.image[0].path.replace(global.appRoot, ''),
            filename: files.image[0].filename,
            originalname: files.image[0].originalname,
            mimetype: files.image[0].mimetype,
            size: files.image[0].size,
            width: files.image[0].width,
            height: files.image[0].height
          };
          logger.debug('user.image');
          logger.debug(user[media]);
          user.save((saveerr) => {
            if (saveerr) {
              logger.debug('save error');
              logger.debug(JSON.stringify(saveerr));
              req.flash('errors', { msg: `${JSON.stringify(saveerr)}` });
              res.json(user); // USER COULD BE NULL
            } else {
              dataproviderAdmin.fetchUser(req.params.id, (fetcherr, useredited) => {
                if (fetcherr) {
                  logger.debug('fetch error');
                  logger.debug(JSON.stringify(fetcherr));
                  req.flash('errors', { msg: `${JSON.stringify(fetcherr)}` });
                  res.json(useredited); // USER COULD BE NULL
                } else {
                  res.json(useredited);
                }
              });
            }
          });
        }
      });
    }
  });
});


module.exports = router;
