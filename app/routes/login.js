import createRouter from "./router.js";
const router = createRouter();

import { passport, isAuthenticated } from '../utilities/passport.js';

import { logger, requestLogger, errorLogger } from '../utilities/logger.js';

import mongoose from 'mongoose';
const User = mongoose.model('User');


router.get('/', (req, res) => {
  var returnTo = req.query.returnTo ? req.query.returnTo : req.session.returnTo ? req.session.returnTo : "/";
  logger.info('passport.loginredirect GET req:' + returnTo);
  if (req.user) {
    return res.redirect (returnTo);
  }
  res.render('login', {
    title: req.__('Login'),
    returnTo: returnTo.replace("/admin/api/loggeduser" , "/")
  });
});

// FIXME: userController.postLoginSchema
//validationConfig.validate()
router.post('/', (req, res, next) => {
  const returnTo = req.session.returnTo ? req.session.returnTo : req.body.returnTo ? req.body.returnTo : "/";
  logger.info("req.body login");
  /* logger.info(req.body);
  logger.info(req.params);
  logger.info(req.query);

  logger.info('passport.loginredirect req:' + req.body.returnTo);
  
  logger.info('passport.authenticate req:' + JSON.stringify(req.body.email)); */

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      logger.info('passport.authenticate error:' + JSON.stringify(err));
      if (req.body.api=="1") {
        res.send(err);
      } else {
        return next(err);
      }
    }
    if (!user) {
      logger.info('passport.authenticate !user:' + JSON.stringify(info));
      if (req.body.api=="1") {
        res.status(500).send(info);
      } else {
        req.flash('errors', info);
        return res.redirect(info.redirect ? info.redirect : "/login");
      }
    } else {
      req.logIn(user, (err) => {
        if (err) {
          logger.info('passport.authenticate req.logIn error:' + JSON.stringify(err));
          if (req.body.api=="1") {
            res.status(500).send(err);
          } else {
            return next(err);
          }
        }
        delete req.session.returnTo;
        logger.info('passport.authenticate auth success');
        logger.info(returnTo);
        if (req.body.api=="1") {
          res.send(true);
        } else {
          req.flash('success', { msg: req.__('You are logged in.') });
          res.redirect(returnTo);
        }
      });
    }
  })(req, res, next);
});

export default router;

/*
const Joi = require('joi');
const postLoginSchema = {
  body: {
    _csrf: Joi.string().required().error(new Error(req.__('Sorry, malformed request.'))),
    email: Joi.string().email().required().error(new Error(req.__('E-mail is not correct.'))),
    password: Joi.string().required().error(new Error(req.__('PASSWORD_IS_REQUIRED!')))
  }
};
*/