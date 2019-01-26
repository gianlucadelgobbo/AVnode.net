const router = require('../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');

const uuid = require('uuid');
const moment = require('moment');
const mailer = require('../../utilities/mailer');
const _ = require('lodash');

router.get('/', (req, res) => {
  res.render('password/forgot', {
    title: __('Reset password'),
    email: req.query.email
  });
});

router.post('/', (req, res) => {
  User.findOne({email: req.body.email}, "_id stagename email", (err, user) => {
    if (err) {
      throw err;
    }
    if (user === null) {
      req.flash('errors', {msg: __('User not found.')});
      res.redirect('/password/forgot');
    } else {
      const token = uuid.v4();
      console.log();
      const expiresInHours = _.parseInt(process.env.PASSWORD_RESET_EXPIRES);
      user.passwordResetToken = token;
      user.passwordResetExpires = moment().add(expiresInHours, 'hours').toDate();

      user.save((err) => {
        if (err) {
          console.log(err);
          req.flash('errors', {msg: __('Password not generated, please retry.')});
          res.redirect('/password/forgot');
        } else {
          mailer.mySendMailer({
            template: 'reset-password',
            message: {
              to: user.email
            },
            email_content: {
              stagename: user.stagename,
              email: user.email,
              confirm: token,
              site:    'http://'+req.headers.host,
              title:    __("Password reset"),
              subject:  __("Password reset")+' | AVnode.net',
              block_1:  __("We’ve received a request to reset your password."),
              button:   __("Click here to reset your password"),
              block_2:  __("If you didn’t make the request, just ignore this message. Otherwise, you can reset your password using this link:"),
              block_3:  __("Thanks."),
              link:     'http://'+req.headers.host+'/password/reset/'+token,
              html_sign: "The AVnode.net Team",
              text_sign:  "The AVnode.net Team"
        }
          }, function (err){
            if (err) {
              req.flash('errors', {msg: __('Unable to send Confirm Email.')});
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
