const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');

const uuid = require('uuid');
const moment = require('moment');
const mailer = require('../../utilities/mailer');
const _ = require('lodash');

router.get('/', (req, res) => {
  res.render('password/forgot', {
    title: __('Reset password')
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
          req.flash('errors', {msg: __('Password not generated, please retry.')});
          res.redirect('/password/forgot');
        } else {
          mailer.resetPassword({
            template: 'reset-password',
            message: {
              to: user.email
            },
            locals: {
              site: 'http://'+req.headers.host,
              link: 'http://'+req.headers.host+'/password/reset/',
              stagename: user.stagename,
              email: user.email,
              confirm: token
            }
          }, function (err){
            if (err) {
              req.flash('errors', {msg: __('User not found.')});
              res.redirect('/password/forgot');
            } else {
              req.flash('success', {msg: __('Password reset link sent to:')+" "+req.body.email });
              res.redirect('/password/forgot');
            }
          });
        }
      });
    }
  });
});

module.exports = router;
