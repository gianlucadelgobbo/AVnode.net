const router = require('./router')();
const passport = require('../plugins/passport');
const i18n = require('../plugins/i18n');

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
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
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
