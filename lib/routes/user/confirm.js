const router = require('../router')();
const i18n = require('../../plugins/i18n');
const mongoose = require('mongoose');
const User = mongoose.model('User');

// confirm signup
router.get('/:uuid', (req, res) => {
  User.findOne({'confirm': req.params.uuid}, (err, user) => {
    if (err || user === null) {
      res.status(400).send('Error');
    } else {
      user.is_confirmed = true;
      user.confirm = '';
      user.emails.push({
        email: user.email,
        is_primary: true,
        is_confirmed: true
      });
      user.save(function() {
        req.session.returnTo = '/';
        req.flash('success', { msg: i18n.__('Your account is confirmed, you can now log in.') });
        res.redirect('/login');
      });
    }
  });
});
// confirm email for existing user
router.get('/email/:uuid', (req, res, next) => {
  const uuid = req.params.uuid;
  User.findOne({'emails.confirm': uuid}, function(err, user) {
    if (err || user === null) {
      return res.sendStatus(400);
    }
    user.emails.forEach(function(email) {
      if (email.confirm === uuid) {
        email.confirm = '';
        email.is_confirmed = true;
      }
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: __('Email confirmed') });
      res.redirect('/');
    });
  });
});

module.exports = router;
