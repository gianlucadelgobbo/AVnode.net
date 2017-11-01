const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const indexPlugin = require('../plugins/elasticsearch/User');
const Address = require('./Address');
const Link = require('./Link');
const About = require('./About');

const userSchema = new Schema({
  //slug: { type: String, unique: true },
  slug: String,
  events: [{ type : Schema.ObjectId, ref : 'Event' }],
  crews: [{ type : Schema.ObjectId, ref : 'Crew' }],
  performances: [{ type : Schema.ObjectId, ref : 'Performance' }],
  galleries: [{ type : Schema.ObjectId, ref : 'Gallery' }],  
  //email: { type: String, unique: true },
  email: String,
  //addresses: [Address],
  emails: [{
    email: String,
    is_public: {type: Boolean, default: false},
    is_primary: {type: Boolean, default: false},
    is_confirmed: { type: Boolean, default: false },
    mailinglists: [],
    confirm: String
  }],
  //links: [Link],
  //stagename: { type: String, unique: true },
  stagename: String,
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  image: {type:	Schema.ObjectId, ref: 'Asset'},
  teaserImage: {type:	Schema.ObjectId, ref: 'Asset'},
  is_confirmed: { type: Boolean, default: false },
  confirm: String,
  tokens: Array,
  gender: String,
  name: String,
  surname: String,
  language: String, // navigator or user.settings language
  about: String, // BL TODO frontend, issue #5, english default
  aboutlanguage: String, // BL TODO frontend, issue #5, about default language
  //abouts: [About], // BL TODO frontend, issue #5, multilang needed
  //citizenship: [], // BL TODO frontend, issue #5, modified, was a string
  //roles: [], // BL TODO frontend, issue #5, added, array of roles?
  activity: Number, // BL TODO frontend, issue #5, added
  //connections: [], // BL TODO frontend, issue #5, added
  birthday: Date
}, {
  timestamps: true,
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: true
  }
});

userSchema.virtual('birthdayFormatted').get(function () {
  return moment(this.birthday).format(process.env.DATEFORMAT);
});

userSchema.virtual('publicEmails').get(function () {
  let emails = [];
  this.emails.forEach((email) => {
    if (email.is_public) {
      emails.push(email);
    }
  });
  return emails;
});

userSchema.virtual('publicUrl').get(function () {
  return process.env.BASE + 'performers/' + this.slug;
});

userSchema.pre('save', function save(next) {
  console.log('userSchema.pre(save)');
  const user = this;
  console.log( JSON.stringify(user) );
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

userSchema.plugin(indexPlugin());

const User = mongoose.model('User', userSchema);

module.exports = User;
