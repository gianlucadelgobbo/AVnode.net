const router = require('./router')();
const uuid = require('uuid');

const mongoose = require('mongoose');
const UserTemp = mongoose.model('UserTemp');
const User = mongoose.model('User');
//const mailer = require('../utilities/mailer');
//const _slug = require('../utilities/slug');

let config = require('getconfig');

router.get('/:sez/:code', (req, res) => {
  if (req.user) {
    return res.redirect('/admin/profile/public');
  }
  if (req.params.sez == 'signup' && req.params.code) {
    UserTemp
    .findOne({confirm:req.params.code})
    .exec((err, data) => {
      console.log(data);
      if(data && data.id) {
        let user = new User();
        user.stagename = data.stagename;
        user.password = data.password;
        user.email = data.email;
        user.emails = [{
          email: data.email,
          is_public: false,
          is_primary: true,
          is_confirmed: true,
          mailinglists: {livevisuals: 1}
        }];
        is_crew = false;
        data.save((err) => {
          if (err) {
            console.log('err');
            res.render('signup_verify', {
              title: __('Signup verify'),
              err: err,
              data: data
            });
          } else {
            if (!data.crevname) {
              res.render('signup_verify', {
                title: __('Signup verify'),
                data: data
              });
            } else {
              let user = new User();
              user.stagename = data.crewname;
              is_crew = true;
              data.save((err) => {
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
            }
          }
        });
      }          
    });
  }
});

const logger = require('../utilities/logger');


router.post('/', (req, res) => {
  logger.debug('putData');
  let data = new UserTemp();
  let select = config.cpanel.signup.forms.signup.select;
  let put = {};
  for (const item in select) if(req.body[item]) put[item] = req.body[item];
  logger.debug(req.body);
  Object.assign(data, put);
  logger.debug(data);

  UserTemp.deleteMany({ email: data.email }, function (err) {
    data.save((err) => {
      if (err) {
        console.log('err');
        res.status(400).json(err);
      } else {
        select = Object.assign(config.cpanel.signup.forms.signup.select, config.cpanel.signup.forms.signup.selectaddon);
        let populate = config.cpanel.signup.forms.signup.populate;
  
        UserTemp
        .findById(data._id)
        .select(select)
        .populate(populate)
        .exec((err, data) => {
          if (err) {
            res.status(500).json({ error: `${JSON.stringify(err)}` });
          } else {
            if (!data) {
              res.status(204).json({ error: `DOC_NOT_FOUND` });
            } else {
              let send = {_id: data._id};
              for (const item in config.cpanel.signup.forms.signup.select) send[item] = data[item];
              res.json(send);
            }
          }
        });
      }
    });
    });
});
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
