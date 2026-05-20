import config from 'getconfig';
import mongoose from 'mongoose';
import Address from './shared/Address.js';
const Schema = mongoose.Schema;


import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const setIdentifier = () => {
  return uuidv4();
};
const hasNumber = (str) => /\d/.test(str);
const hasLowerCase = (str) => /[a-z]/.test(str);
const hasUpperCase = (str) => /[A-Z]/.test(str);

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
  addresses: [Address],
  password: {
    type: String,
    validate: [{
      validator : function(password) {
        return password && password.length > 7;
      }, msg: "Password is too shorth, the minimum length is 8 characters. Try again..." //'INVALID_PASSWORD_LENGTH'
    },
    {
      validator : function(password) {
        return hasNumber(password) && hasLowerCase(password) && hasUpperCase(password);
      }, msg: "Password is not valid, have to contain at least 1 number, 1 lower case and 1 uppercase characters. Try again..." //'INVALID_PASSWORD_CHR'
    }]
  },
  privacy: { type: Date },
  terms: { type: Date },
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
userSchema.post('save', function(error, doc, next) {
  next(error);
});

userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      user.confirm = setIdentifier();
      next();
    });
  });
});

const UserTemp = mongoose.model('UserTemp', userSchema);

export default UserTemp;
