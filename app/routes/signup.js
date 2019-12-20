const router = require('./router')();
const mailer = require('../utilities/mailer');
const helper = require('../utilities/helper');
const helpers = require('./admin/api/helpers');

const mongoose = require('mongoose');
const UserTemp = mongoose.model('UserTemp');
const User = mongoose.model('User');
//const mailer = require('../utilities/mailer');
//const _slug = require('../utilities/slug');

let config = require('getconfig');

const logger = require('../utilities/logger');

router.get('/', (req, res) => {
  logger.debug('global.getLocale: '+global.getLocale());
  if (req.user) {
    return res.redirect('/admin/profile/public');
  }
  res.render('admin/index', {
    title: __('Create Account'),
    is_admin: true
  });
});

router.post('/', (req, res) => {
  logger.debug(req.body);
  if (req.body.crewName) req.body.crewname = req.body.crewName;
  if (req.body.crewUrl) req.body.crewslug = req.body.crewUrl;
  req.body.lang = global.getLocale();

  let data = new UserTemp();
  let select = config.cpanel.signup.forms.signup.select;
  let put = {};
  for (const item in select) if(req.body[item]) put[item] = req.body[item];
  helpers.mySlugify(User, put.stagename, (slug) => {
    put.slug = slug;
    helpers.mySlugify(User, put.crewname, (crewslug) => {
      put.crewslug = crewslug;
      router.signupValidator(put, (put, errors) => {
        if (errors.message === "") {
          Object.assign(data, put);
                    
          UserTemp.deleteMany({ email: data.email }, function (err) {
            data.save((err) => {
              if (err) {
                res.status(400).json(err);
              } else {
                select = Object.assign(config.cpanel.signup.forms.signup.select, config.cpanel.signup.forms.signup.selectaddon);
                //let populate = config.cpanel.signup.forms.signup.populate;      
                //.populate(populate)
                UserTemp
                .findById(data._id)
                .select(select)
                .exec((err, data) => {
                  if (err) {
                    res.status(500).json({ error: `${JSON.stringify(err)}` });
                  } else {
                    if (!data) {
                      res.status(204).json({ error: `DOC_NOT_FOUND` });
                    } else {
                      mailer.mySendMailer({
                        template: 'signup',
                        message: {
                          to: data.email
                        },
                        locals: {
                        },
                        email_content: {
                          site: 'http://'+req.headers.host,
                          link: 'http://'+req.headers.host+'/verify/signup/'+data.confirm,
                          stagename: data.stagename,
                          email: data.email,
                          confirm: data.confirm,
                          title:    __("Welcome!"),
                          subject:  __("Welcome!")+' | AVnode.net',
                          block_1:  __("We're excited to have you get started. First, you need to confirm your account. Just press the button below."),
                          button:   __("Confirm Account"),
                          block_2:  __("If that doesn't work, copy and paste the following link in your browser:"),
                          block_3:  __("If you have any questions, just reply to this email, we're always happy to help out."),
                          html_sign: "The AVnode.net Team",
                          text_sign:  "The AVnode.net Team"
                        }
                      }, function(){
                      });
                      let send = {_id: data._id};
                      for (const item in config.cpanel.signup.forms.signup.select) send[item] = data[item];
                      res.json(send);
                    }
                  }
                });
              }
            });
          });
        } else {
          res.status(400).json(errors);  
        }
      });      
    });
  });

});

router.signupValidator = (put, cb) => { 
  let errors = {
    "errors":{},
    "_message":"",
    "message":"",
    "name":""
  };
  //put = {};
  //put.birthday="01-09-2018";
  const birthday = helper.dateFix(put.birthday);
  if (!birthday) {
    errors.errors.birthday = {
      "message": "Birthday is in a wrong date format",
      "name": "CastError",
      "stringValue":"\"Invalid Date\"",
      "kind":"Date",
      "value":null,
      "path":"birthday",
      "reason":{
        "message":"Birthday is in a wrong date format",
        "name":"CastError","stringValue":"\"Invalid Date\"",
        "kind":"date",
        "value":null,
        "path":"birthday"
      }
    };
    errors._message += "UserTemp validation failed"+"<br/>";
    errors.message += "Birthday is in a wrong date format"+"<br/>";
    errors.name += "ValidationError"+"<br/>";
  } else {
    put.birthday = birthday;
  }
  if (!put.addresses || !put.addresses[0] || !put.addresses[0].geometry) {
    errors.errors.address = {
      "message": "City, Country is in a wrong format, please select one from the results list on the bottom of the field",
      "name": "CastError",
      "stringValue":"\"Invalid Date\"",
      "kind":"Date",
      "value":null,
      "path":"birthday",
      "reason":{
        "message":"City, Country is in a wrong format, please select one from the results list on the bottom of the field",
        "name":"CastError","stringValue":"\"Invalid Date\"",
        "kind":"date",
        "value":null,
        "path":"birthday"
      }
    };
    errors._message += "UserTemp validation failed"+"<br/>";
    errors.message += "City, Country is in a wrong format, please select one from the results list on the bottom of the field"+"<br/>";
    errors.name += "ValidationError"+"<br/>";
  } 
  /*
  */
  if (put.crewslug && put.slug.trim() === put.crewslug.trim()) {
    errors.errors.slug = {
      "message": "Crew Profile URL can not be the equal to the Profile URL",
      "name": "MongoError",
      "stringValue":"\"Duplicate Key\"",
      "kind":"Date",
      "value":null,
      "path":"slug",
      "reason":{
        "message":"Crew Profile URL can not be the equal to the Profile URL",
        "name":"MongoError",
        "stringValue":"\"Duplicate Key\"",
        "kind":"string",
        "value":null,
        "path":"slug"
      }
    };
    errors._message += "UserTemp validation failed"+"<br/>";
    errors.message += "Crew Profile URL can not be the equal to the Profile URL"+"<br/>";
    errors.name += "MongoError"+"<br/>";
  }
  User.find({ $or: [ { 'email': put.email }, { 'emails.email': put.email } ] }, "_id", function(err, docs) {
    if (err) {
      errors.errors.err = err;
      cb(put, errors);
    } else {
      if (docs.length) {
        errors.errors.email = {
          "message": "There is already an account with this email: \""+put.email+"\". Please login <a href='/login?email="+put.email+"'>here</a> or ask for a password <a href='/password/forgot?email="+put.email+"'>here</a>",
          "name": "MongoError",
          "stringValue":"\"Duplicate Key\"",
          "kind":"Date",
          "value":null,
          "path":"email",
          "reason":{
            "message":"There is already an account with this email: \""+put.email+"\". Please login <a href='/login?email="+put.email+"'>here</a> or ask for a password <a href='/password/forgot?email="+put.email+"'>here</a>",
            "name":"MongoError",
            "stringValue":"\"Duplicate Key\"",
            "kind":"string",
            "value":null,
            "path":"email"
          }
        };
        errors._message += "UserTemp validation failed"+"<br/>",
        errors.message += "There is already an account with this email: \""+put.email+"\". Please login <a href='/login?email="+put.email+"'>here</a> or ask for a password <a href='/password/forgot?email="+put.email+"'>here</a>"+"<br/>",
        errors.name += "MongoError"+"<br/>"
      }
      cb(put, errors);
    }
  });
}




/*
router.post('/', (req, res, next) => {
  if (req.body.email && req.body.username && req.body.stagename && req.body.name && req.body.surname && req.body.password) {
    
    const slug = _slug.parse(req.body.username);
    
    UserTemp.findOne({ $or: [{ email: req.body.email }, { slug: slug }] }, (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash('errors', { msg: __('Account already exists.') });
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
          req.flash('success', { msg: __('Please check your inbox and confirm your Email') });
          res.redirect('/');
        });
      });
    });
  } else {
    return next('All fields are required.');
  }  
});
*/
module.exports = router;
