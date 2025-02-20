import createRouter from "./router.js";
const router = createRouter();

import axios from 'axios';

import mongoose from 'mongoose';
const UserTemp = mongoose.model('UserTemp');
const User = mongoose.model('User');
//const mailer = require('../utilities/mailer');
//const _slug = require('../utilities/slug');
import https from 'https';
import querystring from 'querystring';

import { logger, requestLogger, errorLogger } from '../utilities/logger.js';


import config from 'getconfig';

router.get('/:sez/:code', async (req, res) => {
  logger.info("Verify");
  logger.info(req.params.sez);
  logger.info(req.params.code);
  if (req.params.sez == 'signup' && req.params.code) {
    try {
      const put = await UserTemp
      .findOne({confirm:req.params.code})
      .exec();
      if (put) {
        router.signupVerifyValidator(put, async (data, errors) => {
          if (errors.message === "") {
            let user = new User();
            user.stagename = data.stagename;
            user.slug = data.slug;
            user.hashed = true;
            user.lang = data.lang;
            user.birthday = data.birthday;
            if (data.addresses && data.addresses[0])
              user.addresses = [ { geometry: data.addresses[0].geometry, locality: data.addresses[0].locality, country: data.addresses[0].country, formatted_address: data.addresses[0].formatted_address } ];
            user.password = data.password;
            user.email = data.email;
            user.emails = [{
              email: data.email,
              is_public: false,
              is_primary: true,
              is_confirmed: true,
              mailinglists: {livevisuals: 1}
            }];
            user.is_crew = false;
            let crew;
            if (data.crewslug) {
              crew = new User();
              crew.stagename = data.crewname;
              crew.slug = data.crewslug;
              crew.addresses = data.addresses;
              crew.is_crew = true;
              crew.members = [user._id];
              crew.stats = {members: 1},

              user.crews = [crew._id];
              user.stats = {crews: 1};
            }
            try {
              await user.save(); // Save the user
              logger.info('User saved successfully');
          
              if (data.crewslug) {
                try {
                  await crew.save(); // Save the crew
                  logger.info('Crew saved successfully');
                } catch (crewError) {
                  logger.info(crewError);
                  return res.render('verify/signup', {
                    title: __('Signup verify'),
                    err: crewError,
                    data: data
                  });
                }
              }
          
              try {
                await router.updateSendy(user, user.email); // Update mailing list
                await UserTemp.deleteMany({ confirm: req.params.code }); // Delete temp user records
                logger.info('UserTemp records deleted');
                
                return res.render('verify/signup', {
                  title: __('Signup verify'),
                  data: data
                });
              } catch (sendyError) {
                logger.info(sendyError);
                return res.render('verify/signup', {
                  title: __('Signup verify'),
                  err: sendyError,
                  data: data
                });
              }
            } catch (userError) {
              logger.info(userError);
              return res.render('verify/signup', {
                title: __('Signup verify'),
                err: userError,
                data: data
              });
            }          } else {
            res.render('verify/signup', {
              title: __('Signup verify'),
              err: errors,
              data: data
            });
          }
        });      
      } else {
        res.render('verify/signup', {
          title: __('Signup verify'),
          err: true,
        });
      }
    } catch (err) {
      res.render('verify/signup', {
        title: __('Signup verify'),
        err: true,
      });
    }
  }
  if (req.params.sez == 'email' && req.params.code) {
    let user;
    try {
      user = await User
      .findOne({"emails.confirm":req.params.code})
      .select({emails: 1})
      .exec();
      if (!user) {
        logger.info("NON TROVATOOOO");
        return res.render('verify/email', {
          title: __('Email verify'),
          err: true
        });
      }
    } catch (err) {
      return res.render('verify/email', {
        title: __('Email verify'),
        err: true,
      });
    };
    for(let item=0;item<user.emails.length;item++) {
      if (user.emails[item].confirm === req.params.code) {
        var sendyemail = user.emails[item].email;
        user.emails[item].is_confirmed = true;
        user.emails[item].mailinglists = { livevisuals: 1 };
        //delete user.emails[item].confirm;
      }
    }
    try {
      await user.save()
      await router.updateSendy(user, sendyemail); // Update mailing list
      if (req.user) {
        req.flash('success', { msg: __('Email verificated with success.') });
        res.redirect('/admin/profile/'+req.user._id+'/emails');
      } else {
        res.render('verify/email', {
          title: __('Email verify'),
          err: false,
        });  
      }
    } catch (err) {
      res.render('verify/email', {
        title: __('Email verify'),
        err: true,
      });
    }
}
});

router.updateSendy = async (user, email) => {
  let formData = {
    list: process.env.SENDYLIST,
    api_key: process.env.SENDYAPIKEY,
    email: email,
    Topics: process.env.SENDYLISTTOPICS,
    avnode_id: user._id.toString(),
    avnode_slug: user.slug,
    avnode_email: user.email,
    boolean: true
  };

  if (user.name) formData.Name = user.name;
  if (user.surname) formData.Surname = user.surname;
  if (user.stagename) formData.Stagename = user.stagename;
  if (user.addresses?.[0]?.locality) formData.Location = user.addresses[0].locality;
  if (user.addresses?.[0]?.country) formData.Country = user.addresses[0].country;
  if (user.addresses?.[0]?.geometry?.lat) formData.LATITUDE = user.addresses[0].geometry.lat;
  if (user.addresses?.[0]?.geometry?.lng) formData.LONGITUDE = user.addresses[0].geometry.lng;

  const postData = querystring.stringify(formData);

  try {
    const response = await axios.post(process.env.SENDYENDPOINT, postData);
    return response.data; // Log success response if needed
  } catch (error) {
    console.error(`Sendy update failed: ${error.message}`); // Log error but don't break the app
    return null; // Return null to avoid breaking the flow
  }
};

router.signupVerifyValidator = async (put, cb) => {
  let errors = {
    "errors":{},
    "_message":"",
    "message":"",
    "name":""
  };
  console.log("signupVerifyValidator 2")
  try {
    const docs = await User.find({ $or: [ { 'email': put.email }, { 'emails.email': put.email } ] }, "_id")
    if (docs.length) {
      errors.errors.email = {
        "message": "E11000 duplicate key error collection: avnode.users index: email_1 dup key: { : \""+put.email+"\" }",
        "name": "MongoError",
        "stringValue":"\"Duplicate Key\"",
        "kind":"Date",
        "value":null,
        "path":"email",
        "reason":{
          "message":"E11000 duplicate key error collection: avnode.users index: email_1 dup key: { : \""+put.email+"\" }",
          "name":"MongoError",
          "stringValue":"\"Duplicate Key\"",
          "kind":"string",
          "value":null,
          "path":"email"
        }
      };
    }
    try {
      const docs = await User.find({ 'slug': put.slug }, "_id");
      if (docs.length) {
        errors.errors.slug = {
          "message": "E11000 duplicate key error collection: avnode.user index: slug_1 dup key: { : \""+put.slug+"\" }"
        };
      }
      if (put.crewslug) {
        try {
          const docs = await User.find({ 'slug': put.crewslug }, "_id")
          if (docs.length) {
            errors.errors.crewslug = {
              "message": "E11000 duplicate key error collection: avnode.user index: crewslug_1 dup key: { : \""+put.crewslug+"\" }"
            };
          } 
          cb(put, errors);
        } catch (err) {
          errors.errors.err = err;
          cb(put, errors);
        }
      } else {
        cb(put, errors);
      }
    } catch (err) {
      errors.errors.err = err;
      cb(put, errors);
    }
  } catch (err) {
    errors.errors.err = err;
    cb(put, errors);
  }
}

export default router;
