const router = require('../../router')();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');

const logger = require('../../../utilities/logger');
const multer = require('multer');



// BL TODO this is the elegant way! Search for // FIXME: Find elegant way…
router.put('/event/:id', (req, res) => {
    const apiCall = `api, router.put(/event/${JSON.stringify(req.params.id)})`;
    logger.info(`${apiCall} req.params: ${JSON.stringify(req.params)}`);
  
    Event.findById(req.params.id, (err, event) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
      }
      if (event) {
        Object.assign(event, req.body);
        event.save((eErr) => {
          if (eErr) {
            logger.debug(`${apiCall} save ERROR: ${JSON.stringify(eErr)} event: ${JSON.stringify(event)}`);
          }
          fetchUser(req.user.id, (fErr, user) => {
            if (fErr) {
              logger.debug(`${apiCall} fetchUser ERROR: ${JSON.stringify(fErr)}`);
            }
            res.json(user);
          });
        });
  
      } else {
        logger.debug(`${apiCall} ERROR event is null`);
      }
    });
  });
  
  router.delete('/event/:id', (req, res) => {
    const apiCall = `api, router.delete(/event/${JSON.stringify(req.params.id)}`;
    logger.debug(`${apiCall} delete event (for user ${req.user.id})`);
    Event.findById(req.params.id, (err, event) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
      } else {
        event.remove();
      }
      fetchUser(req.user.id, (err, user) => {
        res.json(user);
      });
    });
  });
  // delete category from event
  router.delete('/event/:id/category/:categoryId', (req, res) => {
    const apiCall = `api, router.delete(/event/${JSON.stringify(req.params.id)}/category/${req.params.categoryId})`;
    logger.debug(`${apiCall} delete category: ${req.params.categoryId} from event ${req.params.id} user ${req.user.id}`);
    Event
      .findById(req.params.id)
      .exec((err, event) => {
        event.categories.remove(req.params.categoryId);
        event.save((_err) => {
          if (_err) {
            logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}  ${req.params.id}`);
          }
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      });
  });
  
  // add event category
  router.put('/event/:id/category/:category', (req, res) => {
    const apiCall = `api, router.put(/event/${JSON.stringify(req.params.id)}/category/${JSON.stringify(req.params.category)})`;
    logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);
  
    Event.findById(req.params.id, (err, event) => {
      if (err) {
        logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
      }
      if (event) {
        logger.debug(`${apiCall} event:' ${JSON.stringify(event)}`);
        let catFound = false;
        if (event.categories) {
          // find if exists
          event.categories.map((c) => {
            // BL notice the == instead of ===
            if (c.name == req.params.category) {
              // category is found
              catFound = true;
              logger.debug(`${apiCall} category found, not adding`);
            }
          });
        }
        if (!catFound) event.categories.push({ name: req.params.category });
        event.save((err) => {
          if (err) {
            logger.debug(`${apiCall} event.save ERROR:' ${JSON.stringify(err)}`);
          }
          fetchUser(req.user.id, (err, user) => {
            if (err) {
              logger.debug(`${apiCall} fetchUser ERROR:' ${JSON.stringify(err)}`);
            }
            res.json(user);
          });
        });
      }
    });
  });
  router.post('/event', (req, res) => {
    const newEvent = new Event(Object.assign({}, req.body, {
      slug: slugify(req.body.title)
    }));
    newEvent.save((err, event) => {
      fetchUser(req.user.id, (err, user) => {
        user.events.push(event);
        User.update({ _id: user._id }, { events: user.events }, (_err) => {
          res.json(user);
        });
      });
    });
  });
  // remove about from event
  router.delete('/event/:id/about/:aboutlanguage', (req, res) => {
    const apiCall = `api, router.delete(/event/${JSON.stringify(req.params.id)}/about/${JSON.stringify(req.params.aboutlanguage)})`;
    logger.debug('________________API DELETE event about ___________________');
    logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);
    Event
      .findById(req.params.id)
      .exec((err, event) => {
        if (err) {
          logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
        }
        // after delete, modify event fields with abouts
        event.abouts.map((a) => {
          if (a.lang == req.params.aboutlanguage) {
            event.abouts.remove(a);
            event.aboutlanguage = '';
            event.about = '';
          }
        });
        event.save((_err) => {
          // BL FIXME user id is undefined?
          fetchUser(req.user.id, (err, user) => {
            if (err) {
              logger.debug(`${apiCall} fetchUser ERROR:' ${JSON.stringify(err)}`);
            }
            res.json(user);
          });
        });
      });
  });


  /*
  // Image upload…
  // FIXME multiple occurrences
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.env.STORAGE);
    },
    filename: (req, file, cb) => {
      cb(null, `${uuid.v4()}.${mime.extension(file.mimetype)}`);
    }
  });
  // FIXME of course upload3 is bullshit, but since we need to split
  // this file into pieces, new names are worthless anyway
  const upload3 = multer({ dest: process.env.STORAGE, storage: storage });
  const up3 = upload3.fields([
    { name: 'image', maxCount: 1 }
  ]);
  router.post('/event/:id/image', up3, (req, res, next) => {
    // FIXME: Why next() as error handling?
    // FIXME: Delete old asset if there is one
    const apiCall = 'api, event image: ';
    async.parallel({
      image: (cb) => {
        if (req.files['image']) {
          const file = req.files['image'][0];
          if (checkImageFile(file, apiCall)) {
            assetUtil.createImageAsset(file, (err, assetId) => {
              if (err) {
                console.log(err);
                throw err;
              }
              imageUtil.resize(assetId, imageUtil.sizes.event.image, cb);
            });
          } else {
            cb(null);
          }
        } else {
          cb(null);
        }
      }
    }, (err, results) => {
      Event.findById(req.params.id, (err, event) => {
        if (err) {
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
          return next(err);
        }
        event.image = results['image'];
        event.save((err) => {
          if (err) {
            return next(err);
          }
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      });
    });
  });
  // FIXME of course upload4 is bullshit, but since we need to split
  // this file into pieces, new names are worthless anyway
  const upload4 = multer({ dest: process.env.STORAGE, storage: storage });
  const up4 = upload4.fields([
    { name: 'image', maxCount: 1 }
  ]);
  router.post('/event/:id/teaser', up4, (req, res, next) => {
    // FIXME: Why next() as error handling?
    // FIXME: Delete old asset if there is one
    const apiCall = 'api, event teaser: ';
    async.parallel({
      image: (cb) => {
        if (req.files['image']) {
          const file = req.files['image'][0];
          if (checkImageFile(file, apiCall)) {
            assetUtil.createImageAsset(file, (err, assetId) => {
              if (err) {
                console.log(err);
                throw err;
              }
              imageUtil.resize(assetId, imageUtil.sizes.event.teaser, cb);
            });
          } else {
            cb(null);
          }
        } else {
          cb(null);
        }
      }
    }, (err, results) => {
      Event.findById(req.params.id, (err, event) => {
        if (err) {
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
          return next(err);
        }
        console.log('save this teaser id ', results['image']);
        event.teaserImage = results['image'];
        event.save((err) => {
          if (err) {
            return next(err);
          }
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      });
    });
  });
*/
  router.put('/event/:id/performance/:performanceId', (req, res) => {
    const apiCall = `api, router.put(/event/${JSON.stringify(req.params.id)}/performance/${JSON.stringify(req.params.performanceId)})`;
    Performance
      .findById(req.params.performanceId)
      .exec((err, performance) => {
        if (err) {
          logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
        }
        if (performance) {
          if (performance.events) {
            let eventFound = false;
            performance.events.map((e) => {
              // BL notice the == instead of ===
              if (e == req.params.id) {
                // event is found
                logger.debug(`${apiCall} event found for this performance, not adding`);
                eventFound = true;
              }
            });
            // in case of new event, add it to the events
            if (!eventFound) {
              performance.events.push(req.params.id);
            }
          }
          performance.save((_err) => {
            if (_err) {
              logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}  ${req.params.id}`);
            }
            fetchUser(req.user.id, (err, user) => {
              res.json(user);
            });
          });
  
        } else {
          logger.debug(`${apiCall} ERROR performance is null, reindex elasticsearch?`);
        }
  
      });
  });
  
  router.delete('/event/:id/performance/:performanceId', (req, res) => {
    const apiCall = `api, router.delete(/event/${JSON.stringify(req.params.id)}/performance/${JSON.stringify(req.params.performanceId)})`;
    Performance
      .findById(req.params.performanceId)
      .exec((err, performance) => {
        performance.events.remove(req.params.id);
        performance.save((_err) => {
          if (_err) {
            logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}  ${req.params.id}`);
          }
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      });
  });
  
  router.put('/event/:id/organizer/:organizerId', (req, res) => {
    const apiCall = `api, router.put(/event/${JSON.stringify(req.params.id)}/organizer/${JSON.stringify(req.params.organizerId)})`;
    User
      .findById(req.params.organizerId)
      .exec((err, organizer) => {
        if (err) {
          logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
        }
        if (organizer) {
          if (organizer.events) {
            let eventFound = false;
            organizer.events.map((c) => {
              // BL notice the == instead of ===
              if (c == req.params.id) {
                // event is found
                logger.debug(`${apiCall} event found for this organizer, not adding`);
                eventFound = true;
              }
            });
            // in case of new event, add it to the events
            if (!eventFound) {
              organizer.events.push(req.params.id);
            }
          }
          organizer.save((_err) => {
            if (_err) {
              logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}  ${req.params.id}`);
            }
            fetchUser(req.user.id, (err, user) => {
              res.json(user);
            });
          });
        } else {
          logger.debug(`${apiCall} ERROR organizer is null, reindex elasticsearch?`);
        }
      });
  });
  
  router.delete('/event/:id/organizer/:organizerId', (req, res) => {
    const apiCall = `api, router.delete(/event/${JSON.stringify(req.params.id)}/organizer/${JSON.stringify(req.params.organizerId)})`;
    User
      .findById(req.params.organizerId)
      .exec((err, organizer) => {
        organizer.events.remove(req.params.id);
        organizer.save((_err) => {
          if (_err) {
            logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}  ${req.params.id}`);
          }
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      });
  });
  
  router.put('/event/:id/organizingcrew/:organizingcrewId', (req, res) => {
    const apiCall = `api, router.put(/event/${JSON.stringify(req.params.id)}/organizingcrew/${JSON.stringify(req.params.organizingcrewId)})`;
    User
      .findById(req.params.organizingcrewId)
      .exec((err, organizingcrew) => {
        if (err) {
          logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
        }
        if (organizingcrew) {
          if (organizingcrew.events) {
            let eventFound = false;
            organizingcrew.events.map((p) => {
              // BL notice the == instead of ===
              if (p == req.params.id) {
                // event is found
                logger.debug(`${apiCall} organizingcrew found for this crew, not adding`);
                eventFound = true;
              }
            });
            // in case of new event, add it to the events
            if (!eventFound) {
              organizingcrew.events.push(req.params.id);
            }
          }
          organizingcrew.save((_err) => {
            if (_err) {
              logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}  ${req.params.id}`);
            }
            fetchUser(req.user.id, (err, user) => {
              res.json(user);
            });
          });
        } else {
          logger.debug(`${apiCall} ERROR organizingcrew is null, reindex elasticsearch?`);
        }
      });
  });
  
  router.delete('/event/:id/organizingcrew/:organizingcrewId', (req, res) => {
    const apiCall = `api, router.delete(/event/${JSON.stringify(req.params.id)}/organizingcrew/${JSON.stringify(req.params.organizingcrewId)})`;
    User // 20171217 was Crew
      .findById(req.params.organizingcrewId)
      .exec((err, organizingcrew) => {
        organizingcrew.events.remove(req.params.id);
        organizingcrew.save((_err) => {
          if (_err) {
            logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}  ${req.params.id}`);
          }
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      });
  });
  
  // add venue in event
  router.post('/event/venue', (req, res) => {
    // BL TODO search for existing Venue
    const apiCall = `api, router.post(/event/${JSON.stringify(req.body.id)}/venue/${JSON.stringify(req.body.location.place_id)})`;
    // const newVenue = 
    new Venue({
      slug: slugify(req.body.location.placename),
      // BL now in the address: placename: req.body.location.placename, // BL friendly name indexed for search
      address: req.body.location,
      place_id: req.body.location.place_id
    }).save((err, venue) => {
      if (err) {
        logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
      }
      Event
        .findById(req.body.id, (err, event) => {
          if (err) {
            logger.debug(`${apiCall} Event.findById ERROR:' ${JSON.stringify(err)}`);
            req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
          }
          if (venue) {
            logger.info(`${apiCall} OK venue found: ${venue.placename}`);
            event.venues.push(venue._id);
          } else {
            logger.debug(`${apiCall} ERROR venue is undefined`);
          }
          event.save((err) => {
            if (err) {
              logger.debug(`${apiCall} event.save ERROR: ${JSON.stringify(err)}`);
            }
            fetchUser(req.user.id, (err, user) => {
              res.json(user);
            });
          });
        });
  
    });
  });
  // remove venue from event
  router.delete('/event/:id/venue/:venueId', (req, res) => {
    const apiCall = `api, router.delete(/event/${JSON.stringify(req.params.id)}/venue/${JSON.stringify(req.params.venueId)})`;
    Event
      .findById(req.params.id)
      .exec((err, event) => {
        event.venues.remove(req.params.venueId);
        event.save((_err) => {
          if (_err) {
            logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}  ${req.params.id}`);
          }
          Venue.findById(req.params.venueId).remove();
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      });
  });
// remove link from event
router.delete('/event/:id/link/:linkId', (req, res) => {
    const apiCall = `api, router.delete(/event/${JSON.stringify(req.params.id)}/link/${JSON.stringify(req.params.linkId)})`;
    logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);
    Event
      .findById(req.params.id)
      .exec((err, event) => {
        // reinit values for correct display on forms
        switch (event.linkType) {
          case 'sk':
          case 'mb':
          case 'tel':
            event.linkTel = '';
            break;
          case 'web':
            event.linkWeb = '';
            break;
          case 'tw':
          case 'fb':
          case 'ot':
            event.linkSocial = '';
            break;
        }
        event.linkType = '';
        event.links.remove(req.params.linkId);
        event.save((_err) => {
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      });
  });
  
    
  module.exports = router;