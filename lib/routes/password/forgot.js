const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');

const uuid = require('uuid');
const moment = require('moment');
const mailer = require('../../utilities/mailer');
const _ = require('lodash');

router.get('/', (req, res) => {
  res.render('password/forgot', {
    title: __('Request a new password')
  });
});

router.post('/', (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) {
      throw err;
    }
    if (user === null) {
      req.flash('errors', {msg: __('User not found.')});
      res.redirect('/password/forgot');
    } else {
      const token = uuid.v4();
      const expiresInHours = _.parseInt(process.env.PASSWORD_RESET_EXPIRES);
      user.passwordResetToken = token;
      user.passwordResetExpires = moment().add(expiresInHours, 'hours').toDate();

      user.save((err) => {
        if (err) {
          throw err;
        }
        const mailOptions = {
          token: token,
          email: user.email,
          expires: expiresInHours
        };
        mailer.resetPassword({ to: user.email }, mailOptions, (err) => {
          if (err) {
            throw err;
          }
          req.flash('success', {msg: __('Password reset link sent '+req.body.email+'.')});
          res.redirect('/password/forgot');
        });
      });
    }
  });
});

module.exports = router;
