const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/:token', (req, res) => {
  res.render('password/reset', {
    title: __('Reset password'),
    token: req.params.token
  });
});

router.post('/', (req, res) => {
  if (req.body.token.length<5) {
    req.flash('errors', {msg: __('Link to change the password has expired or is not valid.')});
    res.redirect('/password/forgot/');
  } else {
    User.findOne({passwordResetToken: req.body.token}, "password passwordResetToken passwordResetExpires", (err, user) => {
      console.log("user");
      console.log(user);
      if (!user) {
        req.flash('errors', {msg: __('Link to change the password has expired or is not valid.')});
        res.redirect('/password/forgot/');
      } else {
        // FIXME Validate password…
        if (req.body.password !== req.body.retypePassword) {
          req.flash('errors', {msg: __('Password and Password confirm does not match. Try again...')});
          res.redirect('/password/reset/'+user.passwordResetToken);
        } else {
          user.passwordResetExpires = null;
          user.passwordResetToken = null;
          user.password = req.body.password;
          console.log(req.body);
          console.log("user ch");
          console.log(user);
          //res.redirect('/password/reset/'+req.body.token);
          user.save((err) => {
            if (err) {
              console.log(err);
              req.flash('errors', {msg: err});
              res.redirect('/password/reset/'+req.body.token);
            } else {
              req.flash('success', {msg: __('Your password has been reset.')});
              res.redirect('/login');  
            }
          });
        }
      }
    });  
  }
});

module.exports = router;
