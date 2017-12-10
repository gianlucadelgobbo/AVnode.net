const router = require('./router')();
const uuid = require('uuid');
const i18n = require('../plugins/i18n');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const mailer = require('../utilities/mailer');
const _slug = require('../utilities/slug');
const isomorphicFetch = require('isomorphic-fetch');

router.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/account');
  }
  res.render('signup', {
    title: i18n.__('Create Account')
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
router.post('/', (req, res, next) => {
  if (req.body.email && req.body.username && req.body.name && req.body.surname && req.body.password) {
    console.log('signup post' + JSON.stringify(req.body) );
    return fetch(
      'user', {
        method: 'POST',
        body: JSON.stringify(req.body)
      })
      .then(
        req.flash('success', { msg: i18n.__('Please check your inbox and confirm your Email') }),
        res.redirect('/login'));
      //.then(json => dispatch(gotUser(json)));
      
    /*   const slug = _slug.parse(req.body.username);

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
      username: req.body.username,
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
        req.flash('success', { msg: i18n.__('Please check your inbox and confirm your Email') });
        res.redirect('/');
      });
    });
  }); */
  } else {
    return next('All fields are required.');
  }  
});

module.exports = router;
