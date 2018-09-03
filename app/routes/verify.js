const router = require('./router')();
const uuid = require('uuid');

const mongoose = require('mongoose');
const UserTemp = mongoose.model('UserTemp');
const User = mongoose.model('User');
//const mailer = require('../utilities/mailer');
//const _slug = require('../utilities/slug');

const logger = require('../utilities/logger');

let config = require('getconfig');

router.get('/:sez/:code', (req, res) => {
  console.log("VERIFY");
  console.log(req.params.code);
  /*if (req.user) {
    return res.redirect('/admin/profile/public');
  }*/
  if (req.params.sez == 'signup' && req.params.code) {
    UserTemp
    .findOne({confirm:req.params.code})
    .exec((err, put) => {
      if (put) {
        router.signupVerifyValidator(put, (data, errors) => {
          console.log('signupValidator CB');
          console.log(errors.errors);
          console.log(data);
          if (errors.message === "") {
            console.log('signupValidator CB');
            let user = new User();
            user.stagename = data.stagename;
            user.slug = data.slug;
            user.lang = data.lang;
            user.birthday = data.birthday;
            user.addresses = data.addresses;
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
            user.save((err) => {
              if (err) {
                console.log('err');
                res.render('verify/signup', {
                  title: __('Signup verify'),
                  err: err,
                  data: data
                });
              } else {
                if (!data.crewslug) {
                  console.log('NO crew');
                  UserTemp.deleteMany({ confirm:req.params.code }, function (err) {
                    res.render('verify/signup', {
                      title: __('Signup verify'),
                      data: data
                    });
                  });
                } else {
                  console.log('Create crew');
                  User
                  .findOne({slug:data.slug})
                  .exec((err, user) => {
                    let crew = new User();
                    crew.stagename = data.crewname;
                    crew.slug = data.crewslug;
                    crew.addresses = data.addresses;
                    crew.is_crew = true;
                    crew.members = [user._id];
                    crew.stats = {members: 1},
                    crew.emails = [{
                      is_primary: true,
                      is_confirmed: true
                    }];
                    crew.save((err) => {
                      if (err) {
                        console.log('err');
                        console.log(err);
                        res.render('verify/signup', {
                          title: __('Signup verify'),
                          err: err,
                          data: data
                        });
                      } else {
                        User
                        .findOne({slug:data.crewslug})
                        .exec((err, crew) => {
                          user.crews = [crew._id];
                          user.stats = {crews: 1},
                          user.save((err) => {
                            if (err) {
                              console.log('err');
                              res.render('verify/signup', {
                                title: __('Signup verify'),
                                err: err,
                                data: data
                              });
                            } else {
                              UserTemp.deleteMany({ confirm:req.params.code }, function (err) {
                                res.render('verify/signup', {
                                  title: __('Signup verify'),
                                  data: data
                                });
                              });
                            }
                          });
                        });
                      } 
                    });
                  });
                }
              }
            });
          } else {
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
    });
  }
});

router.signupVerifyValidator = (put, cb) => {
  console.log('signupVerifyValidatorsignupVerifyValidatorsignupVerifyValidatorsignupVerifyValidatorsignupVerifyValidator');
  console.log(put);
  let errors = {
    "errors":{},
    "_message":"",
    "message":"",
    "name":""
  };
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
        errors._message += "User validation failed"+"<br/>",
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
              "message": "E11000 duplicate key error collection: avnode.user index: slug_1 dup key: { : \""+put.slug+"\" }",
              "name": "MongoError",
              "stringValue":"\"Duplicate Key\"",
              "kind":"Date",
              "value":null,
              "path":"slug",
              "reason":{
                "message":"E11000 duplicate key error collection: avnode.user index: slug_1 dup key: { : \""+put.slug+"\" }",
                "name":"MongoError",
                "stringValue":"\"Duplicate Key\"",
                "kind":"string",
                "value":null,
                "path":"slug"
              }
            };
            errors._message += "User validation failed"+"<br/>",
            errors.message += "E11000 duplicate key error collection: avnode.user index: slug_1 dup key: { : \""+put.slug+"\" }"+"<br/>",
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
                    "message": "E11000 duplicate key error collection: avnode.user index: crewslug_1 dup key: { : \""+put.crewslug+"\" }",
                    "name": "MongoError",
                    "stringValue":"\"Duplicate Key\"",
                    "kind":"Date",
                    "value":null,
                    "path":"crewslug",
                    "reason":{
                      "message":"E11000 duplicate key error collection: avnode.user index: crewslug_1 dup key: { : \""+put.crewslug+"\" }",
                      "name":"MongoError",
                      "stringValue":"\"Duplicate Key\"",
                      "kind":"string",
                      "value":null,
                      "path":"crewslug"
                    }
                  };
                  errors._message += "User validation failed"+"<br/>",
                  errors.message += "E11000 duplicate key error collection: avnode.user index: crewslug_1 dup key: { : \""+put.crewslug+"\" }"+"<br/>",
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

module.exports = router;
