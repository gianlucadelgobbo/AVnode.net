const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const User = mongoose.model('User');
const logger = require('../utilities/logger');

// for flxer auth
let request = require('request');
let querystring = require('querystring');
const flxer = {};
const mailer = require('../utilities/mailer');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  logger.debug('passport.use:' + email);

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      logger.debug('passport.use User.findOne error:' + email + ' ' +  JSON.stringify(err));
      return done(err);
    }
    if (!user) {
      logger.debug('passport.use User.findOne Email not found user not found:' + email);
      return done(null, false, { msg: __('Email %s not found.', email) });
    }
    logger.debug('password:' + password);
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        logger.debug('passport.use User.comparePassword error:' + JSON.stringify(err));
        //return done(err);
      }
      if (isMatch) {
        logger.debug('passport.use User.comparePassword match');
        return done(null, user);
      } else {
        logger.debug('passport.use User.comparePassword NO match, try flxer');
        flxer.flxerLogin(user, email, password, (isFlxerMatch) => {
          if (isFlxerMatch) {
            logger.debug('flxerLogin match');
            return done(null, user);
          } else {
            logger.debug('passport.use User.comparePassword and flxer Invalid email or password');
            return done(null, false, { msg: __('Invalid email or password.') });
          }
        });
      }
    });
  });
}));

flxer.flxerLogin = (existingUser, email, password, done) => {
  // try with flxer api
  request.post({
    uri: 'https://flxer.net/api/login',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify({ email: email, password: password })
  }, function (err, res, body) {
    if (err) {
      return next(err);
      logger.debug('flxer.authenticate error:' + JSON.stringify(err));
    }
    logger.debug('passport.authenticate flxer:' + JSON.stringify(body));
    let ress = JSON.parse(body);
    if (ress.login) {
      logger.debug('flxer.authenticate successful');

      if (isNaN(existingUser.activity) ) existingUser.activity = 0;
      existingUser.password = password;
      existingUser.save((err) => {
        if (err) {
          logger.debug('existingUser.save error:' + err);
        }
        mailer.sendMsgEmail({ to: existingUser.email }, { msg: 'Password migrated from flxer, please login again.' }, (err) => {
          if (err) {
            logger.debug('mailer.sendMsgEmail error:' + err);
          } else {
            logger.debug('mailer.sendMsgEmail success:' + err);
          }
          
        });
        done(true);
      });

    } else {
      done(false);
      logger.debug('flxer.authenticate failed');
    }
  });
};

module.exports = passport;

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
