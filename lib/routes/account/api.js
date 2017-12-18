const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
// const Crew = mongoose.model('Crew');
const Performance = mongoose.model('Performance');
const Venue = mongoose.model('Venue');
const slugify = require('../../utilities/slug').parse;
const logger = require('../../utilities/logger');
const mailer = require('../../utilities/mailer');
const allCountries = require('node-countries-list');
const R = require('ramda');

// All for the image upload…
const multer = require('multer');
const uuid = require('uuid');
const mime = require('mime');
const async = require('async');
const imageUtil = require('../../utilities/image');
const assetUtil = require('../../utilities/asset');

const elasticsearch = require('../../plugins/elasticsearch');
// BL 20171123 removed some performances fields
const fetchUser = (id, cb) => {
  User
    .findById(id)
    //.select({'galleries': 0, 'abouts':0})
    .populate([{
      path: 'image',
      model: 'Asset'
    }, {
      path: 'teaserImage',
      model: 'Asset'
    }, {
      path: 'events',
      model: 'Event',
      populate: [{
        path: 'image',
        model: 'Asset'
      }, {
        path: 'teaserImage',
        model: 'Asset'
      }, {
        path: 'venues',
        model: 'Venue'
      }, {
        path: 'performances' // virtual relation
      }, {
        path: 'organizers', // virtual relation
      }, {
        path: 'organizing_crews', // virtual relation
      }]
    }, {
      path: 'performances',
      model: 'Performance',
      select: { 'slug': 1, 'title': 1, 'about': 1, 'aboutlanguage': 1, 'abouts': 1, 'image': 1, 'teaserImage': 1, 'file': 1, 'categories': 1, 'tech_art': 1, 'tech_req': 1, 'video': 1 },
      populate: [{
        path: 'image',
        model: 'Asset'
      }, {
        path: 'teaserImage',
        model: 'Asset'
      }, {
        path: 'video',
        model: 'Asset'
      }/*, {
        path: 'performers', select: { 'stagename': 1 } // virtual relation
      }, { //, 'events': 0, 'crews': 0, 'performances': 0, 'addresses': 0, 'emails': 0
        path: 'crews' // virtual relation
      }*/]
    }, {
      path: 'crews',
      select: { '-members':1, 'org_name': 1, 'slug': 1, 'stagename': 1, 'username': 1, 'about': 1, 'aboutlanguage': 1, 'abouts': 1, 'image': 1, 'teaserImage': 1, 'file': 1 },
      model: 'User',
      populate: [{
        path: 'image',
        model: 'Asset'
      }, {
        path: 'teaserImage',
        model: 'Asset'
      }, {
        path: 'events',
        model: 'Event'
      }, {
        path: 'members', // virtual relation
        model: 'User',
        select: { 'slug': 1, 'stagename': 1, 'username': 1 },
      }]
    }])
    .exec(cb);
};
/* old get all user data 680Mb
const fetchAllUserDataById = (id, cb) => {
  User
    .findById(id)
    .populate([{
      path: 'image',
      model: 'Asset'
    }, {
      path: 'teaserImage',
      model: 'Asset'
    }, {
      path: 'events',
      model: 'Event',
      populate: [{
        path: 'image',
        model: 'Asset'
      }, {
        path: 'teaserImage',
        model: 'Asset'
      }, {
        path: 'venues',
        model: 'Venue'
      }, {
        path: 'performances' // virtual relation
      }, {
        path: 'organizers', // virtual relation
      }, {
        path: 'organizing_crews', // virtual relation
      }]
    }, {
      path: 'performances',
      model: 'Performance',
      populate: [{
        path: 'image',
        model: 'Asset'
      }, {
        path: 'teaserImage',
        model: 'Asset'
      }, {
        path: 'video',
        model: 'Asset'
      }, {
        path: 'performers' // virtual relation
      }, {
        path: 'crews' // virtual relation
      }]
    }, {
      path: 'crews',
      model: 'Crew',
      populate: [{
        path: 'image',
        model: 'Asset'
      }, {
        path: 'teaserImage',
        model: 'Asset'
      }, {
        path: 'events',
        model: 'Event'
      }, {
        path: 'members' // virtual relation
      }]
    }])
    //.lean()
    .exec(cb);
}; */
const fetchCrewMemberById = (id, cb) => {
  User
    .findById(id)
    .populate({
      path: 'crews',
      model: 'User' // 20171217 was Crew
    })
    .exec(cb);
};

router.get('/user', (req, res) => {
  const apiCall = `api, router.get(/user/${JSON.stringify(req.user.id)}`;

  fetchUser(req.user.id, (err, user) => {
    let str = JSON.stringify(user);
    logger.debug(`${apiCall} user size ${str.length})`);
    logger.debug(`${apiCall} user perfs size ${JSON.stringify(user.performances).length})`);
    logger.debug(`${apiCall} user gals size ${JSON.stringify(user.galleries).length})`);
    logger.debug(`${apiCall} user crews size ${JSON.stringify(user.crews).length})`);
    res.json(user);
  });
});
// BL TODO this is the elegant way! Search for // FIXME: Find elegant way…
router.put('/event/:id', (req, res) => {
  Event.findById(req.params.id, (err, event) => {
    Object.assign(event, req.body);
    event.save(() => {
      fetchUser(req.user.id, (err, user) => {
        res.json(user);
      });
    });
  });
});

router.delete('/event/:id', (req, res) => {
  const apiCall = `api, router.delete(/event/${JSON.stringify(req.params.id)}`;
  logger.debug(`${apiCall} delete event (for user ${req.user.id})`);
  Event.findById(req.params.id, (err, event) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
    } else {
      event.remove();
    }
    fetchUser(req.user.id, (err, user) => {
      res.json(user);
    });
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
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
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
    }
  }, (err, results) => {
    Event.findById(req.params.id, (err, event) => {
      if (err) {
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
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
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
    }
  }, (err, results) => {
    Event.findById(req.params.id, (err, event) => {
      if (err) {
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
// remove about from performance
router.delete('/performance/:id/about/:aboutlanguage', (req, res) => {
  const apiCall = `api, router.delete(/performance/${JSON.stringify(req.params.id)}/about/${JSON.stringify(req.params.aboutlanguage)})`;
  logger.debug('________________API DELETE performance about ___________________');
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);
  Performance
    .findById(req.params.id)
    .exec((err, performance) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
      }
      // after delete, modify performance abouts
      performance.abouts.map((a) => {
        if (a.lang == req.params.aboutlanguage) {
          performance.abouts.remove(a);
          performance.aboutlanguage = '';
          performance.about = '';
        }
      });
      performance.save((_err) => {
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
// edit performance about
router.put('/performance/:id/about/:aboutlanguage', (req, res) => {
  const apiCall = `api, router.put(/performance/${JSON.stringify(req.params.id)}/about/${JSON.stringify(req.params.aboutlanguage)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  Performance.findById(req.params.id, (err, performance) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
    }
    if (performance) {
      if (performance.abouts) {
        // find the about
        performance.abouts.map((a) => {
          logger.debug(`${apiCall} not found ${a.abouttext}`);
          // BL notice the == instead of ===
          if (a.lang == req.params.aboutlanguage) {
            // about is found
            logger.debug(`${apiCall} about found ${a.abouttext}`);
            performance.about = a.abouttext;
            performance.aboutlanguage = a.lang;
          }
        });

      }
      performance.save((err) => {
        if (err) {
          logger.debug(`${apiCall} performance.saveERROR:' ${JSON.stringify(err)}`);
        }
        fetchUser(req.user.userId, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} fetchUser ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
});

router.put('/event/:id/performance/:performanceId', (req, res) => {
  const apiCall = `api, router.put(/event/${JSON.stringify(req.params.id)}/performance/${JSON.stringify(req.params.performanceId)})`;
  Performance
    .findById(req.params.performanceId)
    .exec((err, performance) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
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
  User // 20171217 was Crew
    .findById(req.params.organizingcrewId)
    .exec((err, organizingcrew) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
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

// BL delete category from event
router.delete('/event/:id/category/:categoryId', (req, res) => {
  const apiCall = `api, router.delete(/event/${JSON.stringify(req.params.id)}/category/${JSON.stringify(req.params.categoryId)})`;
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


router.post('/crew', (req, res) => {
  // BL FIXME if crew to add has the same title as existing crew, not updated
  const apiCall = `api, router.post(/post/crew/${JSON.stringify(req.body.title)})`;
  const newSlug = slugify(req.body.title);
  // 20171217 was Crew
  const newCrew = new User(Object.assign({}, req.body, {
    username: newSlug,
    stagename: req.body.title,
    slug: newSlug,
    // createdBy: req.user.id,
    members: [req.user.id]
  }));

  newCrew.save((saveerr, crew) => {
    if (saveerr) {
      logger.debug(`${apiCall} save ERROR: ${JSON.stringify(saveerr)}`);
    }

    fetchUser(req.user.id, (err, user) => {
      if (err) {
        logger.debug(`${apiCall} fetchUser ERROR: ${JSON.stringify(err)}`);
        throw err;
      }
      if (saveerr) {
        res.json(user);
      } else {
        user.crews.push(crew);
        User.update({ _id: user._id }, { crews: user.crews }, (_err) => {
          res.json(user);
        });

      }
    });

  });
});

// FIXME: Delete crew from user.crews
router.delete('/crew/:id', (req, res) => {
  // 20171217 was Crew
  User
    .findById(req.params.id, (err, crew) => {
      crew.remove();
      fetchUser(req.user.id, (err, user) => {
        res.json(user);
      });
    });
});

const upload = multer({ dest: process.env.STORAGE, storage: storage });
const up = upload.fields([
  { name: 'image', maxCount: 1 }
]);
router.post('/crew/:id/image', up, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.createImageAsset(file, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, imageUtil.sizes.crew.image, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    // 20171217 was Crew
    User.findById(req.params.id, (err, crew) => {
      if (err) {
        return next(err);
      }
      crew.image = results['image'];
      crew.save((err) => {
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

// FIXME of course upload5 is bullshit, but since we need to split
// this file into pieces, new names are worthless anyway
const upload5 = multer({ dest: process.env.STORAGE, storage: storage });
const up5 = upload5.fields([
  { name: 'image', maxCount: 1 }
]);
router.post('/crew/:id/teaser', up5, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.createImageAsset(file, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, imageUtil.sizes.crew.teaser, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    // 20171217 was Crew
    User.findById(req.params.id, (err, crew) => {
      if (err) {
        return next(err);
      }
      crew.teaserImage = results['image'];
      crew.save((err) => {
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
// FIXME of course upload7 is bullshit, but since we need to split
// this file into pieces, new names are worthless anyway
const upload7 = multer({ dest: process.env.STORAGE, storage: storage });
const up7 = upload7.fields([
  { name: 'image', maxCount: 1 }
]);
router.post('/crew/:id/orglogo', up7, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  const apiCall = `api, router.post(/crew/${JSON.stringify(req.params.id)}/orglogo)`;

  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.createImageAsset(file, (err, assetId) => {
          if (err) {
            logger.debug(`${apiCall} assetUtil.createImageAsset ERROR:' ${JSON.stringify(err)}`);
            throw err;
          }
          // BL svg don't resize! imageUtil.resize(assetId, imageUtil.sizes.crew.orglogo, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    // 20171217 was Crew
    User.findById(req.params.id, (err, crew) => {
      if (err) {
        logger.debug(`${apiCall}Crew.findById  ERROR:' ${JSON.stringify(err)}`);
        return next(err);
      }
      crew.org_logo = results['image'];
      crew.save((err) => {
        if (err) {
          logger.debug(`${apiCall} crew.save ERROR:' ${JSON.stringify(err)}`);
          return next(err);
        }
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
  });
});
// remove about from crew
router.delete('/crew/:id/about/:aboutlanguage', (req, res) => {
  const apiCall = `api, router.delete(/crew/${JSON.stringify(req.params.id)}/about/${JSON.stringify(req.params.aboutlanguage)})`;
  logger.debug('________________API DELETE crew about ___________________');
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);
  // 20171217 was Crew
  User
    .findById(req.params.id)
    .exec((err, crew) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
      }
      // after delete, modify crew fields with abouts
      crew.abouts.map((a) => {
        if (a.lang == req.params.aboutlanguage) {
          crew.abouts.remove(a);
          crew.aboutlanguage = '';
          crew.about = '';
        }
      });
      crew.save((_err) => {
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

// edit crew about
/*router.put('/crew/:id/about/:aboutlanguage', (req, res) => {
  const apiCall = `api, router.put(/crew/${JSON.stringify(req.params.id)}/about/${JSON.stringify(req.params.aboutlanguage)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  Crew.findById(req.params.id, (err, crew) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR:' ${JSON.stringify(err)}`);
    }
    if (crew) {
      if (crew.abouts) {
        // find the about
        crew.abouts.map((a) => {
          logger.debug(`${apiCall} about not found ${a.abouttext}`);
          // BL notice the == instead of ===
          if (a.lang == req.params.aboutlanguage) {
            // about in this language is found
            logger.debug(`${apiCall} about found ${a.abouttext}`);
            crew.about = a.abouttext;
            crew.aboutlanguage = a.lang;
          }
        });

      }
      crew.save((err) => {
        if (err) {
          logger.debug(`${apiCall} crew.save ERROR:' ${JSON.stringify(err)}`);
        }
        // BL FIXME user id is undefined?
        fetchUser(req.user.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} fetchUser ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
}); */

router.put('/crew/:id/member/:memberId', (req, res) => {
  const apiCall = `api, router.put(/crew/${JSON.stringify(req.params.id)}/member/${JSON.stringify(req.params.memberId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);
  // 20171217 was Crew
  User
    .findById(req.params.id)
    .exec((err, crew) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
      }
      // sometimes reindex elasticsearch if crew does not exist in mongodb anymore
      if (crew) {
        if (crew.members) {
          let memberFound = false;
          crew.members.map((m) => {
            // BL notice the == instead of ===
            if (m == req.params.memberId) {
              // member is found
              logger.info(`${apiCall} member found for this crew, not adding`);
              memberFound = true;
            }
          });
          // in case of new member, add it to the members
          if (!memberFound) {
            // try to get members email
            fetchCrewMemberById(req.params.memberId, (mErr, member) => {
              if (mErr) {
                logger.debug(`${apiCall} fetchCrewMemberById ERROR: ${JSON.stringify(mErr)}`);
              } else {
                if (member && member.email) {
                  logger.info(`${apiCall} fetchCrewMemberById member: ${JSON.stringify(member)}`);
                  // email found, we can add the member
                  crew.members.push(req.params.memberId);
                  // add this crew to the member (no confirmation tbd?)
                  member.crews.push(crew);
                  member.save((_err) => {
                    if (_err) {
                      logger.debug(`${apiCall} member save ERROR: ${JSON.stringify(_err)}`);
                    }
                  });
                  logger.info(`${apiCall} fetchCrewMemberById email: ${member.email}`);
                  // send email to member
                  // BL TODO verify email confirmed AND add crew to members account
                  mailer.addCrewMember({ to: member.email }, { msg: `${req.user.email} added you to crew: ${crew.slug}` }, (mErr) => {
                    if (mErr) {
                      logger.debug(`${apiCall} mailer ERROR ${JSON.stringify(mErr)}`);
                    }
                    req.flash('success', { msg: i18n.__('Member is informed with an Email') });
                    //res.redirect('/');
                  });
                  crew.save((cErr) => {
                    if (cErr) {
                      logger.debug(`${apiCall} save ERROR: ${JSON.stringify(cErr)} crew: ${JSON.stringify(crew)}`);
                    }
                  });
                } else {
                  if (member) {
                    logger.debug(`${apiCall} fetchCrewMemberById member email undefined: ${JSON.stringify(member)}`);
                  } else {
                    logger.debug(`${apiCall} fetchCrewMemberById member undefined, reindex elasticsearch?`);
                  }
                }
              }
            });
          }
        }
        crew.save((cErr) => {
          if (cErr) {
            logger.debug(`${apiCall} save ERROR: ${JSON.stringify(cErr)} crew: ${JSON.stringify(crew)}`);
          }
        });
      } else {
        logger.debug(`${apiCall} ERROR crew is null, reindex elasticsearch?`);
      }
    });
  fetchUser(req.user.id, (fErr, user) => {
    if (fErr) {
      logger.debug(`${apiCall} fetchUser ERROR: ${JSON.stringify(fErr)}`);
    }
    logger.info(`${apiCall} fetchUser ok`);
    res.json(user);
  });
});

// FIXME: Delete crew itself if no member left
router.delete('/crew/:id/member/:memberId', (req, res) => {
  const apiCall = `api, router.delete(/crew/${JSON.stringify(req.params.id)}/member/${JSON.stringify(req.params.memberId)})`;
  // delete member from crew
  // 20171217 was Crew
  User.findById(req.params.id, (cErr, crew) => {
    if (cErr) {
      logger.debug(`${apiCall} crew findById ERROR: ${JSON.stringify(uErr)}`);
    }
    else {
      crew.members.remove(req.params.memberId);
      logger.info(`${apiCall} member removed`);
      crew.save((cErr) => {
        if (cErr) {
          logger.debug(`${apiCall} crew save ERROR: ${JSON.stringify(cErr)} crew: ${JSON.stringify(crew)}`);
        }
      });
    }
  });
  // delete crew in member
  User
    .findById(req.params.memberId)
    .populate({
      path: 'crews',
      model: 'User'/*,
      // 20171217 was Crew
    
      populate: [{
        path: 'members' // virtual relation
      }]*/
    }).exec((err, user) => {
      logger.info(`${apiCall} findById user.crews: ${JSON.stringify(user.crews)}`);
      const crew = user.crews.find(c => { return c._id == req.params.id; });
      if (crew) {
        logger.info(`${apiCall} crew found: ${JSON.stringify(crew)}`);
        // Delete crew itself if this users was its only member BL archive it for freeze event?
        if (crew.members.length === 1) {
          Crew.findById(req.params.id, (err, crew) => {
            crew.remove();
          });
        }

      }
      // remove this crew from the user
      user.crews.remove(req.params.id);
      user.save((uErr) => {
        if (uErr) {
          logger.debug(`${apiCall} save ERROR: ${JSON.stringify(uErr)}`);
        }
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.put('/crew/:id', (req, res) => {
  // elegant way without using props
  const apiCall = `api, router.put(/crew/${req.params.id})`;
  if (req.params.id) {
    logger.debug(`${apiCall} crewId: ${req.params.id} userId: ${req.user.id}`);
    // abouts
    if (req.body.about && req.body.about.length > 2) {
      let aboutFound = false;
      if (req.body.abouts) {
        // find the about to set primary
        req.body.abouts.map((a) => {
          // BL notice the == instead of ===
          if (a.lang == req.body.aboutlanguage) {
            // about in this language is found
            logger.debug(`${apiCall} about lang found ${a.abouttext}`);
            aboutFound = true;
            a.abouttext = req.body.about;
          }
        });
      }
      if (!aboutFound) {
        let newAbout = { lang: req.body.aboutlanguage, abouttext: req.body.about };
        req.body.abouts.push(newAbout);
      }
    }
    // 20171217 was Crew
    User
      .findById(req.params.id, (err, crew) => {
        if (err) {
          logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
        }
        if (crew) {
          Object.assign(crew, req.body);// props);
          crew.save((cErr) => {
            if (cErr) {
              logger.debug(`${apiCall} save ERROR: ${JSON.stringify(cErr)} crew: ${JSON.stringify(crew)}`);
            }
            fetchUser(req.user.id, (fErr, user) => {
              if (fErr) {
                logger.debug(`${apiCall} fetchUser ERROR: ${JSON.stringify(fErr)}`);
              }
              res.json(user);
            });
          });
        } else {
          logger.debug(`${apiCall} ERROR crew is null`);
        }
      });
    } else {
      logger.debug(`${apiCall} crewId null ERROR: ${req.params.id} userId: ${req.user.id}`);
    }
});

router.post('/performance', (req, res) => {
  const newPerformance = new Performance(Object.assign({}, req.body, {
    title: req.body.title,
    slug: slugify(req.body.title)
  }));
  newPerformance.save((err, performance) => {
    fetchUser(req.user.id, (err, user) => {
      user.performances.push(performance);
      User.update({ _id: user._id }, { performances: user.performances }, (_err) => {
        res.json(user);
      });
    });
  });
});

router.delete('/performance/:id', (req, res) => {
  Performance.findById(req.params.id, (err, performance) => {
    performance.remove();
    fetchUser(req.user.id, (err, user) => {
      res.json(user);
    });
  });
});
// BL delete category from performance
router.delete('/performance/:id/category/:categoryId', (req, res) => {
  const apiCall = `api, router.delete(/performance/${JSON.stringify(req.params.id)}/category/${JSON.stringify(req.params.categoryId)})`;
  logger.debug(`${apiCall} delete category (for user ${req.user.id})`);
  Performance
    .findById(req.params.id)
    .exec((err, performance) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
      } else {
        performance.categories.remove(req.params.categoryId);
        performance.save((err) => {
          if (err) {
            logger.debug(`${apiCall} save ERROR: ${JSON.stringify(err)}  ${req.params.id}`);
          }
        });
      }
    });
  fetchUser(req.user.id, (err, user) => {
    res.json(user);
  });
});
const upload2 = multer({ dest: process.env.STORAGE, storage: storage });
const up2 = upload2.fields([
  { name: 'image', maxCount: 1 }
]);
router.post('/performance/:id/image', up2, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.createImageAsset(file, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, imageUtil.sizes.performance.image, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    Performance.findById(req.params.id, (err, performance) => {
      if (err) {
        return next(err);
      }
      performance.image = results['image'];
      performance.save((err) => {
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


// FIXME of course upload5 is bullshit, but since we need to split
// this file into pieces, new names are worthless anyway
const upload6 = multer({ dest: process.env.STORAGE, storage: storage });
const up6 = upload6.fields([
  { name: 'image', maxCount: 1 }
]);
router.post('/performance/:id/teaser', up6, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.createImageAsset(file, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, imageUtil.sizes.performance.teaser, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    Performance.findById(req.params.id, (err, performance) => {
      if (err) {
        return next(err);
      }
      performance.teaserImage = results['image'];
      performance.save((err) => {
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

router.put('/performance/:id', (req, res) => {
  const apiCall = `api, router.put(/performance/${JSON.stringify(req.params.id)})`;
  logger.debug(`${apiCall} req.params: ${JSON.stringify(req.params)}`);
  /* const props = {
  console.log(JSON.stringify(req.body));
  title: req.body.title,
  about: req.body.about,
  aboutlanguage: req.body.aboutlanguage,
  abouts: req.body.abouts,
  tech_art: req.body.tech_art,
  tech_req: req.body.tech_req,
  is_public: req.body.is_public,
  categories
}; */
  Performance.findById(req.params.id, (err, performance) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
    }
    if (performance) {
      Object.assign(performance, req.body); // props);
      performance.save((pErr) => {
        if (pErr) {
          logger.debug(`${apiCall} save ERROR: ${JSON.stringify(pErr)} performance: ${JSON.stringify(performance)}`);
        }
        fetchUser(req.user.id, (ferr, user) => {
          if (ferr) {
            logger.debug(`${apiCall} fetchUser ERROR: ${JSON.stringify(ferr)}`);
          }
          res.json(user);
        });
      });
    } else {
      logger.debug(`${apiCall} ERROR performance is null`);
    }
  });
});

router.post('/performance/:id/video', (req, res) => {
  // FIXME: delete old asset if available BL: or keep it?
  const apiCall = `api, router.post(/performance/${JSON.stringify(req.params.id)}/video/${JSON.stringify(req.body.video)})`;
  assetUtil.createVideoAsset(req.body.video, (err, assetId) => {
    if (err) {
      logger.debug(`${apiCall} assetUtil.createVideoAsset ERROR: ${JSON.stringify(err)}`);
    }

    Performance.findById(req.params.id, (err, performance) => {
      if (err) {
        logger.debug(`${apiCall} Performance.findById ERROR: ${JSON.stringify(err)}`);
      }
      logger.debug(`${apiCall} Performance.findById : ${JSON.stringify(performance)}`);
      if (performance) {
        performance.video = assetId;
      } else {
        logger.debug(`${apiCall} performance is null`);
      }
      performance.save(() => {
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
  });
});

router.put('/performance/:id/crew/:crewId', (req, res) => {
  const apiCall = `api, router.put(/performance/${JSON.stringify(req.params.id)}/crew/${JSON.stringify(req.params.crewId)})`;
  // 20171217 was Crew
  User
    .findById(req.params.crewId)
    .exec((err, crew) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
      }
      if (crew) {
        if (crew.performances) {
          let performanceFound = false;
          crew.performances.map((c) => {
            // BL notice the == instead of ===
            if (c == req.params.id) {
              // perf is found
              logger.debug(`${apiCall} perf found for this crew, not adding`);
              performanceFound = true;
            }
          });
          // in case of new performance, add it to the performances
          if (!performanceFound) {
            crew.performances.push(req.params.id);
          }
        }
        crew.save((_err) => {
          if (_err) {
            logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}  ${req.params.id}`);
          }
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      } else {
        logger.debug(`${apiCall} ERROR crew is null, reindex elasticsearch?`);
      }
    });
});

router.delete('/performance/:id/crew/:crewId', (req, res) => {
  const apiCall = `api, router.delete(/performance/${JSON.stringify(req.params.id)}/crew/${JSON.stringify(req.params.crewId)})`;
  // 20171217 was Crew
  User
    .findById(req.params.crewId)
    .exec((err, crew) => {
      crew.performances.remove(req.params.id);
      crew.save((_err) => {
        if (_err) {
          logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}`);
        }
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.put('/performance/:id/performer/:performerId', (req, res) => {
  const apiCall = `api, performance.put(/event/${JSON.stringify(req.params.id)}/performer/${JSON.stringify(req.params.performerId)})`;
  User
    .findById(req.params.performerId)
    .exec((err, performer) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
      }
      if (performer) {
        if (performer.performances) {
          let performanceFound = false;
          performer.performances.map((p) => {
            // BL notice the == instead of ===
            if (p == req.params.id) {
              // performance is found
              logger.debug(`${apiCall} performances found for this performer, not adding`);
              performanceFound = true;
            }
          });
          // in case of new performance, add it to the performances
          if (!performanceFound) {
            performer.performances.push(req.params.id);
          }
        }
        performer.save((_err) => {
          if (_err) {
            logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}`);
          }
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      } else {
        logger.debug(`${apiCall} ERROR performer is null, reindex elasticsearch?`);
      }
    });
});

router.delete('/performance/:id/performer/:performerId', (req, res) => {
  const apiCall = `api, router.delete(/performance/${JSON.stringify(req.params.id)}/performer/${JSON.stringify(req.params.performerId)})`;
  User
    .findById(req.params.performerId)
    .exec((err, performer) => {
      performer.performances.remove(req.params.id);
      performer.save((_err) => {
        if (_err) {
          logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}  ${req.params.id}`);
        }
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.get('/search/user', (req, res) => {
  const q = req.query.q;
  const apiCall = `api, router.get(/search/user/${JSON.stringify(req.query.q)})`;
  logger.debug(`${apiCall} searching: ${JSON.stringify(req.query.q)}`);
  const s = {
    index: elasticsearch.INDEX,
    type: 'user',
    body: {
      query: {
        // FIXME: only return three necessary fields…
        query_string: {
          query: q
        }
      }
    }
  };
  elasticsearch.getClient().search(s, (err, results) => {
    // BL FIXED results can be undefined -> app crash
    if (results.hits) {
      const flatResults = results.hits.hits.map((h) => {
        logger.debug(`${apiCall} hit: ${JSON.stringify(h)}`);
        return {
          id: h._id,
          stagename: h._source.stagename,
          name: '',
          imageUrl: h._source.imageUrl
        };
      });
      res.json(flatResults);
    } else {
      logger.debug(`${apiCall} results.hits undefined`);
      res.json([]);
    }
  });
});

router.get('/search/crew', (req, res) => {
  const q = req.query.q;
  const s = {
    index: elasticsearch.INDEX,
    type: 'crew',
    body: {
      query: {
        // FIXME: only return three necessary fields…
        query_string: {
          query: q
        }
      }
    }
  };
  elasticsearch.getClient().search(s, (err, results) => {
    const flatResults = results.hits.hits.map((h) => {
      return {
        id: h._id,
        name: h._source.name
      };
    });
    res.json(flatResults);
  });
});

router.get('/search/performance', (req, res) => {
  const q = req.query.q;
  const s = {
    index: elasticsearch.INDEX,
    type: 'performance',
    body: {
      query: {
        // FIXME: only return three necessary fields…
        query_string: {
          query: q
        }
      }
    }
  };
  elasticsearch.getClient().search(s, (err, results) => {
    const flatResults = results.hits.hits.map((h) => {
      return {
        id: h._id,
        title: h._source.title
      };
    });
    res.json(flatResults);
  });
});
// change UI language
router.put('/user/:id/language/:langId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/language/${JSON.stringify(req.params.langId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
    }
    user.language = req.params.langId;
    user.save((err) => {
      if (err) {
        logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
      }
      fetchUser(req.user.id, (err, user) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        res.json(user);
      });
    });
  });
});
router.post('/user/:id/image/profile', up, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.createImageAsset(file, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, imageUtil.sizes.user.profile, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        return next(err);
      }
      user.image = results['image'];
      user.save((err) => {
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

router.post('/user/:id/image/teaser', up, (req, res, next) => {
  // FIXME: Why next() as error handling?
  // FIXME: Delete old asset if there is one
  async.parallel({
    image: (cb) => {
      if (req.files['image']) {
        const file = req.files['image'][0];
        assetUtil.createImageAsset(file, (err, assetId) => {
          if (err) {
            console.log(err);
            throw err;
          }
          imageUtil.resize(assetId, imageUtil.sizes.user.teaser, cb);
        });
      } else {
        cb(null);
      }
    }
  }, (err, results) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        return next(err);
      }
      user.teaserImage = results['image'];
      user.save((err) => {
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
// links
/* obsolete router.get('/linktypes', (req, res) => {
  res.json([
    { 'key': 'web', 'name': 'Website' },
    { 'key': 'sk', 'name': 'Skype' },
    { 'key': 'tel', 'name': 'Telephone' },
    { 'key': 'fb', 'name': 'Facebook' },
    { 'key': 'tw', 'name': 'Twitter' },
    { 'key': 'ot', 'name': 'Other' }
  ]);
});*/
// countries
router.get('/countries', (req, res) => {
  // FIXME: Later evaluate language param to return
  // localized list depending on the user settings.
  const convert = R.compose(
    R.map(
      R.zipObj(['key', 'name'])
    ),
    R.toPairs
  );

  allCountries('en', (err, countries) => {
    if (err) {
      throw err;
    }
    res.json(convert(countries));
  });
});
// remove about from user
router.delete('/user/:id/about/:aboutlanguage', (req, res) => {
  const apiCall = `api, router.delete(/user/${JSON.stringify(req.params.id)}/about/${JSON.stringify(req.params.aboutlanguage)})`;
  logger.debug('________________API DELETE user about ___________________');
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);
  User
    .findById(req.params.id)
    .exec((err, user) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
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
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});
// edit user about
router.put('/user/:id/about/:aboutlanguage', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/about/${JSON.stringify(req.params.aboutlanguage)})`;
  logger.debug('________________API PUT user about ___________________');
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
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
        fetchUser(req.params.id, (err, user) => {
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
router.delete('/user/:id/link/:linkId', (req, res) => {
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
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

// change user primary email
router.put('/user/:id/email/:emailId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/email/${JSON.stringify(req.params.emailId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
    }
    if (user) {
      if (user.emails) {
        // find the email to set primary
        user.emails.map((e) => {
          e.is_primary = false;
          logger.debug(`${apiCall} primary not found ${e.email}`);
          // BL notice the == instead of ===
          if (e._id == req.params.emailId) {
            // event is found
            logger.debug(`${apiCall} primary email found ${e.email}`);
            e.is_primary = true;
            user.email = e.email;
          }
        });

      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        fetchUser(req.user.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
});
// user email MakePrivate
router.put('/user/:id/makeemailprivate/:emailId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/makeemailprivate/${JSON.stringify(req.params.linkId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
    }
    if (user) {
      if (user.emails) {
        // find the email to set primary
        user.emails.map((e) => {
          // BL notice the == instead of ===
          if (e._id == req.params.emailId) {
            // email is found
            logger.debug(`${apiCall} email found ${e.email}`);
            e.is_public = false;
          }
        });
      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        fetchUser(req.user.id, (err, user) => {
          if (err) {
            logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
          }
          res.json(user);
        });
      });
    }
  });
});
// user email MakePublic
router.put('/user/:id/makeemailpublic/:emailId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/makeemailpublic/${JSON.stringify(req.params.emailId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
    }
    if (user) {
      if (user.emails) {
        // find the email to set primary
        user.emails.map((e) => {
          // BL notice the == instead of ===
          if (e._id == req.params.emailId) {
            // email is found
            logger.debug(`${apiCall} email found ${e.email}`);
            e.is_public = true;
          }
        });
      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        fetchUser(req.user.id, (err, user) => {
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
router.put('/user/:id/emailconfirm/:emailId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/emailconfirm/${JSON.stringify(req.params.emailId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
    }
    if (user) {
      if (user.emails) {
        // find the email to confirm
        user.emails.map((e) => {
          // BL notice the == instead of ===
          if (e._id == req.params.emailId) {
            // email is found
            logger.debug(`${apiCall} email found ${e.email}`);
            e.confirm = uuid.v4();
            mailer.confirmEmail({ to: e.email }, { uuid: e.confirm }, (mErr) => {
              if (mErr) {
                logger.debug(`${apiCall} mailer ERROR ${JSON.stringify(mErr)}`);
              }
              req.flash('success', { msg: i18n.__('Email sent') });
            });
            // BL TODO e.is_confirmed = true;
          }
        });
      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
        }
        fetchUser(req.user.id, (err, user) => {
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
router.delete('/user/:id/email/:emailId', (req, res) => {
  User
    .findById(req.params.id)
    .exec((err, user) => {
      user.emails.remove(req.params.emailId);
      user.save((_err) => {
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});


// change user primary address
router.put('/user/:id/address/:addressId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/address/${JSON.stringify(req.params.addressId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
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
        fetchUser(req.user.id, (err, user) => {
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
router.put('/user/:id/makeaddressprivate/:addressId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/makeaddressprivate/${JSON.stringify(req.params.addressId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
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
        fetchUser(req.user.id, (err, user) => {
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
router.put('/user/:id/makeaddresspublic/:addressId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/makeaddresspublic/${JSON.stringify(req.params.addressId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
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
        fetchUser(req.user.id, (err, user) => {
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
router.delete('/user/:id/address/:addressId', (req, res) => {
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
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});
// add address to user
router.post('/user/place', (req, res, next) => {
  // BL check if next is needed/used
  const apiCall = 'api, router.post(/user/place)';
  let primary = true;
  let addressFound = false;
  User
    .findById(req.body.id, (err, user) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}  ${req.params.id}`);
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
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});
// add link to user
router.post('/user/link', (req, res, next) => {
  // BL check if next is needed/used
  const apiCall = 'api, router.post(/user/link)';
  logger.debug(`${apiCall} add link: ${JSON.stringify(req.body.links)}`);
  let linkFound = false;
  User
    .findById(req.body.id, (err, user) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}  ${req.params.id}`);
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
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});
/*
// edit user link
router.put('/user/:id/link/:linkId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/link/${JSON.stringify(req.params.linkId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR:' ${JSON.stringify(err)}`);
    }
    if (user) {
      if (user.links) {
        // find the link to edit
        user.links.map((l) => {
          logger.debug(`${apiCall} not found ${l.url}`);
          // BL notice the == instead of ===
          if (l._id == req.params.linkId) {
            // link is found
            logger.debug(`${apiCall} link found ${l.url}`);
            switch (l.type) {
              case 'sk':
              case 'mb':
              case 'tel':
                user.linkTel = l.url;
                break;
              case 'web':
                user.linkWeb = l.url;
                l.is_primary = true;
                break;
              case 'tw':
              case 'fb':
              case 'ot':
                user.linkSocial = l.url;
                break;
            }
            user.linkType = l.type;
          }
        });

      }
      user.save((err) => {
        if (err) {
          logger.debug(`${apiCall} save ERROR:' ${JSON.stringify(err)}`);
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
});*/
router.put('/user/:id', (req, res) => {
  // FIXME: Find elegant way…
  const apiCall = `api, router.put(/user/${JSON.stringify(req.user.id)}`;
  logger.debug('________________API PUT user___________________');
  logger.debug(`${apiCall} req.body.linkSocial: ${req.body.linkSocial}`);
  logger.debug(`${apiCall} req.body.links: ${JSON.stringify(req.body.links)}`);
  // abouts
  if (req.body.about && req.body.about.length > 2) {
    let aboutFound = false;
    if (req.body.abouts) {
      // find the about to set primary
      req.body.abouts.map((a) => {
        // BL notice the == instead of ===
        if (a.lang == req.body.aboutlanguage) {
          // about in this language is found
          logger.debug(`${apiCall} about lang found ${a.abouttext}`);
          aboutFound = true;
          a.abouttext = req.body.about;
        }
      });
    }
    if (!aboutFound) {
      let newAbout = { lang: req.body.aboutlanguage, abouttext: req.body.about };
      req.body.abouts.push(newAbout);
    }
  }
  // linkWeb
  logger.debug(`${apiCall} linkWeb ${req.body.linkWeb}`);
  if (req.body.linkWeb && req.body.linkWeb.length > 2) {
    let linkWebFound = false;
    if (req.body.links) {
      // find the link
      req.body.links.map((l) => {
        // BL notice the == instead of ===
        if (l.url == req.body.linkWeb) {
          // link url is found
          logger.debug(`${apiCall} linkWeb found ${l.url}`);
          linkWebFound = true;
        }
      });
    }
    if (!linkWebFound) {
      logger.debug(`${apiCall} linkWeb not found, adding ${req.body.linkWeb}`);
      let newLinkWeb = { type: 'web', url: req.body.linkWeb };
      req.body.links.push(newLinkWeb);
    }
  }
  // linkSocial
  if (req.body.linkSocial && req.body.linkSocial.length > 2) {
    let linkSocialFound = false;
    if (req.body.links) {
      // find the link
      req.body.links.map((l) => {
        // BL notice the == instead of ===
        if (l.url == req.body.linkSocial) {
          // link is found
          logger.debug(`${apiCall} linkSocial found ${l.url}`);
          linkSocialFound = true;
        }
      });
    }
    if (!linkSocialFound) {
      logger.debug(`${apiCall} linkSocial create ${req.body.linkType} ${req.body.linkSocial}`);
      let newLinkSocial = { type: req.body.linkType, url: req.body.linkSocial };
      req.body.links.push(newLinkSocial);
    }
  }
  // linkTel
  if (req.body.linkTel && req.body.linkTel.length > 2) {
    let linkTelFound = false;
    if (req.body.links) {
      // find the link
      req.body.links.map((l) => {
        // BL notice the == instead of ===
        if (l.url == req.body.linkTel) {
          // link is found
          logger.debug(`${apiCall} linkTel found ${l.url}`);
          linkTelFound = true;
        }
      });
    }
    if (!linkTelFound) {
      logger.debug(`${apiCall} linkTel create ${req.body.linkType} ${req.body.linkTel}`);
      let newLinkTel = { type: req.body.linkType, url: req.body.linkTel };
      req.body.links.push(newLinkTel);
    }
  }  
  // address fields
  if (req.body.locality && req.body.country && req.body.locality.length > 2) {
    /*let localityFound = false;
    if (req.body.addresses) {
      // find the locality
      req.body.addresses.map((l) => {
        // BL notice the == instead of ===
        if (l.locality == req.body.locality) {
          // locality is found
          logger.debug(`${apiCall} localityFound found ${l.locality}`);
          l.country == req.body.country;
          localityFound = true;
        }
      });
    }
    if (!localityFound) {*/     
      logger.debug(`${apiCall} create ${req.body.locality} ${req.body.country}`);
      let newAddress = { 
        street_number: req.body.street_number ? req.body.street_number : '',
        route: req.body.route ? req.body.route : '',
        administrative_area_level_1: req.body.administrative_area_level_1 ? req.body.administrative_area_level_1 : '',
        postal_code: req.body.postal_code ? req.body.postal_code : '',
        locality: req.body.locality, // public
        country: req.body.country //public
      };
      req.body.addresses.push(newAddress);
    //}
  }
  const props = {
    birthday: req.body.birthday,
    about: req.body.about,
    aboutlanguage: req.body.aboutlanguage,
    name: req.body.name,
    surname: req.body.surname,
    gender: req.body.gender,
    citizenship: req.body.citizenship,
    emails: req.body.emails,
    links: req.body.links,
    addresses: req.body.addresses,
    abouts: req.body.abouts,
  };

  User.findById(req.user.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
    }
    if (user) {
      Object.assign(user, props); // BL was props 20171217
      user.save((uErr) => {
        if (uErr) {
          logger.debug(`${apiCall} save ERROR: ${JSON.stringify(uErr)}`);
        }
        fetchUser(req.user.id, (fErr, user) => {
          if (fErr) {
            logger.debug(`${apiCall} fetchUser ERROR: ${JSON.stringify(fErr)}`);
          }
          res.json(user);
        });
      });
    } else {
      logger.debug(`${apiCall} ERROR user is null`);
    }
  });
});

module.exports = router;
