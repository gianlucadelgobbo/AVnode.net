import createRouter from "../router.js";
const router = createRouter();

import mongoose from 'mongoose';
const User = mongoose.model('User');

import { v4 as uuidv4 } from 'uuid';

const setIdentifier = () => {
  return uuidv4();
};

import { mySendMailer } from '../../utilities/mailer.js';
import { logger, requestLogger, errorLogger } from '../../utilities/logger.js'; // Logger

import _ from 'lodash';

router.get('/', (req, res) => {
  res.render('password/forgot', {
    title: req.__('Reset password'),
    email: req.query.email
  });
});

router.post('/', async (req, res) => {
  logger.info("req.body.email");
  logger.info(req.body.email);

  let user;
  
  const email = req.body?.email;

  if (!email || typeof email !== 'string' || email.trim() === '') {
    if (req.isApi) {
      return res.send({error: true, msg: {errors: {email: { message: req.__('User not found.')}}}})
    } else {
      req.flash('errors', {msg: {errors: {email: { message: req.__('User not found.')}}}});
      return res.redirect('/password/forgot');  
    }
  }
  try {
    user = await User.findOne({email: email}, "_id stagename email");
    logger.info("{email: email}")
    logger.info({email: email})
  } catch (error) {
    if (req.isApi) {
      return res.send({error: error, msg: {errors: {email: { message: req.__('User not found.')}}}})
    } else {
      req.flash('errors', {msg: {errors: {email: { message: req.__('User not found.')}}}});
      return res.redirect('/password/forgot');  
    }
  }
  logger.info("user")
  logger.info(user)
  if (user === null) {
    if (req.isApi) {
      return res.send({error: true, msg: {errors: {email: { message: req.__('User not found.')}}}})
    } else {
      req.flash('errors', {msg: {errors: {email: { message: req.__('User not found.')}}}});
      return res.redirect('/password/forgot');  
    }
  } else {
    const token = setIdentifier();
    const expiresInHours = _.parseInt(process.env.PASSWORD_RESET_EXPIRES);
    user.passwordResetToken = token;
    user.passwordResetExpires = req.moment().add(expiresInHours, 'hours').toDate();

    try {
      user.save()
    } catch (error) {
      if (req.isApi) {
        return res.send({error: error, msg: `${JSON.stringify({errors: {email: { message: req.__('Password not generated, please retry.')}}})}`})
      } else {
        req.flash('errors', {msg: `${JSON.stringify({errors: {email: { message: req.__('Password not generated, please retry.')}}})}`});
        res.redirect('/password/forgot');
      }            
    }
    try {
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
          title:    req.__("Password reset"),
          subject:  req.__("Password reset")+' | AVnode.net',
          block_1:  req.__("We’ve received a request to reset your password."),
          button:   req.__("Click here to reset your password"),
          block_2:  req.__("If you didn’t make the request, just ignore this message. Otherwise, you can reset your password using this link:"),
          block_3:  req.__("Thanks."),
          link:     'http://'+req.headers.host+'/password/reset/'+token,
          html_sign: "The AVnode.net Team",
          text_sign:  "The AVnode.net Team"
        }
      });
      if (req.isApi) {
        return res.send({error: false, msg: req.__('Password reset link sent to:')+" "+email})
      } else {
        req.flash('success', {msg: req.__('Password reset link sent to:')+" "+email });
        res.redirect('/password/forgot');
      }
    } catch (error) {
      if (req.isApi) {
        return res.send({error: error, msg: `${JSON.stringify({errors: {email: { message: req.__('Unable to send Confirm Email.')}}})}`})
      } else {
        req.flash('errors', {msg: `${JSON.stringify({errors: {email: { message: req.__('Unable to send Confirm Email.')}}})}`});
        return res.redirect('/password/forgot');
      }
    }
  }
});

export default router;
