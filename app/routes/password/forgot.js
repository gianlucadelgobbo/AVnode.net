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
import config from 'getconfig';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import _ from 'lodash';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _localeCatalogs = {};
const t = (phrase, lang) => {
  if (!_localeCatalogs[lang]) {
    try {
      _localeCatalogs[lang] = JSON.parse(readFileSync(path.join(__dirname, '../../../locales', `${lang}.json`), 'utf8'));
    } catch (e) {
      _localeCatalogs[lang] = null;
    }
  }
  return (_localeCatalogs[lang] && _localeCatalogs[lang][phrase]) || phrase;
};

const getFrontendBase = (lang) => {
  const domain = config.lang_to_domain?.[lang];
  return domain && domain !== 'en' ? `https://${domain}.avnode.net` : 'https://avnode.net';
};

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

  const lang = req.session.current_lang;

  if (!email || typeof email !== 'string' || email.trim() === '') {
    if (req.isApi) {
      return res.send({error: true, msg: {errors: {email: { message: t('User not found.', lang)}}}})
    } else {
      req.flash('errors', {msg: {errors: {email: { message: t('User not found.', lang)}}}});
      return res.redirect('/password/forgot');
    }
  }
  const neutralMsg = t("If this email exists, a reset link will be sent.", lang);

  try {
    user = await User.findOne({email: email}, "_id stagename email");
  } catch (error) {
    logger.error(`password/forgot DB error: ${error.message}`);
    if (req.isApi) {
      return res.send({ error: false, msg: neutralMsg });
    } else {
      req.flash('success', { msg: neutralMsg });
      return res.redirect('/password/forgot');
    }
  }

  if (user === null) {
    // Check if email exists as a secondary email
    let userBySecondary;
    try {
      userBySecondary = await User.findOne({ 'emails.email': email }, "_id stagename email");
    } catch (error) {
      logger.error(`password/forgot secondary email DB error: ${error.message}`);
    }

    if (userBySecondary) {
      try {
        await mySendMailer({
          template: 'reset-password',
          message: { to: email },
          email_content: {
            stagename: userBySecondary.stagename,
            email: email,
            site: getFrontendBase(req.session.current_lang),
            title: t("Password reset", lang),
            subject: t("Password reset", lang) + ' | AVnode.net',
            block_1: t("This email address is registered as a secondary email in your account. To reset your password, please use your primary email address.", lang),
            block_2: t("If you have any questions, just reply to this email, we're always happy to help out.", lang),
            block_3: '',
            button: '',
            link: '',
            html_sign: "The AVnode.net Team",
            text_sign: "The AVnode.net Team"
          }
        });
      } catch (err) {
        logger.error(`password/forgot secondary email send error: ${err.message}`);
      }
    }

    if (req.isApi) {
      return res.send({ error: false, msg: neutralMsg });
    } else {
      req.flash('success', { msg: neutralMsg });
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
        return res.send({error: error, msg: `${JSON.stringify({errors: {email: { message: t('Password not generated, please retry.', lang)}}})}`})
      } else {
        req.flash('errors', {msg: `${JSON.stringify({errors: {email: { message: t('Password not generated, please retry.', lang)}}})}`});
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
          site:    getFrontendBase(req.session.current_lang),
          title:    t("Password reset", lang),
          subject:  t("Password reset", lang)+’ | AVnode.net’,
          block_1:  t("We’ve received a request to reset your password.", lang),
          button:   t("Click here to reset your password", lang),
          block_2:  t("If you didn’t make the request, just ignore this message. Otherwise, you can reset your password using this link:", lang),
          block_3:  t("Thanks.", lang),
          link:     getFrontendBase(req.session.current_lang)+'/password/reset/'+token,
          html_sign: "The AVnode.net Team",
          text_sign:  "The AVnode.net Team"
        }
      });
      if (req.isApi) {
        return res.send({error: false, msg: t('Password reset link sent to:', lang)+" "+email})
      } else {
        req.flash('success', {msg: t('Password reset link sent to:', lang)+" "+email });
        res.redirect('/password/forgot');
      }
    } catch (error) {
      if (req.isApi) {
        return res.send({error: error, msg: `${JSON.stringify({errors: {email: { message: t('Unable to send Confirm Email.', lang)}}})}`})
      } else {
        req.flash('errors', {msg: `${JSON.stringify({errors: {email: { message: t('Unable to send Confirm Email.', lang)}}})}`});
        return res.redirect('/password/forgot');
      }
    }
  }
});

export default router;
