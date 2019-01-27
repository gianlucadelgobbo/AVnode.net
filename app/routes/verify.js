const router = require('./router')();
const request = require('request');

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
            user.hashed = true;
            user.lang = data.lang;
            user.birthday = data.birthday;
            user.addresses = [ { geometry: data.addresses[0].geometry, locality: data.addresses[0].locality, country: data.addresses[0].country } ];
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
            console.log('user');
            console.log(user);
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
                  router.updateSendy(user, user.email, (err) => {
                    UserTemp.deleteMany({ confirm:req.params.code }, function (err) {
                      res.render('verify/signup', {
                        title: __('Signup verify'),
                        data: data
                      });
                    });
                  });
                } else {
                  console.log('Create crew');
                  User
                  .findOne({slug:data.slug})
                  .exec((err, uuuu) => {
                    let crew = new User();
                    crew.stagename = data.crewname;
                    crew.slug = data.crewslug;
                    crew.addresses = data.addresses;
                    crew.is_crew = true;
                    crew.members = [uuuu];
                    crew.stats = {members: 1},
                    /* crew.emails = [{
                      is_primary: true,
                      is_confirmed: true
                    }]; */
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
                              router.updateSendy(user, user.email, (err) => {
                                UserTemp.deleteMany({ confirm:req.params.code }, function (err) {
                                  res.render('verify/signup', {
                                    title: __('Signup verify'),
                                    data: data
                                  });
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
  if (req.params.sez == 'email' && req.params.code) {
    User
    .findOne({"emails.confirm":req.params.code})
    .select({emails: 1})
    .exec((err, user) => {
      if (user) {
        for(let item=0;item<user.emails.length;item++) {
          if (user.emails[item].confirm === req.params.code) {
            var sendyemail = user.emails[item].email;
            user.emails[item].is_confirmed = true;
            user.emails[item].mailinglists = { livevisuals: 1 };
            //delete user.emails[item].confirm;
          }
        }
        user.save((err) => {
          if (err) {
            res.render('verify/email', {
              title: __('Email verify'),
              err: true,
            });
          } else {
            router.updateSendy(user, sendyemail, (err) => {
              if (req.user) {
                req.flash('success', { msg: __('Email verificated with success.') });
                res.redirect('/admin/profile/emails');
              } else {
                res.render('verify/email', {
                  title: __('Email verify'),
                  err: false,
                });  
              }
            });
          }
        });  
      } else {
        res.render('verify/email', {
          title: __('Email verify'),
          err: true,
        });
      }
    });
  }
});

router.updateSendy = (user, email, cb) => {
  let formData = {
    list: 'AXRGq2Ftn2Fiab3skb5E892g',
    email: email,
    Topics: "flxer,livevisuals",
    avnode_id: user._id.toString(),
    avnode_slug: user.slug,
    avnode_email: user.email,
    boolean: true
  };
  if (user.name) formData.Name = user.name;
  if (user.surname) formData.Surname = user.surname;
  if (user.stagename) formData.Stagename = user.stagename;
  if (user.addresses && user.addresses[0] && user.addresses[0].locality) formData.Location = user.addresses[0].locality;
  if (user.addresses && user.addresses[0] && user.addresses[0].country) formData.Country = user.addresses[0].country;
  if (user.addresses && user.addresses[0] && user.addresses[0].geometry && user.addresses[0].geometry.lat) formData.LATITUDE = user.addresses[0].geometry.lat;
  if (user.addresses && user.addresses[0] && user.addresses[0].geometry && user.addresses[0].geometry.lng) formData.LONGITUDE = user.addresses[0].geometry.lng;
  console.log("formData request.post");
  console.log(formData);

  var https = require('https');
  var querystring = require('querystring');
  
  // form data
  var postData = querystring.stringify(formData);
  
  // request option
  var options = {
    host: 'ml.avnode.net',
    port: 443,
    method: 'POST',
    path: '/subscribe',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };
  
  // request object
  var req = https.request(options, function (res) {
    var result = '';
    res.on('data', function (chunk) {
      result += chunk;
    });
    res.on('end', function () {
      cb();
    });
    res.on('error', function (err) {
      cb(error);
    })
  });
  
  // req error
  req.on('error', function (err) {
    console.log(err);
  });
  
  //send request witht the postData form
  req.write(postData);
  req.end();
  
/*   request.post({
    url: 'https://ml.avnode.net/subscribe',
    form: formData,
    function (error, response, body) {
      console.log("Newsletter");
      console.log(error);
      console.log(body);
      cb(error);
    }
  }); */
}

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
