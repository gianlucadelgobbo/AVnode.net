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
        dataproviderAdmin.fetchUser(req.user.id, (err, user) => {
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
        dataproviderAdmin.fetchUser(req.user.id, (err, user) => {
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
        dataproviderAdmin.fetchUser(req.user.id, (err, user) => {
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
        dataproviderAdmin.fetchUser(req.user.id, (err, user) => {
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
        dataproviderAdmin.fetchUser(req.user.id, (err, user) => {
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
        dataproviderAdmin.fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    });
});

router.put('/:id', (req, res) => {
  // FIXME: Find elegant way…
  const apiCall = `api, router.put(/user/${JSON.stringify(req.user.id)}`;
  logger.debug('________________API PUT user___________________');
  logger.debug(`${apiCall} req.body.about: ${req.body.about}`);
  logger.debug(`${apiCall} req.body.locality: ${req.body.locality}`);
  logger.debug(`${apiCall} req.body.country: ${req.body.country}`);
  logger.debug(`${apiCall} req.body.abouts: ${JSON.stringify(req.body.abouts)}`);
  logger.debug(`${apiCall} req.body.name: ${req.body.name}`);
  logger.debug(`${apiCall} req.body.surname: ${req.body.surname}`);
  logger.debug(`${apiCall} req.body.slug: ${req.body.slug}`);
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
  logger.debug(`${apiCall} linksSocial ${req.body.linksSocial}`);
  /*if (req.body.linksSocial && req.body.linkSocial.length > 2) {
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
  }*/
  /*logger.debug(`${apiCall} linkSocial create ${req.body.linksSocial}`);
  if(req.body.linksSocial){
    req.body.linksSocial.map((l) => {
    let newLinkSocial = l;
      req.body.links.push(newLinkSocial);
    });
  }
  logger.debug(`${apiCall} linkWeb create ${req.body.linksWeb}`);
  if(req.body.linksWeb){
    req.body.linksWeb.map((l) => {
    let newLinkWeb = l;
      req.body.links.push(newLinkWeb);
    });
  }*/
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
  //  public address fields
  if (req.body.locality && req.body.country && req.body.locality.length > 2) {
    let localityFound = false;
    if (req.body.addresses) {
      // find the locality
      req.body.addresses.map((l) => {
        // BL notice the == instead of ===
        if (l.locality == req.body.locality) {
          // locality is found
          logger.debug(`${apiCall} localityFound found ${l.locality}`);
          l.country == req.body.country
          localityFound = true;
        }
      });
    }
    if (!localityFound) {
      logger.debug(`${apiCall} localityFound create ${req.body.locality} ${req.body.country}`);
      let newAddress = { locality: req.body.locality, country: req.body.country };
      req.body.addresses.push(newAddress);
    }
  }

  /*User.findOne({ $or: [{ slug: req.body.slug }] }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      console.log(existingUser);
      req.flash('errors', { msg: __('Slug already exists.') });
    }
  });
*/
  const props = {
    birthday: req.body.birthday,
    about: req.body.about,
    aboutlanguage: req.body.aboutlanguage,
    name: req.body.name,
    surname: req.body.surname,
    gender: req.body.gender,
    citizenship: req.body.citizenship,
    emails: req.body.emails,
    web: req.body.web,
    social:req.body.social,
    addresses: req.body.addresses,
    abouts: req.body.abouts,
    stagename:req.body.stagename,
    slug:req.body.slug
  };
  
  User.findById(req.user.id, (err, user) => {
    if (err) {
      logger.debug(`${apiCall} findById ERROR: ${JSON.stringify(err)}`);
    }
    if (user) {
      Object.assign(user, props);
      user.save(() => {
        dataproviderAdmin.fetchUser(req.user.id, (err, user) => {
          res.json(user);
        });
      });
    } else {
      logger.debug(`${apiCall} ERROR user is null`);
    }
  });
});


module.exports = router;
