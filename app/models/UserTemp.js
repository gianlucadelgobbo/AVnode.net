const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Address = require('./shared/Address');

const bcrypt = require('bcrypt-nodejs');
const mailer = require('../utilities/mailer');
const uid = require('uuid');

const adminsez = 'signup';

const userSchema = new Schema({
  creation_date: Date,
  crewname: { type: String, minlength: 3, maxlength: 50 },
  stagename: { type: String, minlength: 3, maxlength: 50 },
  addresses: [Address],
  email: { type: String, unique: true },
  password: { type: String, minlength: 3, maxlength: 50 },
  confirm: String
}, {
  timestamps: true,
  collection: 'usertemp',
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: true
  }
});

userSchema.pre('save', function (next) {
  const user = this;
  console.log(process.env.BASE);
  console.log('userSchema.pre(save) id:' + this._id);
  console.log('userSchema.pre(save) name:' + JSON.stringify(user.name));
  //console.log('userSchema.pre(save) user:' + JSON.stringify(user.linkSocial));
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      user.confirm = uid.v4();
      console.log(user);
      mailer.sendEmail({
        template: 'confirm-email',
        message: {
          to: user.email
        },
        locals: {
          link: process.env.BASE+'verify/signup/' + user.confirm,
          stagename: user.stagename,
          email: user.email
        }
      }, next);
      next();
    });
  });
});

const UserTemp = mongoose.model('UserTemp', userSchema);

module.exports = UserTemp;
