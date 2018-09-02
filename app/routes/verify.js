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
    .exec((err, data) => {
      console.log(data);
      router.signupValidator(data, (data, errors) => {
        console.log('signupValidator CB');
        console.log(errors.errors);
        if (errors.message === "") {
          console.log('signupValidator CB');
          let user = new User();
          user.stagename = data.stagename;
          user.slug = data.slug;
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
              res.render('signup_verify', {
                title: __('Signup verify'),
                err: err,
                data: data
              });
            } else {
              if (!data.crewname) {
                res.render('signup_verify', {
                  title: __('Signup verify'),
                  data: data
                });
              } else {
                User
                .findOne({slug:data.slug})
                .exec((err, user) => {
                  let crew = new User();
                  crew.stagename = data.crewname;
                  crew.slug = data.crewslug;
                  crew.is_crew = true;
                  crew.members = [user._id];
                  crew.save((err) => {
                    if (err) {
                      console.log('err');
                      res.render('signup_verify', {
                        title: __('Signup verify'),
                        err: err,
                        data: data
                      });
                    } else {
                      User
                      .findOne({slug:data.crewslug})
                      .exec((err, crew) => {
                        user.crews = [crew._id];
                        user.save((err) => {
                          if (err) {
                            console.log('err');
                            res.render('signup_verify', {
                              title: __('Signup verify'),
                              err: err,
                              data: data
                            });
                          } else {
                            res.render('signup_verify', {
                              title: __('Signup verify'),
                              data: data
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
          res.render('signup_verify', {
            title: __('Signup verify'),
            err: errors,
            data: data
          });
        }
      });      
    });
  }
});


module.exports = router;
