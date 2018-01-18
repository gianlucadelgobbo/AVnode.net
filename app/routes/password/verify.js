const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const moment = require('moment');

router.get('/:email?/:token?', (req, res) => {
  User.findOne({email: req.params.email, passwordResetToken: req.params.token}, (err, user) => {
    if (err) {
      throw err;
    }
    if (user === null) {
      req.flash('errors', {msg: __('User not found.')});
      res.redirect('/login');
    }

    const now = moment().unix();
    const expired = moment(user.passwordResetExpires).unix();

    if (now > expired) {
      req.flash('errors', {msg: __('This link is expired. Request a new one…')});
      res.redirect('/password/forgot');
    } else {
      res.render('password/reset', {
        title: __('Reset your password'),
        userId: user._id
      });
    }
  });
});

module.exports = router;
