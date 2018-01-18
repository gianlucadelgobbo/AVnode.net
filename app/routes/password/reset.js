const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.post('/', (req, res) => {
  User.findById(req.body.user, (err, user) => {
    if (err) {
      throw err;
    }
    if (user) {
      // FIXME Validate password…
      if (req.body.password !== req.body.retypePassword) {
        req.flash('errors', {msg: __('Passwords are not equal. Try again…')});
        res.redirect('/password/verify/'+ user.email +'/'+user.passwordResetToken);
      } else {
        user.passwordResetExpires = null;
        user.passwordResetToken = null;
        user.password = req.body.password;
        user.save((err) => {
          if (err) {
            throw err;
          }
          req.flash('success', {msg: __('Your password has been reset.')});
          res.redirect('/login');
        });
      }
    } else {
      req.flash('errors', {msg: __('Oops, something went wrong here.')});
      res.redirect('/password/forgot');
    }
  });
});

module.exports = router;
