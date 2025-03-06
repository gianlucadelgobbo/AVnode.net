import createRouter from "../router.js";
const router = createRouter();

import mongoose from 'mongoose';
const User = mongoose.model('User');

router.get('/:email?/:token?', (req, res) => {
  User.findOne({email: req.params.email, passwordResetToken: req.params.token}, (err, user) => {
    if (err) {
      throw err;
    }
    if (user === null) {
      req.flash('errors', {msg: `${JSON.stringify({errors: {token: { message: req.__('User not found.')}}})}`});
      req.flash('errors', {msg: req.__('User not found.')});
      res.redirect('/login');
    }

    const now = req.moment().unix();
    const expired = req.moment(user.passwordResetExpires).unix();

    if (now > expired) {
      req.flash('errors', {msg: `${JSON.stringify({errors: {token: { message: req.__('This link is expired. Request a new one...')}}})}`});
      res.redirect('/password/forgot');
    } else {
      res.render('password/reset', {
        title: req.__('Reset your password'),
        userId: user._id
      });
    }
  });
});

export default router;
