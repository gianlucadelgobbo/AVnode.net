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
    const apiCall = 'api, crew image: ';
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
              imageUtil.resize(assetId, imageUtil.sizes.crew.image, cb);
            });
          } else {
            cb(null);
          }
        } else {
          cb(null);
        }
      }
    }, (err, results) => {
      // 20171217 was Crew
      User.findById(req.params.id, (err, crew) => {
        if (err) {
          req.flash('errors', { msg: `findById ERROR: ${JSON.stringify(err)}` });
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
    const apiCall = 'api, crew teaser: ';
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
              imageUtil.resize(assetId, imageUtil.sizes.crew.teaser, cb);
            });
          } else {
            cb(null);
          }
        } else {
          cb(null);
        }
      }
    }, (err, results) => {
      // 20171217 was Crew
      User.findById(req.params.id, (err, crew) => {
        if (err) {
          req.flash('errors', { msg: `findById ERROR: ${JSON.stringify(err)}` });
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
          logger.debug(`${apiCall} Crew.findById  ERROR:' ${JSON.stringify(err)}`);
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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
      .select({ 'members': 1, 'slug': 1, 'stagename': 1, 'email': 1, 'username': 1 })
      .populate([{
        path: 'members', // virtual relation
        model: 'User',
        select: { '_id': 1, 'slug': 1, 'stagename': 1, 'email': 1, 'username': 1 },
      }])
      .exec((err, crew) => {
        if (err) {
          logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
          req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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
                      req.flash('success', { msg: __('Member is informed with an Email') });
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
                      req.flash('ERROR', { msg: 'Member undefined' });
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
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(cErr)}` });
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
        req.flash('errors', { msg: `${apiCall} findById ERROR: ${JSON.stringify(err)}` });
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
  module.exports = router;