const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Crew = mongoose.model('Crew');
const Performance = mongoose.model('Performance');
const Venue = mongoose.model('Venue');
const slugify = require('../../utilities/slug').parse;
const logger = require('../../utilities/logger');
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

const fetchUser = (id, cb) => {
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
};

router.get('/user', (req, res) => {
  fetchUser(req.user.id, (err, user) => {
    res.json(user);
  });
});
// BL TODO this might be the elegant way! Search for // FIXME: Find elegant way…
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
  Crew
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
  Crew
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
  const newVenue = new Venue({
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

formatAddress = (location, placename, primary) => {
  let street_number = '';
  let route = '';
  let postal_code = '';
  let locality = '';
  let administrative_area_level_1 = '';
  let country = '';
  console.log('formatAddress:' + JSON.stringify(location));
  for (let i in location.address_components) {
    if (location.address_components[i].types[0] == 'street_number') street_number = location.address_components[i].long_name;
    if (location.address_components[i].types[0] == 'route') route = location.address_components[i].long_name;
    if (location.address_components[i].types[0] == 'postal_code') postal_code = location.address_components[i].long_name;
    if (location.address_components[i].types[0] == 'locality') locality = location.address_components[i].long_name;
    if (location.address_components[i].types[0] == 'administrative_area_level_1') administrative_area_level_1 = location.address_components[i].long_name;
    if (location.address_components[i].types[0] == 'country') country = location.address_components[i].long_name;
  }

  // BL TODO check if place_id is unique 
  const address = {
    formatted_address: location.formatted_address, // BL gmap response formatted_address, should not be updated to stay unique
    street_number: street_number,
    route: route,
    postal_code: postal_code,
    locality: locality,
    administrative_area_level_1,
    country: country,
    geometry: location.geometry,
    place_id: location.place_id,
    placename: placename, // BL friendly placename indexed for search
    is_primary: primary
  };
  return address;
};
// add address to user
router.post('/user/place', (req, res, next) => {
  // BL check if next is needed/used
  let primary = true;
  User
    .findById(req.body.id, (err, user) => {
      if (err) {
        return next(err);
      }
      if (user.addresses && user.addresses.length > 0) primary = false;
      user.addresses.push(formatAddress(req.body.location, req.body.location.name, primary));
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
// remove address from user
router.delete('/user/:id/place/:placeId', (req, res) => {
  User
    .findById(req.params.id)
    .exec((err, user) => {
      // BL TODO user.addresses remove req.params.placeId ;
      user.save((_err) => {
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});
router.post('/crew', (req, res) => {
  // BL FIXME if crew to add has the same title as existing crew, not updated
  const apiCall = `api, router.post(/post/crew/${JSON.stringify(req.body.title)})`;
  let newSlug = slugify(req.body.title);

  const newCrew = new Crew(Object.assign({}, req.body, {
    name: req.body.title,
    slug: newSlug,
    members: []
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
  Crew
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
    Crew.findById(req.params.id, (err, crew) => {
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
    Crew.findById(req.params.id, (err, crew) => {
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
// change crew primary about
router.put('/crew/:id/about/:aboutId', (req, res) => {
  const apiCall = `api, router.put(/crew/${JSON.stringify(req.params.id)}/about/${JSON.stringify(req.params.aboutId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  Crew.findById(req.params.id, (err, crew) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
    }
    if (crew) {
      if (crew.abouts) {
        // find the about to set primary
        crew.abouts.map((a) => {
          a.is_primary = false;
          logger.debug(`${apiCall} primary not found ${a.abouttext}`);
          // BL notice the == instead of ===
          if (a._id == req.params.aboutId) {
            // event is found
            logger.debug(`${apiCall} primary about found ${a.abouttext}`);
            a.is_primary = true;
            crew.about = a.abouttext;
            crew.aboutlanguage = a.lang;
          }
        });

      }
      crew.save((err) => {
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

router.put('/crew/:id/member/:memberId', (req, res) => {
  const apiCall = `api, router.put(/crew/${JSON.stringify(req.params.id)}/member/${JSON.stringify(req.params.perfmemberIdormanceId)})`;
  User
    .findById(req.params.memberId)
    .exec((err, user) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
      }
      // sometimes reindex elasticsearch if user does not exist in mongodb anymore
      if (user) {
        if (user.crews) {
          let crewFound = false;
          user.crews.map((c) => {
            // BL notice the == instead of ===
            if (c == req.params.id) {
              // crew is found
              logger.debug(`${apiCall} crew found for this user, not adding`);
              crewFound = true;
            }
          });
          // in case of new crew, add it to the crews
          if (!crewFound) {
            user.crews.push(req.params.id);
          }
        }
        user.save((_err) => {
          if (_err) {
            logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}  ${req.params.id}`);
          }
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      } else {
        logger.debug(`${apiCall} ERROR user is null, reindex elasticsearch?`);
      }
    });
});

// FIXME: Delete crew itself if no member left
router.delete('/crew/:id/member/:memberId', (req, res) => {
  const apiCall = `api, router.delete(/crew/${JSON.stringify(req.params.id)}/member/${JSON.stringify(req.params.memberId)})`;
  User
    .findById(req.params.memberId)
    .populate({
      path: 'crews',
      model: 'Crew',
      populate: [{
        path: 'members' // virtual relation
      }]
    }).exec((err, user) => {
      const crew = user.crews.find(c => { return c._id == req.params.id; });
      // Delete crew itself if this users was its only member
      if (crew.members.length === 1) {
        Crew.findById(req.params.id, (err, crew) => {
          crew.remove();
        });
      }

      user.crews.remove(req.params.id);
      user.save((_err) => {
        if (_err) {
          logger.debug(`${apiCall} save ERROR: ${JSON.stringify(_err)}`);
        }
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.put('/crew/:id', (req, res) => {
  // elegant way without using props
  const apiCall = `api, router.put(/crew/${JSON.stringify(req.params.id)})`;
  /*const props = {
    name: req.body.name,
    about: req.body.about,
    aboutlanguage: req.body.aboutlanguage,
    abouts: req.body.abouts
  };*/
  Crew
    .findById(req.params.id, (err, crew) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
      }
      if (crew) {
        Object.assign(crew, req.body);// props);
        crew.save(() => {
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      } else {
        logger.debug(`${apiCall} ERROR crew is null`);
      }
    });
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
  // FIXME: find elegant way to extract only some props
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
    console.log(err);
    Object.assign(performance, req.body); // props);
    performance.save(() => {
      fetchUser(req.user.id, (err, user) => {
        res.json(user);
      });
    });
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
  Crew
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
  Crew
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
    // BL FIXME results can be undefined -> app crash
    const flatResults = results.hits.hits.map((h) => {
      console.log('hit', h);
      return {
        id: h._id,
        stagename: h._source.stagename,
        name: '',
        imageUrl: h._source.imageUrl
      };
    });
    res.json(flatResults);
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
router.get('/linktypes', (req, res) => {
  res.json([
    { 'key': 'web', 'name': 'Website' },
    { 'key': 'sk', 'name': 'Skype' },
    { 'key': 'tel', 'name': 'Telephone' },
    { 'key': 'fb', 'name': 'Facebook' },
    { 'key': 'tw', 'name': 'Twitter' },
    { 'key': 'ot', 'name': 'Other' }
  ]);
});
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

// change user primary about
router.put('/user/:id/about/:aboutId', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/about/${JSON.stringify(req.params.aboutId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
    }
    if (user) {
      if (user.abouts) {
        // find the about to set primary
        user.abouts.map((a) => {
          a.is_primary = false;
          logger.debug(`${apiCall} primary not found ${a.abouttext}`);
          // BL notice the == instead of ===
          if (a._id == req.params.aboutId) {
            // event is found
            logger.debug(`${apiCall} primary about found ${a.abouttext}`);
            a.is_primary = true;
            user.about = a.abouttext;
            user.aboutlanguage = a.lang;
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

router.put('/user/:id', (req, res) => {
  // FIXME: Find elegant way…
  const apiCall = `api, router.put(/user/${JSON.stringify(req.user.id)}`;
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
      Object.assign(user, props);
      user.save(() => {
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    } else {
      logger.debug(`${apiCall} ERROR user is null`);
    }
  });
});

module.exports = router;
