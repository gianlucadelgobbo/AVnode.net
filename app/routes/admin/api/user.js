const config = require('getconfig');
const router = require('../../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');

const logger = require('../../../utilities/logger');

const dataprovider = require('../../../utilities/dataprovider');
const upload = require('./upload');

const section = 'performers';

router.get('/', (req, res) => {
    logger.debug(process);
dataprovider.fetchUser(req.user.id, (err, user) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${JSON.stringify(err)}` });
    }
    res.json(user);
  });
});

router.post('/:id/public', (req, res) => {
  logger.debug('VALIDATION PROCESS');
  User.findById(req.params.id, (finderr, user) => {
    if (finderr) {
      logger.debug(`${JSON.stringify(finderr)}`);
      req.flash('errors', { msg: `${JSON.stringify(finderr)}` });
      res.json(user); // USER COULD BE NULL
    } else {
      logger.debug('SAVE PROCESS');
      logger.debug(req.body);
      user.save((saveerr) => {
        if (saveerr) {
          logger.debug('save error');
          logger.debug(JSON.stringify(saveerr));
          req.flash('errors', { msg: `${JSON.stringify(saveerr)}` });
          res.json(user); // USER COULD BE NULL
        } else {
          dataprovider.fetchUser(req.params.id, (fetcherr, useredited) => {
            if (fetcherr) {
              logger.debug('fetch error');
              logger.debug(JSON.stringify(fetcherr));
              req.flash('errors', { msg: `${JSON.stringify(saveerr)}` });
              res.json(useredited); // USER COULD BE NULL
            } else {
              res.json(useredited);
            }
          });
        }
      });
    }
  });
});

router.post('/:id/image/profile', (req, res) => {
  logger.debug('/:id/image/profile');
  upload.uploader(req, res, config.cpanel.user.media.image, (uploadererr, files) => {
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
          logger.debug(user.image);
          let image = {
            file: files.image[0].path.replace(global.appRoot, ''),
            filename: files.image[0].filename,
            originalname: files.image[0].originalname,
            mimetype: files.image[0].mimetype,
            size: files.image[0].size,
            width: files.image[0].width,
            height: files.image[0].height
          };
          logger.debug('image');
          logger.debug(image);
          user.image = image;
          logger.debug('user.image');
          logger.debug(user.image);
          user.save((saveerr) => {
            if (saveerr) {
              logger.debug('save error');
              logger.debug(JSON.stringify(saveerr));
              req.flash('errors', { msg: `${JSON.stringify(saveerr)}` });
              res.json(user); // USER COULD BE NULL
            } else {
              dataprovider.fetchUser(req.params.id, (fetcherr, useredited) => {
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

/* C
router.put('/:id/language/:langId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/language/${JSON.stringify(req.params.langId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
    }
    user.language = req.params.langId;
    user.save((err) => {
      if (err) {
        logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
      }
      dataprovider.fetchUser(req.user.id, (err, user) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        res.json(user);
      });
    });
  });
});

router.post('/:id/image/teaser', up, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  const apiCall = 'api, image teaser: ';
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        if (checkImageFile(file, apiCall)) {
          assetUtil.createImageAsset(file, (err, assetId) => {
            if (err) {
              req.flash('errors', { msg: `${apiCall} createImageAsset ${err}` });
              logger.debug(`${apiCall} createImageAsset ${err}`);
              console.log(err);
              // throw err;
            } else {
              req.flash('success', { msg: `${apiCall} createImageAsset ok, resize` });
              logger.info(`${apiCall} createImageAsset ok, resize`);
              imageUtil.resize(assetId, imageUtil.sizes.user.teaser, cb);
            }
          });
        } else {
          cb(null);
        }
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    infoMessage = `${apiCall} success: ${JSON.stringify(results)}`;
    req.flash('success', { msg: errorMessage });
    logger.info(errorMessage);

    User.findById(req.params.id, (err, user) => {
      if (err) {
        req.flash('errors', { msg: `findById ERROR: ${JSON.stringify(err)}` });
        return next(err);
      }
      user.teaserImage = results['image'];
      user.save((err) => {
        if (err) {
          return next(err);
        }
        dataprovider.fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
  });
});
// remove about from user
router.delete('/:id/about/:aboutlanguage', (req, res) => {
  const apiCall = `api, router.delete(/user/${JSON.stringify(req.params.id)}/about/${JSON.stringify(req.params.aboutlanguage)})`;
  logger.debug('________________API DELETE user about ___________________');
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);
  User
    .findById(req.params.id)
    .exec((err, user) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
      }
      // after delete, modify user fields with primary address
      user.abouts.map((a) => {
        if (a.lang == req.params.aboutlanguage) {
          user.abouts.remove(a);
          user.aboutlanguage = '';
          user.about = '';
        }
      });
      user.save((_err) => {
        dataprovider.fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});
// edit user about
router.put('/:id/about/:aboutlanguage', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/about/${JSON.stringify(req.params.aboutlanguage)})`;
  logger.debug('________________API PUT user about ___________________');
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
    }
    if (user) {
      // abouts
      if (user.abouts) {
        // find the about
        user.abouts.map((a) => {
          // BL notice the == instead of ===
          if (a.lang == req.params.aboutlanguage) {
            // about in this language is found
            logger.debug(`${apiCall} about lang found ${a.abouttext}`);
            user.about = a.abouttext;
            user.aboutlanguage = a.lang;
          }
        });
      }

      user.save(() => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        dataprovider.fetchUser(req.params.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    } else {
      logger.debug(`${apiCall} ERROR user is null`);
    }
  });
});
// remove link from user
router.delete('/:id/link/:linkId', (req, res) => {
  const apiCall = `api, router.delete(/user/${JSON.stringify(req.params.id)}/link/${JSON.stringify(req.params.linkId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);
  User
    .findById(req.params.id)
    .exec((err, user) => {
      // reinit values for correct display on forms
      switch (user.linkType) {
        case 'sk':
        case 'mb':
        case 'tel':
          user.linkTel = '';
          break;
        case 'web':
          user.linkWeb = '';
          break;
        case 'tw':
        case 'fb':
        case 'ot':
          user.linkSocial = '';
          break;
      }
      user.linkType = '';
      user.links.remove(req.params.linkId);
      user.save((_err) => {
        dataprovider.fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

// change user primary email
router.put('/:id/email/:emailIndex', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/email/${JSON.stringify(req.params.emailIndex)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
    }
    if (user) {
      if (user.emails) {

        // set to primary
        let emailIndex = req.params.emailIndex;
        // check array bounds
        if (emailIndex < user.emails.length) {
          // only set to primary if email was confirmed
          if (user.emails[emailIndex].is_confirmed) {
            // reset primary for other emails
            user.emails.map((e) => {
              e.is_primary = false;
            });
            // set to primary
            user.emails[emailIndex].is_primary = true;
            user.email = user.emails[emailIndex].email;
          }
        }
      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        dataprovider.fetchUser(req.user.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
});

// user email toggleprivacy
router.put('/:id/toggleprivacy/:emailIndex', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/toggleprivacy/${JSON.stringify(req.params.emailIndex)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
    }
    if (user) {
      if (user.emails) {
        let emailIndex = req.params.emailIndex;
        // check array bounds
        if (emailIndex < user.emails.length) {
          // toggle privacy
          user.emails[emailIndex].is_public = !user.emails[emailIndex].is_public;
        }
      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        dataprovider.fetchUser(req.user.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
});

// user email MakePrivate (obsolete)
router.put('/:id/makeemailprivate/:emailIndex', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/makeemailprivate/${JSON.stringify(req.params.emailIndex)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
    }
    if (user) {
      if (user.emails) {
        let emailIndex = req.params.emailIndex;
        // check array bounds
        if (emailIndex < user.emails.length) {
          // set to private
          user.emails[emailIndex].is_public = false;
        }
      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        dataprovider.fetchUser(req.user.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
});

// user email MakePublic (obsolete)
router.put('/:id/makeemailpublic/:emailIndex', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/makeemailpublic/${JSON.stringify(req.params.emailIndex)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
    }
    if (user) {
      if (user.emails) {
        let emailIndex = req.params.emailIndex;
        // check array bounds
        if (emailIndex < user.emails.length) {
          // set to public
          user.emails[emailIndex].is_public = true;
        }
      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        dataprovider.fetchUser(req.user.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
});

// user email confirm
router.put('/:id/emailconfirm/:emailIndex', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/emailconfirm/${JSON.stringify(req.params.emailIndex)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
    }
    if (user) {
      if (user.emails) {
        let emailIndex = req.params.emailIndex;
        // check array bounds
        if (emailIndex < user.emails.length) {
          // only send if email is not confirmed
          if (!user.emails[emailIndex].is_confirmed) {
            user.emails[emailIndex].confirm = uuid.v4();
            logger.debug(`${apiCall} email ${user.emails[emailIndex].email}`);
            mailer.confirmEmail({ to: user.emails[emailIndex].email }, { uuid: user.emails[emailIndex].confirm }, (mErr) => {
              if (mErr) {
                logger.debug(`${apiCall} mailer ERROR ${JSON.stringify(mErr)}`);
              }
              // BL FIXME : no message shown in UI
              req.flash('success', { msg: __('Email sent') });
            });
          }
        }
      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        dataprovider.fetchUser(req.user.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
});

// remove email from user
router.delete('/:id/email/:emailId', (req, res) => {
  User
    .findById(req.params.id)
    .exec((err, user) => {
      user.emails.remove(req.params.emailId);
      user.save((_err) => {
        dataprovider.fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

// change user primary address
router.put('/:id/address/:addressId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/address/${JSON.stringify(req.params.addressId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
    }
    if (user) {
      if (user.addresses) {
        // find the address to set primary
        user.addresses.map((a) => {
          a.is_primary = false;
          logger.debug(`${apiCall} primary not found ${a.locality}`);
          // BL notice the == instead of ===
          if (a._id == req.params.addressId) {
            // address is found
            logger.debug(`${apiCall} primary address found ${a.locality}`);
            a.is_primary = true;
            // update the fields, verifying they are not undefined
            user.street_number = a.street_number ? a.street_number : '';
            user.route = a.route ? a.route : '';
            user.postal_code = a.postal_code ? a.postal_code : '';
            user.locality = a.locality ? a.locality : '';
            user.administrative_area_level_1 = a.administrative_area_level_1 ? a.administrative_area_level_1 : '';
            user.country = a.country ? a.country : '';
          }
        });

      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        dataprovider.fetchUser(req.user.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
});

// user address MakePrivate
router.put('/:id/makeaddressprivate/:addressId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/makeaddressprivate/${JSON.stringify(req.params.addressId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
    }
    if (user) {
      if (user.addresses) {
        // find the address to set primary
        user.addresses.map((a) => {
          // BL notice the == instead of ===
          if (a._id == req.params.addressId) {
            // address is found
            logger.debug(`${apiCall} address found ${a.locality}`);
            a.is_public = false;
          }
        });
      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        dataprovider.fetchUser(req.user.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
});
// user address MakePublic
router.put('/:id/makeaddresspublic/:addressId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/makeaddresspublic/${JSON.stringify(req.params.addressId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
    }
    if (user) {
      if (user.addresses) {
        // find the address to set primary
        user.addresses.map((a) => {
          // BL notice the == instead of ===
          if (a._id == req.params.addressId) {
            // address is found
            logger.debug(`${apiCall} address found ${a.locality}`);
            a.is_public = true;
          }
        });
      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        dataprovider.fetchUser(req.user.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
});
// remove address from user
router.delete('/:id/address/:addressId', (req, res) => {
  User
    .findById(req.params.id)
    .exec((err, user) => {
      user.addresses.remove(req.params.addressId);
      // after delete, modify user fields with primary address
      user.addresses.map((a) => {
        if (a.is_primary) {
          user.street_number = a.street_number;
          user.route = a.route;
          user.postal_code = a.postal_code;
          user.locality = a.locality;
          user.administrative_area_level_1 = a.administrative_area_level_1;
          user.country = a.country;
        }
      });
      user.save((_err) => {
        dataprovider.fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});
// add address to user
router.post('/place', (req, res, next) => {
  // BL check if next is needed/used
  const apiCall = 'api, router.post(/user/place)';
  let primary = true;
  let addressFound = false;
  User
    .findById(req.body.id, (err, user) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}  ${req.params.id}`);
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
        return next(err);
      }
      if (user.addresses && user.addresses.length > 0) {
        primary = false;
        user.addresses.map((a) => {
          // if an address exist, new ones are not set to primary (for now)
          primary = false;
          if (a.place_id === req.body.location.place_id) {
            // address in the form already exists in addresses
            addressFound = true;
            logger.debug(`${apiCall} save address in the form already exists in addresses ${req.body.location.place_id}`);
            // BL TODO CHECK if address needs updating the fields
          }
        });
      }
      if (!addressFound) {
        user.street_number = req.body.street_number;
        user.route = req.body.route;
        user.postal_code = req.body.postal_code;
        user.locality = req.body.locality;
        user.administrative_area_level_1 = req.body.administrative_area_level_1;
        user.country = req.body.country;
        for (let i in req.body.location.address_components) {
          if (req.body.location.address_components[i].types[0] == 'street_number') user.street_number = req.body.location.address_components[i].long_name;
          if (req.body.location.address_components[i].types[0] == 'route') user.route = req.body.location.address_components[i].long_name;
          if (req.body.location.address_components[i].types[0] == 'postal_code') user.postal_code = req.body.location.address_components[i].long_name;
          if (req.body.location.address_components[i].types[0] == 'locality') user.locality = req.body.location.address_components[i].long_name;
          if (req.body.location.address_components[i].types[0] == 'administrative_area_level_1') user.administrative_area_level_1 = req.body.location.address_components[i].long_name;
          if (req.body.location.address_components[i].types[0] == 'country') user.country = req.body.location.address_components[i].long_name;
        }
        const address = {
          formatted_address: req.body.location.formatted_address, // BL gmap response formatted_address, should not be updated to stay unique
          street_number: user.street_number,
          route: user.route,
          postal_code: user.postal_code,
          locality: user.locality,
          administrative_area_level_1: user.administrative_area_level_1,
          country: user.country,
          geometry: req.body.location.geometry,
          place_id: req.body.location.place_id,
          placename: user.locality, // BL friendly name: placename is set to locality, because it's required
          is_primary: primary
        };

        user.addresses.push(address);
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        dataprovider.fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});
// add link to user
router.post('/link', (req, res, next) => {
  // BL check if next is needed/used
  const apiCall = 'api, router.post(/user/link)';
  logger.debug(`${apiCall} add link: ${JSON.stringify(req.body.links)}`);
  let linkFound = false;
  User
    .findById(req.body.id, (err, user) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}  ${req.params.id}`);
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
        return next(err);
      }
      if (req.body.link && req.body.link.url) {
        if (user.links && user.links.length > 0) {
          user.links.map((l) => {
            if (l.url === req.body.link.url) {
              linkFound = true;
              logger.debug(`${apiCall} link in the form already exists in links ${req.body.link.url}`);
            }
          });
        }
        if (!linkFound) {
          user.links.push(req.body.link);
        }
      } else {
        logger.debug(`${apiCall} link undefined ou url empty`);
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        dataprovider.fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.put('/:id', (req, res) => {
  // FIXME: Find elegant way…
  const apiCall = `api, router.put(/user/${JSON.stringify(req.user.id)}`;
  logger.debug('________________API PUT user___________________');
  //logger.debug(`${apiCall} req.body.linkSocial: ${req.body.linkSocial}`);
  logger.debug(`${apiCall} req.body.links: ${JSON.stringify(req.body.links)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
      req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
    }
    if (user) {
      Object.assign(user, req.body);
      user.save((uErr) => {
        if (uErr) {
          logger.debug(`${apiCall} save ERROR: ${JSON.stringify(uErr)}`);
        }
        // BL FIXME shown only on page refresh... req.flash('success', { msg: __('Saved') });
        dataprovider.fetchUser(req.params.id, (fErr, user) => {
          if (fErr) {
            logger.debug(`${apiCall} dataprovider.fetchUser ERROR: ${JSON.stringify(fErr)}`);
          }
          res.json(user);
        });
      });
    } else {
      logger.debug(`${apiCall} ERROR user is null`);
    }
  });
});
*/
  module.exports = router;