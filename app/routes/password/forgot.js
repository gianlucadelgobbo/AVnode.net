import createRouter from "../router.js";
const router = createRouter();

import mongoose from 'mongoose';
const User = mongoose.model('User');

import { v4 as uuidv4 } from 'uuid';

const setIdentifier = () => {
  return uuidv4();
};
import moment from 'moment';
import { mySendMailer } from '../../utilities/mailer.js';
import _ from 'lodash';

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
      req.flash('errors', {msg: {errors: {email: { message: __('User not found.')}}}});
      res.redirect('/password/forgot');
    } else {
      const token = setIdentifier();
      const expiresInHours = _.parseInt(process.env.PASSWORD_RESET_EXPIRES);
      user.passwordResetToken = token;
      user.passwordResetExpires = moment().add(expiresInHours, 'hours').toDate();

      user.save((err) => {
        if (err) {
          req.flash('errors', {msg: `${JSON.stringify({errors: {email: { message: __('Password not generated, please retry.')}}})}`});
          res.redirect('/password/forgot');
        } else {
          mySendMailer({
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
              req.flash('errors', {msg: `${JSON.stringify({errors: {email: { message: __('Unable to send Confirm Email.')}}})}`});
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

export default router;
