const router = require('../../router')();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.STORAGE);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid.v4()}.${mime.extension(file.mimetype)}`);
  }
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
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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
        if (!catFound) performance.categories.push({ name: req.params.category });
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
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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
    const apiCall = 'api, performance image: ';
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
              imageUtil.resize(assetId, imageUtil.sizes.performance.image, cb);
            });
          } else {
            cb(null);
          }
        } else {
          cb(null);
        }
      }
    }, (err, results) => {
      Performance.findById(req.params.id, (err, performance) => {
        if (err) {
          req.flash('errors', { msg: `findById ERROR: ${JSON.stringify(err)}` });
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
    const apiCall = 'api, performance teaser: ';
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
              imageUtil.resize(assetId, imageUtil.sizes.performance.teaser, cb);
            });
          } else {
            cb(null);
          }
        } else {
          cb(null);
        }
      }
    }, (err, results) => {
      Performance.findById(req.params.id, (err, performance) => {
        if (err) {
          req.flash('errors', { msg: `findById ERROR: ${JSON.stringify(err)}` });
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
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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

  module.exports = router;