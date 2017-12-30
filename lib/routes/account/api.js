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

const i18n = require('../../plugins/i18n');
const elasticsearch = require('../../plugins/elasticsearch');
// BL 20171123 removed some performances fields
const fetchUser = (id, cb) => {
  User
    .findById(id)
    //.select({'-galleries': 1})
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
      }/*, {
        path: 'performances' // virtual relation
      }, {
        path: 'organizers', // virtual relation
      }, {
        path: 'organizing_crews', // virtual relation
      }*/]
    }, {
      path: 'performances',
      model: 'Performance',
      select: { 
        'slug': 1, 
        'title': 1, 
        'about': 1, 
        'aboutlanguage': 1, 
        'abouts': 1, 
        'image': 1, 
        'teaserImage': 1, 
        'file': 1, 
        'categories': 1, 
        'tech_art': 1, 
        'tech_req': 1, 
        'video': 1 },
      populate: [{
        path: 'image',
        model: 'Asset'
      }, {
        path: 'teaserImage',
        model: 'Asset'
      }, {
        path: 'video',
        model: 'Asset'
      }] //, {
        //path: 'performers', select: { 'stagename': 1 } // virtual relation
      //}//, { //, 'events': 0, 'crews': 0, 'performances': 0, 'addresses': 0, 'emails': 0
        //path: 'crews' // virtual relation
      //}   
    }, {
      path: 'crews',
      select: { 
        '-members':1, 
        'org_name': 1,
        'org_foundation_year': 1,
        'org_type': 1, 
        'org_logo': 1,
        'org_web_social_channels': 1,
        'org_web_social_channels_for_project_likes_shares': 1,
        'org_phone': 1,
        'description': 1,
        'org_aims_and_activities': 1,
        'org_pic_code': 1,
        'org_address': 1,
        'org_vat_number': 1,
        'org_able_to_recuperate_vat': 1,
        'org_official_registration_number': 1,
        'org_legal_representative_title': 1,
        'org_legal_representative_role': 1,
        'org_legal_representative_name': 1,
        'org_legal_representative_surname': 1,
        'org_legal_representative_email': 1,
        'org_legal_representative_mobile_phone': 1,
        'org_legal_representative_skype': 1,
        'org_legal_representative_facebook': 1,
        'org_contact_facebook': 1,
        'activity_season': 1,
        'org_statute': 1,
        'org_members_cv': 1,
        'org_activity_report': 1,
        'org_permanent_employees': 1,
        'org_permanent_employees_avnode': 1,
        'org_temporary_employees': 1,
        'org_temporary_employees_avnode': 1,
        'org_relevance_in_the_project': 1,
        'org_emerging_artists_definition': 1,
        'org_eu_grants_received_in_the_last_3_years': 1,
        'org_annual_turnover_in_euro': 1,
        'org_contact_title': 1,
        'org_contact_role': 1,
        'org_contact_name': 1,
        'org_contact_surname': 1,
        'org_contact_email': 1,
        'org_contact_language': 1,
        'org_contact_mobile_phone': 1,
        'org_contact_skype': 1,
        'org_website': 1,
        'org_public_email': 1,
        'activity_name': 1,
        'activity_logo': 1,
        'activity_start_date': 1,
        'activity_is_running': 1,
        'activity_end_date': 1,
        'activity_address': 1,
        'activity_website': 1,
        'activity_web_social_channels': 1,
        'activity_public_email': 1,
        'projects': 1,
        'memberscvs': 1,
        'summaryofmemberscvs': 1,
        'activityreport': 1,
        'membershipdate': 1,
        'avnodedelegate': 1,
        'agreementstatus': 1,
        'introducedby1': 1,
        'introducedby2': 1,
        'slug': 1, 
        'stagename': 1, 
        'username': 1, 
        'about': 1, 
        'aboutlanguage': 1, 
        'abouts': 1, 
        'image': 1, 
        'teaserImage': 1, 
        'file': 1 
      },
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
        select: { '_id': 1, 'slug': 1, 'stagename': 1, 'username': 1 }
      }]
    }])
    .exec(cb);
};

const fetchCrewMemberById = (id, cb) => {
  User
    .findById(id)
    .populate({
      path: 'crews',
      model: 'User' // 20171217 was Crew
    })
    .exec(cb);
};
/* const fetchUserCrews = (id, cb) => {
  console.log('crewid:' + id);
  User
    .findById(id)
    .select({ 
      '-members':1, 
      '-abouts':1, 
      'org_name': 1, 
      'slug': 1, 
      'stagename': 1, 
      'username': 1
    })
    .exec(cb);
}; */
router.get('/user', (req, res) => {
  const apiCall = `api, router.get(/user/${JSON.stringify(req.user.id)}`;

  fetchUser(req.user.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
    }
    let str = JSON.stringify(user);
    //logger.debug(`${apiCall} user ${str})`);
    logger.debug(`${apiCall} user size ${str.length})`);
    logger.debug(`${apiCall} user perfs size ${JSON.stringify(user.performances).length})`);
    logger.debug(`${apiCall} user gals size ${JSON.stringify(user.galleries).length})`);
    logger.debug(`${apiCall} user crews size ${JSON.stringify(user.crews).length})`);
    logger.debug(`${apiCall} user events size ${JSON.stringify(user.events).length})`);
    //logger.debug(`${apiCall} user crews before ${JSON.stringify(user.crews)})`);
    /*user.crews.map((c) => (     
      fetchUserCrews(c, (err, crew) => {
        if (err) {
          logger.debug(`${apiCall} user crew findById ERROR: ${JSON.stringify(err)}`);
        }
        let str = JSON.stringify(crew);
        logger.debug(`${apiCall} crew ${str})`);
        logger.debug(`${apiCall} crew size ${str.length})`);
        user.crews = Object.assign(user.crews, str );
      })
    ))*/
    //logger.debug(`${apiCall} user crews after ${JSON.stringify(user.crews)})`);    
    res.json(user);
  });
});
// BL TODO this is the elegant way! Search for // FIXME: Find elegant way…
router.put('/event/:id', (req, res) => {
  const apiCall = `api, router.put(/event/${JSON.stringify(req.params.id)})`;
  logger.debug(`${apiCall} req.params: ${JSON.stringify(req.params)}`);

  Event.findById(req.params.id, (err, event) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
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
      if (!catFound) event.categories.push({name:req.params.category});
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
  User
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
    org_name: req.body.title,
    is_crew: true,
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

router.put('/crew/:id/member/:memberId', (req, res) => {
  const apiCall = `api, router.put(/crew/${JSON.stringify(req.params.id)}/member/${JSON.stringify(req.params.memberId)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);
  // 20171217 was Crew
  User
    .findById(req.params.id)
    .select({'members': 1, 'slug':1, 'stagename': 1, 'email': 1, 'username': 1})
    .populate([{
      path: 'members', // virtual relation
      model: 'User',
      select: { '_id': 1, 'slug': 1, 'stagename': 1, 'email': 1, 'username': 1 },
    }])
    .exec((err, crew) => {
      if (err) {
        logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
      }
      
      // sometimes reindex elasticsearch if crew does not exist in mongodb anymore
      if (crew) {
        logger.debug(`${apiCall} findById crew.slug: ${crew.slug}`);
        logger.debug(`${apiCall} findById crew: ${JSON.stringify(crew)}`);
        logger.debug(`${apiCall} findById crew._id: ${crew._id}`);
        logger.debug(`${apiCall} findById crew.members: ${crew.members}`);
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
                    req.flash('ERROR', { msg: 'Member undefined'});
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
          } else {
            logger.info(`${apiCall} crew saved`);
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
      logger.debug(`${apiCall} crew findById ERROR: ${JSON.stringify(cErr)}`);
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
          User.findById(req.params.id, (err, crew) => {
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
  logger.debug('________API PUT crew _________');
  //logger.debug(`${apiCall} req.body.linkSocial: ${req.body.linkSocial}`);
  logger.debug(`${apiCall} req.body.links: ${JSON.stringify(req.body.links)}`);

  User.findById(req.params.id, (err, crew) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
    }
    if (crew) {
      Object.assign(crew, req.body);
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
// add performance category
router.put('/performance/:id/category/:category', (req, res) => {
  const apiCall = `api, router.put(/performance/${JSON.stringify(req.params.id)}/category/${JSON.stringify(req.params.category)})`;
  logger.debug(`${apiCall} req.params:' ${JSON.stringify(req.params)}`);

  Performance.findById(req.params.id, (err, performance) => {
    if (err) {
      logger.debug(`${apiCall} ERROR:' ${JSON.stringify(err)}`);
    }
    if (performance) {
      logger.debug(`${apiCall} performance:' ${JSON.stringify(performance)}`);
      let catFound = false;
      if (performance.categories) {
        // find if exists
        performance.categories.map((p) => {
          logger.debug(`${apiCall} performance:' ${p}`);
          // BL notice the == instead of ===
          if (p.name == req.params.category) {
            // category is found
            catFound = true;
            logger.debug(`${apiCall} category found, not adding`);
          }
        });
      }
      if (!catFound) performance.categories.push({name:req.params.category});
      performance.save((err) => {
        if (err) {
          logger.debug(`${apiCall} performance.save ERROR:' ${JSON.stringify(err)}`);
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
// delete category from performance
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
        fetchUser(req.user.id, (fErr, user) => {
          if (fErr) {
            logger.debug(`${apiCall} fetchUser ERROR: ${JSON.stringify(fErr)}`);
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

// user email toggleprivacy
router.put('/user/:id/toggleprivacy/:emailIndex', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/toggleprivacy/${JSON.stringify(req.params.emailIndex)})`;
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
          user.emails[emailIndex].is_public = !user.emails[emailIndex].is_public;
        }
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
});// user email MakePrivate
router.put('/user/:id/makeemailprivate/:emailIndex', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/makeemailprivate/${JSON.stringify(req.params.emailIndex)})`;
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
          user.emails[emailIndex].is_public = false;
        }
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
router.put('/user/:id/makeemailpublic/:emailIndex', (req, res) => {
  const apiCall = `api, router.put(/user/${JSON.stringify(req.params.id)}/makeemailpublic/${JSON.stringify(req.params.emailIndex)})`;
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
          user.emails[emailIndex].is_public = true;
        }
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
router.put('/user/:id/emailconfirm/:emailIndex', (req, res) => {
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
              req.flash('success', { msg: i18n.__('Email sent') });
            });
          }
        }
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

router.put('/user/:id', (req, res) => {
  // FIXME: Find elegant way…
  const apiCall = `api, router.put(/user/${JSON.stringify(req.user.id)}`;
  logger.debug('________________API PUT user___________________');
  //logger.debug(`${apiCall} req.body.linkSocial: ${req.body.linkSocial}`);
  logger.debug(`${apiCall} req.body.links: ${JSON.stringify(req.body.links)}`);

  User.findById(req.params.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
    }
    if (user) {
      Object.assign(user, req.body);
      user.save((uErr) => {
        if (uErr) {
          logger.debug(`${apiCall} save ERROR: ${JSON.stringify(uErr)}`);
        }
        fetchUser(req.params.id, (fErr, user) => {
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
