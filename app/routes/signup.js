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
    return res.redirect('/admin/profile/'+req.user._id+'/public');
  }
  res.render('admin/signup', {
    title: __('Create Account'),
    scripts: ['signup'],
    get: {}
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
  logger.debug("put");
  logger.debug(put);

  helpers.mySlugify(User, put.stagename, (slug) => {
    put.slug = slug;
    helpers.mySlugify(User, put.crewname, (crewslug) => {
      put.crewslug = crewslug;
      router.signupValidator(put, (put, errors) => {
        logger.debug("signupValidatorsignupValidatorsignupValidatorsignupValidator");
        logger.debug(errors);
        if (!Object.keys(errors.errors).length) {
          logger.debug("deleteManydeleteManydeleteManydeleteMany");
          Object.assign(data, put);
          logger.debug(  data)      
          UserTemp.deleteMany({ email: data.email }, function (err) {
            data.save((err) => {
              logger.debug("deleteManydeleteManydeleteManydeleteMany");
              if (err) {
                //res.status(400).send(err);
                req.flash('errors', {msg: `${JSON.stringify(err)}`});
                res.render('admin/signup', {
                  title: __('Create Account'),
                  get: req.body,
                  currentUrl: req.originalUrl,
                  scripts: ['signup'],
                  err: err
                });  
              } else {
                select = Object.assign(config.cpanel.signup.forms.signup.select, config.cpanel.signup.forms.signup.selectaddon);
                //let populate = config.cpanel.signup.forms.signup.populate;      
                //.populate(populate)
                UserTemp
                .findById(data._id)
                .select(select)
                .exec((err, data) => {
                  if (err) {
                    //res.status(500).send({ message: `${JSON.stringify(err)}` });
                    req.flash('errors', {msg: `${JSON.stringify(err)}`});
                    res.render('admin/signup', {
                      title: __('Create Account'),
                      get: req.body,
                      currentUrl: req.originalUrl,
                      scripts: ['signup'],
                      err: err
                    });  
                  } else {
                    if (!data) {
                      res.status(404).send({ message: `DOC_NOT_FOUND` });
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
                      //res.json(send);
                      req.flash('success', {msg: __("We have sent a confirmation email, please confirm activate your accont")});
                      res.render('admin/signup', {
                        title: __('Create Account'),
                        get: req.body,
                        currentUrl: req.originalUrl,
                        scripts: ['signup'],
                        err: errors
                      });  
                    }
                  }
                });
              }
            });
          });
        } else {
          if (req.params.api==1) {
            //res.status(400).send(errors); 
          } else {
            req.flash('errors', {msg: `${JSON.stringify(errors)}`});
            res.render('admin/signup', {
              title: __('Create Account'),
              get: req.body,
              currentUrl: req.originalUrl,
              scripts: ['signup'],
              err: errors
            });  
          }
        
        }
      });      
    });
  });

});

router.signupValidator = (put, cb) => {
  logger.debug("signupValidator")
  logger.debug(put)
  let errors = {
    "errors":{},
    "_message":"",
    "message":"",
    "name":""
  };
  //put = {};
  //put.birthday="01-09-2018";
  //const birthday = helper.dateFix(put.birthday);
  if (put.crewname && put.crewname.trim() === put.stagename.trim()) {
    errors.errors.crewname = {
      "message": __("CREW_NAME_CAN_NOT_BE_THE_EQUAL_TO_THE_STAGE_NAME")
    }
  }
  if (!put.stagename || put.stagename == "") {
    errors.errors.stagename = {
      "message": __("STAGE_NAME_IS_REQUIRED")
    };
  }
  if (!put.birthday || put.birthday == "") {
    errors.errors.birthday = {
      "message": __("BIRTHDAY_IS_REQUIRED")
    };
  }
  if (!put.email || put.email == "") {
    errors.errors.email = {
      "message": "EMAIL_IS_REQUIRED"
    }
  }


  if (!put.addresses || !put.addresses.length) {
    errors.errors.addresses = [{
      "message": __("ADDRESS_IS_IN_A_WRONG_FORMAT")
    }]
  } else {
    for(var i=0; i<put.addresses.length; i++ ){
      if (!put.addresses[i].geometry || !put.addresses[i].formatted_address || !put.addresses[i].geometry.lat){
        if (!errors.errors.addresses) errors.errors.addresses = [];
        errors.errors.addresses[i] = {
          "message": __("ADDRESS_IS_IN_A_WRONG_FORMAT")
        }
      }
    }
  }
  if (!put.password || put.password == "") {
    errors.errors.password = {
      "message": __("PASSWORD_IS_REQUIRED")
    };
  }
  if (!put.confirmPassword || put.confirmPassword == "") {
    errors.errors.confirmPassword = {
      "message": __("PASSWORD_CONFIRM_IS_REQUIRED")
    };
  } else if (put.password !== put.confirmPassword) {
    errors.errors.confirmPassword = {
      "message": __("Password confirm do not match")
    };
  }
  /*
  */
  if (Object.keys(errors.errors).length)  {
    cb(put, errors);
  } else {
    User.find({ $or: [ { 'email': put.email }, { 'emails.email': put.email } ] }, "_id", function(err, docs) {
      if (err) {
        errors.errors.err = err;
        cb(put, errors);
      } else {
        if (docs.length) {
          errors.errors.email = {
            "message": "There is already an account with this email: \""+put.email+"\".<br />Please login <a href='/login?email="+put.email+"'>here</a> or ask for a password <a href='/password/forgot?email="+put.email+"'>here</a>"
          }
        }
        cb(put, errors);
      }
    });
  }
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
