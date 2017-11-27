const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const indexPlugin = require('../plugins/elasticsearch/User');
const Address = require('./Address');
const Link = require('./Link');
const fs = require('fs');
const https = require('https');
// const About = require('./About');

const userSchema = new Schema({
  slug: { type: String, unique: true },
  events: [{ type: Schema.ObjectId, ref: 'Event' }],
  crews: [{ type: Schema.ObjectId, ref: 'Crew' }],
  performances: [{ type: Schema.ObjectId, ref: 'Performance' }],
  galleries: [{ type: Schema.ObjectId, ref: 'Gallery' }],
  street_number: String,
  route: String,
  postal_code: String,
  locality: String,
  administrative_area_level_1: String,
  country: String,
  addresses: [Address],
  email: { type: String, unique: true },
  emails: [{
    email: String,
    is_public: { type: Boolean, default: false },
    is_primary: { type: Boolean, default: false },
    is_confirmed: { type: Boolean, default: false },
    mailinglists: [],
    confirm: String
  }],
  links: [Link],
  linkWeb: String,
  linkSocial: String,
  linkSocialType: String,
  linkPhone: String,
  linkMobile: String,
  linkSkype: String,
  stagename: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  image: { type: Schema.ObjectId, ref: 'Asset' },
  teaserImage: { type: Schema.ObjectId, ref: 'Asset' },
  file: { file: String },
  is_confirmed: { type: Boolean, default: false },
  confirm: String,
  tokens: Array,
  gender: String,
  name: String,
  surname: String,
  language: String, // BL TODO navigator or user.settings or subdomain language
  about: String, // BL for the frontend
  aboutlanguage: String, // BL for the frontend, issue #5, about default language is english
  abouts: [],
  citizenship: [], // BL TODO frontend, issue #5, modified, was a string
  roles: [], // BL TODO frontend, issue #5, array of roles
  activity: Number, // BL TODO frontend, issue #5, added
  connections: [], // BL TODO frontend, issue #5, added
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
  if (this.emails) {
    this.emails.forEach((email) => {
      if (email.is_public) {
        emails.push(email);
      }
    });
  }
  return emails;
});

userSchema.virtual('publicUrl').get(function () {
  return process.env.BASE + 'performers/' + this.slug;
});

userSchema.virtual('imageUrl').get(function () {
  let image = '/images/profile-default.svg';

  /* let serverPath;
  let localPath;
  let localFileName;
  let url; */

  if (this.image) {
    image = '/storage/' + this.image + '/512/200';
  }
  if (this.file && this.file.file) {
    /* serverPath = this.file.file;
    localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); //this.file.file.substr(19)
    localPath = serverPath.substring(1, serverPath.lastIndexOf('/'));
    if (fs.existsSync(localPath)) {

    } else {
      try {
        fs.mkdirSync(localPath);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          console.log(err);
        }
      }
    } 
    console.log('localFileName:' + localFileName + ' localPath:' + localPath); */
    image = 'https://bruce.avnode.net' + this.file.file;
    /* console.log(image);
    var file = fs.createWriteStream(localPath + '/' + localFileName);
    var request = https.get(image, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        console.log('The file was saved:' + image);

      });
    }); */

  }
  return image;
});

userSchema.pre('save', function save(next) {
  console.log('userSchema.pre(save) id:' + this._id);
  const user = this;
  console.log('userSchema.pre(save) name:' + JSON.stringify(user.name));
  console.log('userSchema.pre(save) user:' + JSON.stringify(user));
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
