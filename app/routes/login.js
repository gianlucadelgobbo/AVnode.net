import createRouter from "./router.js";
const router = createRouter();
import { passport, isAuthenticated } from '../utilities/passport.js';

import { info, debugLog, error } from '../utilities/logger.js';

import mongoose from 'mongoose';
const User = mongoose.model('User');


router.get('/', (req, res) => {
  var returnTo = req.query.returnTo ? req.query.returnTo : req.session.returnTo ? req.session.returnTo : "/";
  debugLog('passport.loginredirect GET req:' + returnTo);
  if (req.user) {
    return res.redirect (returnTo);
  }
  const template = req.originalUrl === '/flxerlogin' ? 'login_flxer' : 'login';
  const title = req.originalUrl === '/flxerlogin' ? __('FLxER Login') : __('Login');
  res.render(template, {
    title: title,
    returnTo: returnTo.replace("/admin/api/loggeduser" , "/")
  });
});

// FIXME: userController.postLoginSchema
//validationConfig.validate()
router.post('/', (req, res, next) => {
  const returnTo = req.session.returnTo ? req.session.returnTo : req.body.returnTo ? req.body.returnTo : "/";
  debugLog("req.body login");
  /* debugLog(req.body);
  debugLog(req.params);
  debugLog(req.query);

  debugLog('passport.loginredirect req:' + req.body.returnTo);
  
  debugLog('passport.authenticate req:' + JSON.stringify(req.body.email)); */

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      debugLog('passport.authenticate error:' + JSON.stringify(err));
      if (req.body.api=="1") {
        res.send(err);
      } else {
        return next(err);
      }
    }
    if (!user) {
      debugLog('passport.authenticate !user:' + JSON.stringify(info));
      if (req.body.api=="1") {
        res.status(500).send(info);
      } else {
        req.flash('errors', info);
        return res.redirect(info.redirect ? info.redirect : "/login");
      }
    } else {
      req.logIn(user, (err) => {
        if (err) {
          debugLog('passport.authenticate req.logIn error:' + JSON.stringify(err));
          if (req.body.api=="1") {
            res.status(500).send(err);
          } else {
            return next(err);
          }
        }
        delete req.session.returnTo;
        debugLog('passport.authenticate auth success');
        debugLog(returnTo);
        if (req.body.api=="1") {
          res.send(true);
        } else {
          req.flash('success', { msg: __('You are logged in.') });
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
    _csrf: Joi.string().required().error(new Error(__('Sorry, malformed request.'))),
    email: Joi.string().email().required().error(new Error(__('E-mail is not correct.'))),
    password: Joi.string().required().error(new Error(__('PASSWORD_IS_REQUIRED!')))
  }
};
*/