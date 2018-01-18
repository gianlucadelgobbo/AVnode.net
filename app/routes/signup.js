const router = require('./router')();
const uuid = require('uuid');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const mailer = require('../utilities/mailer');
const _slug = require('../utilities/slug');

router.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/admin');
  }
  res.render('signup', {
    title: __('Create Account')
  });
});

router.post('/', (req, res, next) => {
  if (req.body.email && req.body.username && req.body.stagename && req.body.name && req.body.surname && req.body.password) {
    
    const slug = _slug.parse(req.body.username);
    
    User.findOne({ $or: [{ email: req.body.email }, { slug: slug }] }, (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash('errors', { msg: __('Account already exists.') });
        return res.redirect('/signup');
      }

      const user = new User({
        slug: slug,
        username: slug,
        stagename: req.body.stagename,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        confirm: uuid.v4()
      });

      user.save((err) => {
        if (err) {
          console.log('user.save error:' + err);
          return next(err);
        }
        mailer.signup({ to: user.email }, { uuid: user.confirm }, (err) => {
          if (err) {
            return next(err);
          }
          req.flash('success', { msg: __('Please check your inbox and confirm your Email') });
          res.redirect('/');
        });
      });
    });
  } else {
    return next('All fields are required.');
  }  
});

module.exports = router;
