const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');
const uid = require('uuid');

const adminsez = 'signup';

const userSchema = new Schema({
  creation_date: Date,
  crewname: { type: String, trim: true, minlength: 3, maxlength: 50 },
  crewslug: { type: String, unique: true, trim: true, minlength: 3, maxlength: 50 },
  stagename: { type: String, trim: true, required: true, minlength: 3, maxlength: 50 },
  slug: { type: String, unique: true, trim: true, required: true, minlength: 3, maxlength: 50 },
  birthday: { type: Date, required: true},
  email: { type: String, required: true, unique: true, trim: true },
  addresses: [{
    locality: { type: String, required: true },
    country: { type: String, required: true },
    geometry: { type: String, required: true }
  }],
  password: { type: String, required: true, minlength: 3, maxlength: 50 },
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
  console.log(user);
  //console.log('userSchema.pre(save) user:' + JSON.stringify(user.linkSocial));
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      user.confirm = uid.v4();
      console.log(user);
      next();
    });
  });
});

const UserTemp = mongoose.model('UserTemp', userSchema);

module.exports = UserTemp;
