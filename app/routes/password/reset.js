import createRouter from "../router.js";
const router = createRouter();

import mongoose from 'mongoose';
const User = mongoose.model('User');

router.get('/:token', (req, res) => {
  res.render('password/reset', {
    title: req.__('Reset password'),
    token: req.params.token
  });
});

router.post('/', (req, res) => {
  if (req.body.token.length<5) {
    req.flash('errors', {msg: `${JSON.stringify({errors: {token: { message: req.__('Link to change the password has expired or is not valid.')}}})}`});
    res.redirect('/password/forgot/');
  } else {
    User.findOne({passwordResetToken: req.body.token}, "password passwordResetToken passwordResetExpires", (err, user) => {
      if (!user) {
        req.flash('errors', {msg: `${JSON.stringify({errors: {password: { message: req.__('Link to change the password has expired or is not valid.')}}})}`});
        res.redirect('/password/forgot/');
      } else {
        // FIXME Validate password…
        if (req.body.password !== req.body.retypePassword) {
          req.flash('errors', {msg: `${JSON.stringify({errors: {password: { message: req.__('Password and Password confirm does not match. Try again...')}}})}`});
          res.redirect('/password/reset/'+user.passwordResetToken);
        } else {
          user.passwordResetExpires = null;
          user.passwordResetToken = null;
          user.password = req.body.password;
          //res.redirect('/password/reset/'+req.body.token);
          user.save((err) => {
            if (err) {
              req.flash('errors', {msg: err});
              res.redirect('/password/reset/'+req.body.token);
            } else {
              req.flash('success', {msg: req.__('Your password has been reset.')});
              res.redirect('/login');  
            }
          });
        }
      }
    });  
  }
});

export default router;
