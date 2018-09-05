const router = require('./router')();
const mailer = require('../utilities/mailer');

const mongoose = require('mongoose');
const UserTemp = mongoose.model('UserTemp');
const User = mongoose.model('User');
//const mailer = require('../utilities/mailer');
//const _slug = require('../utilities/slug');

let config = require('getconfig');

const logger = require('../utilities/logger');

router.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/admin/profile/public');
  }
  res.render('admin/index', {
    title: __('Create Account'),
    is_admin: true
  });
  /*
  res.render('signup', {
    title: __('Create Account')
  });
  */
});



router.post('/', (req, res) => {
  console.log('signupsignupsignupsignupsignupsignupsignupsignupsignup');
  console.log(req.body);
  if (req.body.crewName) req.body.crewname = req.body.crewName;
  if (req.body.CrewProfile) req.body.crewslug = req.body.CrewProfile;
  req.body.lang = global.getLocale();

  let data = new UserTemp();
  let select = config.cpanel.signup.forms.signup.select;
  let put = {};
  for (const item in select) if(req.body[item]) put[item] = req.body[item];
  router.signupValidator(put, (put, errors) => {
    console.log('signupValidator CB');
    console.log(errors.errors);
    if (errors.message === "") {
      console.log('signupValidator CB');
      Object.assign(data, put);
                
      UserTemp.deleteMany({ email: data.email }, function (err) {
        data.save((err) => {
          if (err) {
            console.log('err');
            console.log(err);
            res.status(400).json(err);
          } else {
            select = Object.assign(config.cpanel.signup.forms.signup.select, config.cpanel.signup.forms.signup.selectaddon);
            //let populate = config.cpanel.signup.forms.signup.populate;      
            //.populate(populate)
            UserTemp
            .findById(data._id)
            .select(select)
            .exec((err, data) => {
              console.log('findByIdfindByIdfindByIdfindByIdfindByIdfindByIdfindByIdfindById');
              console.log(data);
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
                      block_1:  __("We're excited to have you get started. First, you need to confirm your account. Just press the button below."),
                      button:   __("Confirm Account"),
                      block_2:  __("If that doesn't work, copy and paste the following link in your browser:"),
                      block_3:  __("If you have any questions, just reply to this email, we're always happy to help out."),
                      signature: "Cheers<br/>The AVnode.net Team"
                    }
                  }, function(){
                    console.log("stocazzo");
                  });
                  console.log("stocazzo2");
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
      console.log('signupValidator CB errors');
      res.status(400).json(errors);  
    }
  });
});

router.signupValidator = (put, cb) => {
  console.log('signupValidatorsignupValidatorsignupValidatorsignupValidatorsignupValidator');
 
  let errors = {
    "errors":{},
    "_message":"",
    "message":"",
    "name":""
  };
  //put = {};
  //put.birthday="01-09-2018";
  const birthdayA = put.birthday.split("-");
  const birthday = new Date(Date.UTC(parseInt(birthdayA[2]),parseInt(birthdayA[1])-1,parseInt(birthdayA[0])));
  if (parseInt(birthdayA[2]) !== birthday.getFullYear() || parseInt(birthdayA[1])-1 !== birthday.getMonth() || parseInt(birthdayA[0]) !== birthday.getDate()) {
    errors.errors.birthday = {
      "message": "Cast to Date failed for value \"Invalid Date\" at path \"birthday\"",
      "name": "CastError",
      "stringValue":"\"Invalid Date\"",
      "kind":"Date",
      "value":null,
      "path":"birthday",
      "reason":{
        "message":"Cast to date failed for value \"Invalid Date\" at path \"birthday\"",
        "name":"CastError","stringValue":"\"Invalid Date\"",
        "kind":"date",
        "value":null,
        "path":"birthday"
      }
    };
    errors._message += "UserTemp validation failed"+"<br/>";
    errors.message += "UserTemp validation failed: birthday: Cast to Date failed for value \"Invalid Date\" at path \"birthday\""+"<br/>";
    errors.name += "ValidationError"+"<br/>";
  } else {
    put.birthday = birthday;
  }
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
      console.log('err');
      console.log(err);
      errors.errors.err = err;
      cb(put, errors);
    } else {
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
        errors._message += "UserTemp validation failed"+"<br/>",
        errors.message += "E11000 duplicate key error collection: avnode.users index: email_1 dup key: { : \""+put.email+"\" }"+"<br/>",
        errors.name += "MongoError"+"<br/>"
      }
      User.find({ 'slug': put.slug }, "_id", function(err, docs) {
        if (err) {
          console.log('err');
          console.log(err);
          errors.errors.err = err;
          cb(put, errors);
        } else {
          if (docs.length) {
            errors.errors.slug = {
              "message": "E11000 duplicate key error collection: avnode.usertemp index: slug_1 dup key: { : \""+put.slug+"\" }",
              "name": "MongoError",
              "stringValue":"\"Duplicate Key\"",
              "kind":"Date",
              "value":null,
              "path":"slug",
              "reason":{
                "message":"E11000 duplicate key error collection: avnode.usertemp index: slug_1 dup key: { : \""+put.slug+"\" }",
                "name":"MongoError",
                "stringValue":"\"Duplicate Key\"",
                "kind":"string",
                "value":null,
                "path":"slug"
              }
            };
            errors._message += "UserTemp validation failed"+"<br/>",
            errors.message += "E11000 duplicate key error collection: avnode.usertemp index: slug_1 dup key: { : \""+put.slug+"\" }"+"<br/>",
            errors.name += "MongoError"+"<br/>"
          }
          if (put.crewslug) {
            User.find({ 'slug': put.crewslug }, "_id", function(err, docs) {
              if (err) {
                console.log('err');
                console.log(err);
                errors.errors.err = err;
                cb(put, errors);
              } else {
                if (docs.length) {
                  errors.errors.crewslug = {
                    "message": "E11000 duplicate key error collection: avnode.usertemp index: crewslug_1 dup key: { : \""+put.crewslug+"\" }",
                    "name": "MongoError",
                    "stringValue":"\"Duplicate Key\"",
                    "kind":"Date",
                    "value":null,
                    "path":"crewslug",
                    "reason":{
                      "message":"E11000 duplicate key error collection: avnode.usertemp index: crewslug_1 dup key: { : \""+put.crewslug+"\" }",
                      "name":"MongoError",
                      "stringValue":"\"Duplicate Key\"",
                      "kind":"string",
                      "value":null,
                      "path":"crewslug"
                    }
                  };
                  errors._message += "UserTemp validation failed"+"<br/>",
                  errors.message += "E11000 duplicate key error collection: avnode.usertemp index: crewslug_1 dup key: { : \""+put.crewslug+"\" }"+"<br/>",
                  errors.name += "MongoError"+"<br/>"
                } 
                console.log('CB 1');
                cb(put, errors);
              }
            });        
          } else {
            console.log('CB 2');
            cb(put, errors);
          }
        }
      });        
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
        console.log(existingUser);
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
          console.log('user.save error:' + err);
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
