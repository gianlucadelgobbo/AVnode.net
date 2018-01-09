const router = require('./router')();
const passport = require('../plugins/passport');
const i18n = require('../plugins/i18n');
const logger = require('../utilities/logger');
const mongoose = require('mongoose');
const User = mongoose.model('User');


router.get('/', (req, res) => {
  logger.debug('passport.loginredirect req:' + req.query.next);
  var redirect = req.query.next ? req.query.next : "/";
  if (req.user) {
    return res.redirect(redirect);
  }
  res.render('login', {
    title: i18n.__('Login'), redirect: redirect
  });
});

// FIXME: userController.postLoginSchema
//validationConfig.validate()
router.post('/', (req, res, next) => {
  logger.debug('passport.loginredirect req:' + req.body.next);
  var redirect = req.body.next ? req.body.next : "/";
  
  logger.debug('passport.authenticate req:' + JSON.stringify(req.body.email));

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      logger.debug('passport.authenticate error:' + JSON.stringify(err));
      return next(err);
    }
    if (!user) {
      logger.debug('passport.authenticate !user:' + JSON.stringify(info));
      logger.debug('trying on flxer with email:' + JSON.stringify(req.body.email));

      req.flash('errors', info);
      return res.redirect(redirect);
    }
    req.logIn(user, (err) => {
      if (err) {
        logger.debug('passport.authenticate req.logIn error:' + JSON.stringify(err));
        return next(err);
      }
      logger.info('passport.authenticate auth success');
      req.flash('success', { msg: i18n.__('You are logged in.') });
      res.redirect(redirect);
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
