const router = require('./router')();
const passport = require('../plugins/passport');
const i18n = require('../plugins/i18n');
const logger = require('../utilities/logger');
const mailer = require('../utilities/mailer');
const mongoose = require('mongoose');
const User = mongoose.model('User');
// for flxer auth
const request = require('request');
const querystring = require('querystring');

router.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('login', {
    title: i18n.__('Login')
  });
});

// FIXME: userController.postLoginSchema
//validationConfig.validate()
router.post('/', (req, res, next) => {
  logger.error('passport.authenticate req:' + JSON.stringify(req.body.email));
  logger.error.log = console.log.bind(console);

  logger.debug('passport.authenticate req:' + JSON.stringify(req.body.email));

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      logger.error('passport.authenticate error:' + JSON.stringify(err));
      return next(err);
    }
    if (!user) {
      logger.debug('passport.authenticate !user:' + JSON.stringify(info));
      logger.debug('trying on flxer with email:' + JSON.stringify(req.body.email));
      req.flash('errors', 'trying on flxer with email:' + JSON.stringify(req.body.email));
      // try with flxer api
      request.post({
        uri: 'https://flxer.net/api/login',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: querystring.stringify({ email: req.body.email, password: req.body.password })
      }, function (fErr, res, body) {
        if (fErr) {
          logger.error('flxer.authenticate error:' + JSON.stringify(fErr));
          req.flash('errors', 'flxer.authenticate error:' + JSON.stringify(fErr));
        }
        logger.debug('passport.authenticate flxer:' + JSON.stringify(body));
        let ress = JSON.parse(body);
        if (ress.login) {
          logger.debug('flxer.authenticate successful');
          req.flash('errors', 'flxer.authenticate successful');
          User.findOne({ email: req.body.email }, (uErr, existingUser) => {
            if (uErr) {
              logger.error('User.findOne error:' + uErr);
              req.flash('errors', 'User.findOne error:' + uErr);
            }
            if (existingUser) {
              logger.debug('user with this email found in db existingUser.activity:');
              req.flash('errors', 'user with this email found in db existingUser.activity');
              if (isNaN(existingUser.activity) ) existingUser.activity = 0;
              existingUser.password = req.body.password;
              existingUser.save((sErr) => {
                if (sErr) {
                  logger.error('existingUser.save error:' + sErr);
                  req.flash('errors', 'existingUser.save error:' + sErr);
                }
                // BL CHECK  successful login on flxer, now login in avnode              
                req.logIn(existingUser, (loginErr) => {
                  if (loginErr) {
                    logger.error('passport flxer.logIn error:' + JSON.stringify(loginErr));
                    return next(loginErr);
                  }
                  logger.info('passport flxer auth success');
                  req.flash('success', { msg: i18n.__('You are logged in, flxer account migrated.') });
                  res.redirect('/');
                });
                // BL CHECK end
                mailer.sendMsgEmail({ to: existingUser.email }, { msg: 'Password migrated from flxer, please login again.' }, (mErr) => {
                  if (mErr) {
                    logger.error('mailer.sendMsgEmail error:' + mErr);
                    req.flash('errors', 'mailer.sendMsgEmail error:' + mErr);
                  }
                  req.flash('success', { msg: i18n.__('Please check your inbox for information.') });
                });
              });
            } else {
              logger.error('user with this email not found in db');
              req.flash('errors', 'user with this email not found in db');
            }
          });

        } else {
          logger.error('flxer.authenticate failed');
          req.flash('errors', 'flxer.authenticate failed');
        }
      });

      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (lErr) => {
      if (lErr) {
        logger.error('passport.authenticate req.logIn error:' + JSON.stringify(lErr));
        return next(lErr);
      }
      logger.info('passport.authenticate auth success');
      req.flash('success', { msg: i18n.__('You are logged in.') });
      res.redirect('/');
    });
  })(req, res, next);
});

module.exports = router;

/*
const Joi = require('joi');
const postLoginSchema = {
  body: {
    _csrf: Joi.string().required().error(new Error(i18n.__('Sorry, malformed request.'))),
    email: Joi.string().email().required().error(new Error(i18n.__('E-mail is not correct.'))),
    password: Joi.string().required().error(new Error(i18n.__('Password is required!')))
  }
};
*/
