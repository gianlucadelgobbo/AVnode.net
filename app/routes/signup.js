import createRouter from "./router.js";
const router = createRouter();

import { mySendMailer } from '../utilities/mailer.js';
import helpers from '../utilities/helpers.js';

import mongoose from 'mongoose';
const UserTemp = mongoose.model('UserTemp');
const User = mongoose.model('User');
//const mailer = require('../utilities/mailer');
//const _slug = require('../utilities/slug');

import config from 'getconfig';

import { logger, requestLogger, errorLogger } from '../utilities/logger.js';


router.get('/', (req, res) => {
  //logger.info('global.getLocale: '+req.getLocale());
  if (req.user) {
    return res.redirect('/admin/profile/'+req.user._id+'/public');
  }
  res.render('admin/signup', {
    title: req.__('Create Account'),
    scripts: ['signup'],
    get: {}
  });
});

router.post('/', async (req, res) => {
  logger.info("req.body");
  logger.info(req.body);

  try {
    // Normalize request fields
    req.body.crewname = req.body.crewName || req.body.crewname;
    req.body.crewslug = req.body.crewUrl || req.body.crewslug;
    req.body.lang = req.getLocale();

    let select = config.cpanel.signup.forms.signup.select;
    let put = {};
    for (const item in select) if (req.body[item]) put[item] = req.body[item];

    logger.info("put");
    logger.info(put);

    // Generate unique slugs
    put.slug = await helpers.mySlugify(User, put.stagename);
    put.crewslug = await helpers.mySlugify(User, put.crewname);

    // Validate signup data
    const errors = await router.signupValidator(req, put);
    logger.info("Validation Errors:", errors);

    if (Object.keys(errors.errors).length) {
      if (req.isApi) {
        return res.send({
          get: req.body,
          currentUrl: req.originalUrl,
          err: errors
        })
      } else {
        req.flash('errors', { msg: JSON.stringify(errors) });
        return res.render('admin/signup', {
          title: req.__('Create Account'),
          get: req.body,
          currentUrl: req.originalUrl,
          scripts: ['signup'],
          err: errors
        });  
      }
    }

    logger.info("deleteMany UserTemp");
    await UserTemp.deleteMany({ email: put.email });

    // Create new temporary user
    const data = new UserTemp(put);
    await data.save();

    select = { ...config.cpanel.signup.forms.signup.select, ...config.cpanel.signup.forms.signup.selectaddon };

    const savedUser = await UserTemp.findById(data._id).select(select);

    if (!savedUser) {
      return res.status(404).send({ message: `DOC_NOT_FOUND` });
    }

    // Send confirmation email
    await mySendMailer({
      template: 'signup',
      message: { to: savedUser.email },
      locals: {},
      email_content: {
        site: 'http://' + req.headers.host,
        link: 'http://' + req.headers.host + '/verify/signup/' + savedUser.confirm,
        stagename: savedUser.stagename,
        email: savedUser.email,
        confirm: savedUser.confirm,
        title: req.__("Welcome!"),
        subject: req.__("Welcome!") + ' | AVnode.net',
        block_1: req.__("We're excited to have you get started. First, you need to confirm your account. Just press the button below."),
        button: req.__("Confirm Account"),
        block_2: req.__("If that doesn't work, copy and paste the following link in your browser:"),
        block_3: req.__("If you have any questions, just reply to this email, we're always happy to help out."),
        html_sign: "The AVnode.net Team",
        text_sign: "The AVnode.net Team"
      }
    });


    if (req.isApi) {
      res.send({
        get: req.body,
        msg: req.__("We have sent a confirmation email, please confirm activate your account"),
        currentUrl: req.originalUrl,
        err: errors
      })
    } else {
      req.flash('success', { msg: req.__("We have sent a confirmation email, please confirm activate your account") });
      res.render('admin/signup', {
        title: req.__('Create Account'),
        get: req.body,
        currentUrl: req.originalUrl,
        scripts: ['signup'],
        err: errors
      });
    }

  } catch (err) {
    console.error("🔥 Signup Error:", err);
    if (req.isApi) {
      return res.send({
        get: req.body,
        currentUrl: req.originalUrl,
        err
      })
    } else {
      req.flash('errors', { msg: JSON.stringify(err) });
      return res.render('admin/signup', {
        title: req.__('Create Account'),
        get: req.body,
        currentUrl: req.originalUrl,
        scripts: ['signup'],
        err
      });
    }
  }
});


router.signupValidator = async (req, put) => {
  logger.info("signupValidator", put);
  let errors = { errors: {}, _message: "", message: "", name: "" };

  if (put.crewname && put.crewname.trim() === put.stagename.trim()) {
    errors.errors.crewname = { message: req.__("CREW_NAME_CAN_NOT_BE_THE_EQUAL_TO_THE_STAGE_NAME") };
  }
  if (!put.stagename) errors.errors.stagename = { message: req.__("STAGE_NAME_IS_REQUIRED") };
  if (!put.birthday) errors.errors.birthday = { message: req.__("BIRTHDAY_IS_REQUIRED") };
  if (!put.email) errors.errors.email = { message: "EMAIL_IS_REQUIRED" };

  if (!put.addresses || !put.addresses.length) {
    errors.errors.addresses = [{ message: req.__("ADDRESS_IS_IN_A_WRONG_FORMAT") }];
  } else {
    put.addresses.forEach((address, i) => {
      if (!address.geometry || !address.formatted_address || !address.geometry.lat) {
        if (!errors.errors.addresses) errors.errors.addresses = [];
        errors.errors.addresses[i] = { message: req.__("ADDRESS_IS_IN_A_WRONG_FORMAT") };
      }
    });
  }

  if (!put.password) errors.errors.password = { message: req.__("PASSWORD_IS_REQUIRED") };
  if (!put.confirmPassword) {
    errors.errors.confirmPassword = { message: req.__("PASSWORD_CONFIRM_IS_REQUIRED") };
  } else if (put.password !== put.confirmPassword) {
    errors.errors.confirmPassword = { message: req.__("Password confirm does not match") };
  }

  if (Object.keys(errors.errors).length) return errors;

  try {
    const existingUser = await User.findOne({
      $or: [{ email: put.email }, { 'emails.email': put.email }]
    }).select("_id");

    if (existingUser) {
      errors.errors.email = {
        message: `There is already an account with this email: "${put.email}".<br />
        Please login <a href='/login?email=${put.email}'>here</a> or ask for a password <a href='/password/forgot?email=${put.email}'>here</a>`
      };
    }
  } catch (err) {
    console.error("🔥 Error in signupValidator:", err);
    errors.errors.err = err;
  }

  return errors;
};







/*
router.post('/', (req, res, next) => {
  if (req.body.email && req.body.username && req.body.stagename && req.body.name && req.body.surname && req.body.password) {
    
    const slug = _slug.parse(req.body.username);
    
    UserTemp.findOne({ $or: [{ email: req.body.email }, { slug: slug }] }, (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash('errors', { msg: req.__('Account already exists.') });
        return res.redirect('/signup');
      }

      const user = new UserTemp({
        slug: slug,
        username: slug,
        stagename: req.body.stagename,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        confirm: uuid.v4()
      });

      user.save((err) => {
        if (err) {
          return next(err);
        }
        mailer.signup({ to: user.email }, { uuid: user.confirm }, (err) => {
          if (err) {
            return next(err);
          }
          req.flash('success', { msg: req.__('Please check your inbox and confirm your Email') });
          res.redirect('/');
        });
      });
    });
  } else {
    return next('All fields are required.');
  }  
});
*/
export default router;
