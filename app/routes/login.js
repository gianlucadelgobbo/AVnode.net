import createRouter from "./router.js";
const router = createRouter();

import { passport, isAuthenticated } from '../utilities/passport.js';

import { logger, requestLogger, errorLogger } from '../utilities/logger.js';

import mongoose from 'mongoose';
const User = mongoose.model('User');


router.get('/', (req, res) => {
  var returnTo = req.session.returnTo || "/admin";
  logger.info('passport.loginredirect GET req:' + returnTo);
  if (req.user) {
    return res.redirect (returnTo);
  }
  res.render('login', {
    title: req.__('Login'),
    currentUrl: req.originalUrl
  });
});

router.post('/', (req, res, next) => {
  const returnTo = req.session.returnTo || req.body.returnTo || "/admin";

  passport.authenticate('local', (err, user, info) => {
    if (err) return req.isApi ? res.send(err) : next(err);
    if (!user) {
      if (req.isApi) return res.status(500).send(info);
      req.flash('errors', info);
      return res.redirect(info.redirect || "/login");
    }

    req.logIn(user, (err) => {
      if (err) return req.isApi ? res.status(500).send(err) : next(err);

      req.session.user = user;
      delete req.session.returnTo;

      logger.info('User logged in:', req.session.user);

      if (req.isApi) {
        return res.send({
          loggedIn: true,
          user: req.session.user,
          returnTo,
        });
      } else {
        req.flash('success', { msg: req.__('You are logged in.') });
        return res.redirect(returnTo);
      }
    });
  })(req, res, next);
});

/* router.post('/', (req, res, next) => {
  const returnTo = req.session.returnTo ? req.session.returnTo : req.query.returnTo ? req.query.returnTo : req.query.returnTo ? req.query.returnTo : "/admin";
  logger.info("req.body login");
  logger.info(req.session.returnTo);
  logger.info(req.query.returnTo);
  logger.info(returnTo);

  passport.authenticate('local', (err, user, info) => {
    logger.info("authenticate");
    logger.info(returnTo);

    if (err) {
      logger.info('passport.authenticate error:' + JSON.stringify(err));
      if (req.isApi) {
        return res.send(err);
      } else {
        return next(err);
      }
    }
    
    if (!user) {
      logger.info('passport.authenticate !user:' + JSON.stringify(info));
      if (req.isApi) {
        return res.status(500).send(info);
      } else {
        req.flash('errors', info);
        return res.redirect(info.redirect ? info.redirect : "/login");
      }
    } 
    
    req.logIn(user, (err) => {
      logger.info("logInlogInlogInlogInlogInlogIn");
      if (err) {
        logger.info('passport.authenticate req.logIn error:' + JSON.stringify(err));
        if (req.isApi) {
          return res.status(500).send(err);
        } else {
          return next(err);
        }
      }

      delete req.session.returnTo;
      logger.info('passport.authenticate auth success');

      // 🔹 Ensure the session cookie is accessible on all subdomains
      if (req.session) {
        req.session.cookie.domain = process.env.NODE_ENV === "production" ? ".avnode.net" : ".avnode.local";  // ✅ Share session across all subdomains
        req.session.cookie.path = "/";
        req.session.cookie.httpOnly = true;
        req.session.cookie.secure = process.env.NODE_ENV === "production";
        req.session.cookie.sameSite = "lax";
      }

      // 🔹 Explicitly set session cookie
      res.cookie("connect.sid", req.sessionID, {
        domain: process.env.NODE_ENV === "production" ? ".avnode.net" : ".avnode.local", // ✅ Shared session across subdomains
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      });
      req.session.user = user;

      logger.log("User stored in session:", req.session.user);

      // ✅ Retrieve and delete `returnTo` after login
      delete req.session.returnTo; // ✅ Remove `returnTo` after using it

      logger.info('passport.authenticate auth success 2');
      logger.info(returnTo);
      if (req.isApi) {
        res.send({
          "loggedIn": true,
          "user": req.session.user,
          returnTo: returnTo
        });
      } else {
        logger.info('flash');
        req.flash('success', { msg: req.__('You are logged in.') });
        res.redirect(returnTo);
      }
    });
  })(req, res, next);
}); */

// FIXME: userController.postLoginSchema
//validationConfig.validate()
/*router.post('/', (req, res, next) => {
  const returnTo = req.session.returnTo ? req.session.returnTo : req.body.returnTo ? req.body.returnTo : "/";
  logger.info("req.body login");
   logger.info(req.body);
  logger.info(req.params);
  logger.info(req.query);

  logger.info('passport.loginredirect req:' + req.body.returnTo);
  
  logger.info('passport.authenticate req:' + JSON.stringify(req.body.email)); 

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
*/
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