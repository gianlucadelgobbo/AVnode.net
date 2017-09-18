const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Crew = mongoose.model('Crew');
const Performance = mongoose.model('Performance');
const Venue = mongoose.model('Venue');
const slugify = require('../../utilities/slug').parse;
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
  Event.findById(req.params.id, (err, event) => {
    event.remove();
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
  Performance
    .findById(req.params.performanceId)
    .exec((err, performance) => {
      performance.events.push(req.params.id);
      performance.save((_err) => {
        // FIXME: Handle error…
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.delete('/event/:id/performance/:performanceId', (req, res) => {
  Performance
    .findById(req.params.performanceId)
    .exec((err, performance) => {
      performance.events.remove(req.params.id);
      performance.save((_err) => {
        // FIXME: Handle error…
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.put('/event/:id/organizer/:organizerId', (req, res) => {
  User
    .findById(req.params.organizerId)
    .exec((err, organizer) => {
      organizer.events.push(req.params.id);
      organizer.save((_err) => {
        // FIXME: Handle error…
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.delete('/event/:id/organizer/:organizerId', (req, res) => {
  User
    .findById(req.params.organizerId)
    .exec((err, organizer) => {
      organizer.events.remove(req.params.id);
      organizer.save((_err) => {
        // FIXME: Handle error…
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.put('/event/:id/organizingcrew/:organizingcrewId', (req, res) => {
  Crew
    .findById(req.params.organizingcrewId)
    .exec((err, organizingcrew) => {
      organizingcrew.events.push(req.params.id);
      organizingcrew.save((_err) => {
        // FIXME: Handle error…
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.delete('/event/:id/organizingcrew/:organizingcrewId', (req, res) => {
  Crew
    .findById(req.params.organizingcrewId)
    .exec((err, organizingcrew) => {
      organizingcrew.events.remove(req.params.id);
      organizingcrew.save((_err) => {
        // FIXME: Handle error…
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.post('/event/venue', (req, res) => {
  let street_number = '';
  let route = '';
  let postal_code = '';
  let locality = '';
  let administrative_area_level_1 = '';
  let country = '';

  for (var i in req.body.location.address_components) {
    if (req.body.location.address_components[i].types[0] == 'street_number') street_number = req.body.location.address_components[i].long_name;
    if (req.body.location.address_components[i].types[0] == 'route') route = req.body.location.address_components[i].long_name;
    if (req.body.location.address_components[i].types[0] == 'postal_code') postal_code = req.body.location.address_components[i].long_name;
    if (req.body.location.address_components[i].types[0] == 'locality') locality = req.body.location.address_components[i].long_name;
    if (req.body.location.address_components[i].types[0] == 'administrative_area_level_1') administrative_area_level_1 = req.body.location.address_components[i].long_name;
    if (req.body.location.address_components[i].types[0] == 'country') country = req.body.location.address_components[i].long_name;
  }
  const newVenue = new Venue({
    address: req.body.location.formatted_address,
    street_number: street_number,
    route: route,
    postal_code: postal_code,
    locality: locality,
    administrative_area_level_1,
    country: country,
    geometry: req.body.location.geometry,
    place_id: req.body.location.place_id
  }).save((err, venue) => {
    Event
      .findById(req.body.id, (err, event) => {
        event.venues.push(venue._id);
        event.save((err) => {
          fetchUser(req.user.id, (err, user) => {
            res.json(user);
          });
        });
      });
  });
});

router.delete('/event/:id/venue/:venueId', (req, res) => {
  Event
    .findById(req.params.id)
    .exec((err, event) => {
      event.venues.remove(req.params.venueId);
      event.save((_err) => {
        // FIXME: Handle error…
        Venue.findById(req.params.venueId).remove();
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.post('/crew', (req, res) => {
  const newCrew = new Crew(Object.assign({}, req.body, {
    name: req.body.title,
    slug: slugify(req.body.title),
    members: []
  }));
  newCrew.save((err, crew) => {
    fetchUser(req.user.id, (err, user) => {
      user.crews.push(crew);
      User.update({ _id: user._id }, { crews: user.crews }, (_err) => {
        res.json(user);
      });
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

router.put('/crew/:id/member/:memberId', (req, res) => {
  User
    .findById(req.params.memberId)
    .exec((err, user) => {
      user.crews.push(req.params.id);
      user.save((_err) => {
        // FIXME: Handle error…
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

// FIXME: Delete crew itself if no member left
router.delete('/crew/:id/member/:memberId', (req, res) => {
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
        // FIXME: Handle error…
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.put('/crew/:id', (req, res) => {
  // FIXME: Find elegant way…
  const props = {
    name: req.body.name,
    about: req.body.about
  };
  Crew
    .findById(req.params.id, (err, crew) => {
      console.log(err);
      Object.assign(crew, props);
      crew.save(() => {
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
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
const up6 = upload5.fields([
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
  const props = {
    title: req.body.title,
    about: req.body.about
  };
  Performance.findById(req.params.id, (err, performance) => {
    console.log(err);
    Object.assign(performance, props);
    performance.save(() => {
      fetchUser(req.user.id, (err, user) => {
        res.json(user);
      });
    });
  });
});

router.post('/performance/:id/video', (req, res) => {
  // FIXME: delete old asset if available
  assetUtil.createVideoAsset(req.body.video, (err, assetId) => {
    Performance.findById(req.params.id, (err, performance) => {
      console.log(err);
      performance.video = assetId;
      performance.save(() => {
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
  });
});

router.put('/performance/:id/crew/:crewId', (req, res) => {
  Crew
    .findById(req.params.crewId)
    .exec((err, crew) => {
      crew.performances.push(req.params.id);
      crew.save((_err) => {
        // FIXME: Handle error…
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.delete('/performance/:id/crew/:crewId', (req, res) => {
  Crew
    .findById(req.params.crewId)
    .exec((err, crew) => {
      crew.performances.remove(req.params.id);
      crew.save((_err) => {
        // FIXME: Handle error…
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.put('/performance/:id/performer/:performerId', (req, res) => {
  User
    .findById(req.params.performerId)
    .exec((err, performer) => {
      performer.performances.push(req.params.id);
      performer.save((_err) => {
        // FIXME: Handle error…
        fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.delete('/performance/:id/performer/:performerId', (req, res) => {
  User
    .findById(req.params.performerId)
    .exec((err, performer) => {
      performer.performances.remove(req.params.id);
      performer.save((_err) => {
        // FIXME: Handle error…
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

router.put('/user/:id', (req, res) => {
  // FIXME: Find elegant way…
  // BL FIXME #5 add surname, etc
  const props = {
    birthday: req.body.birthday,
    about: req.body.about,
    name: req.body.name,
    surname: req.body.surname,
    gender: req.body.gender,
    citizenship: req.body.citizenship,
    emails: req.body.emails,
    address: req.body.address,
    street_number: req.body.street_number,
    route: req.body.route,
    postal_code: req.body.postal_code,
    locality: req.body.locality,
    administrative_area_level_1: req.body.administrative_area_level_1,
    country: req.body.country
  };

  User.findById(req.user.id, (err, user) => {
    console.log(err);
    Object.assign(user, props);
    user.save(() => {
      fetchUser(req.user.id, (err, user) => {
        res.json(user);
      });
    });
  });
});

module.exports = router;
