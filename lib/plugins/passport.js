const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const User = mongoose.model('User');
const logger = require('../utilities/logger');

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
    if (!user.password) {
      logger.debug('passport.use user.password not found, probably migration from flxer');     
      return done(null, false, { msg: __('Email %s, password not found. Migration from flxer done, please Login again.', email) });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        logger.debug('passport.use User.comparePassword error:' + JSON.stringify(err));
        return done(err); 
      }
      if (isMatch) {
        logger.debug('passport.use User.comparePassword match');        
        return done(null, user);
      }
      logger.debug('passport.use User.comparePassword Invalid email or password');
      return done(null, false, { msg: __('Invalid email or password.') });
    });
  });
}));

module.exports = passport;

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
