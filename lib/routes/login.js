const router = require('./router')();
//const passport = require('../plugins/passport');
const i18n = require('../plugins/i18n');
const logger = require('../utilities/logger');
//const mailer = require('../utilities/mailer');
// const mongoose = require('mongoose');
//const User = mongoose.model('User');
// for flxer auth
//const request = require('request');
//const querystring = require('querystring');
const isomorphicFetch = require('isomorphic-fetch');

const tag = 'avnode-token';

const saveToken = (token)=> {
  console.log('saveToken:' + token);
  // window.localStorage.setItem(tag, token);
}

router.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('login', {
    title: i18n.__('Login')
  });
});

const fetch = (path, options = {}, json = true) => {
  console.log('fetch, path:' + path);
  const opts = Object.assign({}, {
    credentials: 'same-origin'
  }, options);
  if (json === true) {
    opts.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }
  return isomorphicFetch(`${process.env.API}${path}`, opts)
    .then(response => response.json());  
};
// FIXME: userController.postLoginSchema
//validationConfig.validate()
router.post('/', (req, res, next) => {
  logger.debug('authenticate req:' + JSON.stringify(req.body.email));
  return fetch(
    'user', {
      method: 'POST',
      body: JSON.stringify(req.body)
    })
    .then((data) => {
      console.log('post, response:' + JSON.stringify(data) );   
      saveToken(data.jwt);
      req.flash('success', { msg: i18n.__('You are logged in.') });
      res.redirect('/');
    });
  /*passport.authenticate('local', (err, user, info) => {
    if (err) {
      logger.debug('passport.authenticate error:' + JSON.stringify(err));
      return next(err);
    }
    if (!user) {
      logger.debug('passport.authenticate !user:' + JSON.stringify(info));
      logger.debug('trying on flxer with email:' + JSON.stringify(req.body.email));

      // try with flxer api
      request.post({
        uri: 'https://flxer.net/api/login',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: querystring.stringify({ email: req.body.email, password: req.body.password })
      }, function (err, res, body) {
        if (err) {
          logger.debug('flxer.authenticate error:' + JSON.stringify(err));
        }
        logger.debug('passport.authenticate flxer:' + JSON.stringify(body));
        let ress = JSON.parse(body);
        if (ress.login) {
          logger.debug('flxer.authenticate successful');

          User.findOne({ email: req.body.email }, (err, existingUser) => {
            if (err) {
              logger.debug('User.findOne error:' + err);
            }
            if (existingUser) {
              logger.debug('user with this email found in db existingUser.activity:');
              if (isNaN(existingUser.activity) ) existingUser.activity = 0;
              existingUser.password = req.body.password;
              existingUser.save((err) => {
                if (err) {
                  logger.debug('existingUser.save error:' + err);
                }
                mailer.sendMsgEmail({ to: existingUser.email }, { msg: 'Password migrated from flxer, please login again.' }, (err) => {
                  if (err) {
                    logger.debug('mailer.sendMsgEmail error:' + err);
                  }
                  req.flash('success', { msg: i18n.__('Please check your inbox for information.') });
                });
              });
            } else {
              logger.debug('user with this email not found in db');
            }
          });

        } else {
          logger.debug('flxer.authenticate failed');
        }
      });

      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        logger.debug('passport.authenticate req.logIn error:' + JSON.stringify(err));
        return next(err);
      }
      logger.info('passport.authenticate auth success');
      req.flash('success', { msg: i18n.__('You are logged in.') });
      res.redirect('/');
    });
  })(req, res, next);*/
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
