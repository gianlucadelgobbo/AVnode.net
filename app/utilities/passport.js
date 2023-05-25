const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const User = mongoose.model('User');
const logger = require('../utilities/logger');

// for flxer auth
let axios = require('axios');
let querystring = require('querystring');
const flxer = {};
const mailer = require('../utilities/mailer');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findOne({_id:id}).
  select('name surname stagename slug is_pro is_admin stats image crews email mobile addresses likes').
  populate([{path:"crews", select: "stagename"}]).
  exec((err, user) => {
    done(err, user);
  });
});
passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
  logger.debug('passport.use:' + email);

  User.findOne({ $or: [{ "email": { $regex : new RegExp(email, "i") } }, { "slug": { $regex : new RegExp(email, "i") }}, { "emails.email": { $regex : new RegExp(email, "i") } }] }, 'stagename slug password email', (err, user) => {
    logger.debug(user);
    if (err) {
      logger.debug('passport.use User.findOne error:' + email + ' ' +  JSON.stringify(err));
      return done(err);
    }
    if (!user) {
      logger.debug('passport.use User.findOne Email not found user not found:' + email);
      if (email.indexOf("@")!==-1) {
        return done(null, false, { msg: __('Invalid email or password.'), redirect: "/login" });
      } else {
        //return done(null, false, { msg: __('Username %s not found.', email), redirect: "/flxerlogin" });
        return done(null, false, { msg: __('Invalid email or password.'), redirect: "/login" });
      }
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
        return done(null, false, {msg: __('Invalid email or password.')});
        //res.json({error: false, msg: __("Confirmation Email sending success, please check your inbox and confirm")});
        /* logger.debug('passport.use User.comparePassword NO match, try flxer');
        flxer.flxerLogin(req, user, user.email, password, (isFlxerMatch) => {
          if (isFlxerMatch===true) {
            logger.debug('flxerLogin match');
            return done(null, user);
          } else {
            logger.debug('passport.use User.comparePassword and flxer Invalid email or password');
            var msg = isFlxerMatch.errno == "ENETUNREACH" ?  __('Old FLxER website is temporarily unavailable. Please try later.') :  __('Invalid email or password.')
            return done(null, false, { msg: {errors:{password: {message: msg}}}});
          }
        }); */
      }
    });
  });
}));

flxer.flxerLogin = (req, existingUser, email, password, done) => {
  // try with flxer api
  // headers: { 'content-type': 'application/x-www-form-urlencoded' },
  // body: querystring.stringify({ email: email, password: password })
  axios.post('https://old.flxer.net/api/login', querystring.stringify({ email: email, password: password }))
  .then((response) => {
    var ress = response.data;

    logger.debug('passport.authenticate flxer:' + JSON.stringify(ress));
    //let ress = JSON.parse(body);
    if (ress.login) {
      logger.debug('flxer.authenticate successful');

      //if (isNaN(existingUser.activity) ) existingUser.activity = 0;
      existingUser.password = password;
      existingUser.flxermigrate = true;
      logger.debug('existingUser.save existingUser:' + password);
      logger.debug('existingUser.save existingUser.password:' + existingUser.password);
      existingUser.save((err) => {
        if (err) {
          logger.debug('existingUser.save error:');
          logger.debug(err);
        } else {
          logger.debug('existingUser.save success');
          mailer.mySendMailer({
            template: 'confirm-email',
            message: {
              to: email
            },
            email_content: {
              site:    (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/+"://"+req.headers.host,
              title:    __("Password from FLxER success!!!"),
              subject:  __("Password from FLxER success!!!")+' | AVnode.net',
              block_1:  __("Password migrated from FLxER.net, please login again."),
              button:   __("Click here to login"),
              link:     (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/+"://"+req.headers.host+'/login/',
              html_sign: "The AVnode.net Team",
              text_sign:  "The AVnode.net Team"
        }
          }, function (err){
            if (err) {
              logger.debug('mailer.mySendMailer error:' + err);
            } else {
              logger.debug('mailer.mySendMailer success:' + err);
            }
          });
        }
        done(true);
      });


    } else {
      done(false);
      logger.debug('flxer.authenticate failed');
    }
  }, (err) => {
    logger.debug('flxer.authenticate error:' + JSON.stringify(err));
    return done(err);
  });
}

module.exports = passport;

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
