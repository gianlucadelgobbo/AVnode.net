const router = require('./router')();
const passport = require('../utilities/passport');

const logger = require('../utilities/logger');
const mongoose = require('mongoose');
const User = mongoose.model('User');


router.get('/', (req, res) => {
  var returnTo = req.query.returnTo ? req.query.returnTo : req.session.returnTo ? req.session.returnTo : "/";
  logger.debug('passport.loginredirect req:' + returnTo);
  if (req.user) {
    return res.redirect (returnTo);
  }
  res.render('login', {
    title: __('Login'),
    returnTo: returnTo
  });
});

// FIXME: userController.postLoginSchema
//validationConfig.validate()
router.post('/', (req, res, next) => {
  const returnTo = req.session.returnTo ? req.session.returnTo : req.body.returnTo ? req.body.returnTo : "/";

  logger.debug('passport.loginredirect req:' + req.body.returnTo);
  
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
      return res.redirect(returnTo);
    }
    req.logIn(user, (err) => {
      if (err) {
        logger.debug('passport.authenticate req.logIn error:' + JSON.stringify(err));
        return next(err);
      }
      delete req.session.returnTo;
      logger.info('passport.authenticate auth success');
      logger.info(returnTo);
      req.flash('success', { msg: __('You are logged in.') });
      res.redirect(returnTo);
    });
  })(req, res, next);
});

module.exports = router;

/*
const Joi = require('joi');
const postLoginSchema = {
  body: {
    _csrf: Joi.string().required().error(new Error(__('Sorry, malformed request.'))),
    email: Joi.string().email().required().error(new Error(__('E-mail is not correct.'))),
    password: Joi.string().required().error(new Error(__('Password is required!')))
  }
};
*/