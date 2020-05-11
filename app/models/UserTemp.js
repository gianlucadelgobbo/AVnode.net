const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');
const uid = require('uuid');

const adminsez = 'signup';

const userSchema = new Schema({
  createdAt: Date,
  crewname: { type: String, trim: true, minlength: 3, maxlength: 100 },
  crewslug: { type: String, trim: true, minlength: 3, maxlength: 100 },
  stagename: { type: String, trim: true, required: true, minlength: 3, maxlength: 100 },
  slug: { type: String, trim: true, required: true, minlength: 3, maxlength: 100 },
  birthday: { type: Date, required: true},
  lang: { type: String, required: true},
  email: { type: String, required: true, unique: true, trim: true },
  addresses: [{
    locality: { type: String, required: true },
    country: { type: String, required: true },
    geometry: { 
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
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
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      user.confirm = uid.v4();
      next();
    });
  });
});

const UserTemp = mongoose.model('UserTemp', userSchema);

module.exports = UserTemp;
