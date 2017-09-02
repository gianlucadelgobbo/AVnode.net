const router = require('./router')();
const uuid = require('uuid');
const i18n = require('../plugins/i18n');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const mailer = require('../utilities/mailer');
const _slug = require('../utilities/slug');

router.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/account');
  }
  res.render('signup', {
    title: i18n.__('Create Account')
  });
});

router.post('/', (req, res, next) => {
  const slug = _slug.parse(req.body.stagename);

  User.findOne({ $or: [{ email: req.body.email }, { slug: slug }] }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      req.flash('errors', { msg: i18n.__('Account already exists.') });
      return res.redirect('/signup');
    }

    const user = new User({
      slug: slug,
      stagename: req.body.stagename,
      email: req.body.email,
      password: req.body.password,
      confirm: uuid.v4()
    });

    user.save((err) => {
      if (err) {
        return next(err);
      }
      mailer.signup({ to: user.email }, { uuid: user.confirm }, (err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: i18n.__('Please check your inbox and confirm your Email') });
        res.redirect('/');
      });
    });
  });
});

module.exports = router;
