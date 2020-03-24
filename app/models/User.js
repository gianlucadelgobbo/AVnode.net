const config = require('getconfig');
const mongoose = require('mongoose');
const request = require('request');
const axios = require('axios')

const Schema = mongoose.Schema;
const moment = require('moment');
const indexPlugin = require('../utilities/elasticsearch/User');
const uniqueValidator = require('mongoose-unique-validator');

const MediaImage = require('./shared/MediaImage');
const About = require('./shared/About');
const Address = require('./shared/Address');
const AddressPrivate = require('./shared/AddressPrivate');
const Link = require('./shared/Link');
const OrganizationData = require('./shared/OrganizationData');

const bcrypt = require('bcrypt-nodejs');

const adminsez = 'profile';

const hasNumber = (str) => /\d/.test(str);
const hasLowerCase = (str) => /[a-z]/.test(str);
const hasUpperCase = (str) => /[A-Z]/.test(str);

const userSchema = new Schema({
  old_id: String,
  is_crew: Boolean,
  is_partner: Boolean,
  partner_owner: [{
    "owner": { type: Schema.ObjectId, ref: 'User' },
    "delegate": String,
    "is_selecta": Boolean,
    "is_satellite": Boolean,
    "is_event": Boolean,
    "is_active": Boolean
    }],
  partner_data: {},
  user_type : Number,
  activity: Number,
  activity_as_performer: Number,
  activity_as_organization: Number,
  is_public: Boolean,
  createdAt: Date,
  stats: {
    crews: Number,
    members: Number,
    events: Number,
    partnerships: Number,
    performances: Number,
    learnings: Number,
    galleries: Number,
    videos: Number,
    'lights-installation': Number,
    mapping: Number,
    'vj-set': Number,
    workshop: Number,
    'av-performance': Number,
    'project-showcase': Number,
    'dj-set': Number,
    'video-installation': Number,
    footage: Number,
    playlists: Number,
    news: Number,
    lecture: Number,
    recent:{ 
      performances: Number,
      learnings: Number,
      events: Number,
      news: Number,
      partnerships: Number,
      footage: Number,
      playlists: Number,
      videos: Number,
      galleries: Number,
      news: Number
    },
    visits: Number
  },
  likes: {},

  slug: { type: String, unique: true, trim: true, required: true, minlength: 3, maxlength: 50 },
  stagename: { type: String, /*unique: true, TODO TO CHECK*/ required: [true, 'FIELD_REQUIRED'], minlength: [3, 'FIELD_TOO_SHORT'], maxlength: [50, 'FIELD_TOO_LONG'] },
  addresses: [Address],
  abouts: [About],
  web: [Link],
  social: [Link],

  image: MediaImage,

  name: { type: String, trim: true, maxlength: 50 },
  surname: { type: String, trim: true, maxlength: 50 },
  gender: { type: String, trim: true, enum: ['M', 'F', 'Other'] },
  lang: { type: String, trim: true, required: function() { return !this.is_crew; }},
  birthday: { type: Date, required: function() { return !this.is_crew; }},
  citizenship: [],
  addresses_private: [AddressPrivate],
  phone: [Link],
  mobile: [Link],
  skype: [Link],

  email: { type: String, trim: true, index: true, unique: true, sparse: true, required: function() { return this.is_crew === false ? "EMAIL_IS_REQUIRED" : false; } },
  emails: {
    type     : [{
      email: {
        type: String,
        trim: true, 
        index: true, 
      /*  unique: true, */
        sparse: true,
        required: function() { return this.is_crew === false ? "EMAIL_IS_REQUIRED" : false; },
        validate: [(email) => {
          var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return re.test(email)
        }, 'EMAIL_IS_NOT_VALID']
      },
      stored: { type: Boolean, default: true },
      is_public: { type: Boolean, default: false },
      is_primary: { type: Boolean, default: false },
      is_confirmed: { type: Boolean, default: false },
      mailinglists: {},
      confirm: String
    }],
    required : function() { return this.is_crew === false ? "EMAIL_IS_REQUIRED" : false; },
    sparse: true,
    validate : [{
      validator : function(array) {
        let confirmed_exists = this.is_crew;
        for (let a=0; a<array.length ;a++) {
          if (array[a].is_confirmed) confirmed_exists = array[a].is_confirmed;
        }
        return confirmed_exists;
      }, msg: 'EMAILS_NO_CONFIRMED'
    },{
      validator : function(array) {
        let primary_exists = this.is_crew;
        for (let a=0; a<array.length ;a++) {
          if (array[a].is_primary) primary_exists = array[a].is_primary;
        }
        return primary_exists;
      }, msg: 'EMAILS_NO_PRIMARY'
    },{
      validator : function(array) {
        return true;
      }, msg: 'uh oh'
    }]
  },
  categories: [{ type: Schema.ObjectId, ref: 'Category' }],
  crews: [{ type: Schema.ObjectId, ref: 'User' }],
  members: [{ type: Schema.ObjectId, ref: 'User' }],
  performances: [{ type: Schema.ObjectId, ref: 'Performance' }],
  events: [{ type: Schema.ObjectId, ref: 'Event' }],
  galleries: [{ type: Schema.ObjectId, ref: 'Gallery' }],
  videos: [{ type: Schema.ObjectId, ref: 'Video' }],
  partnerships : [{type: Schema.ObjectId, ref: 'Event' }],
/*   partnerships : [{
    category: { type: Schema.ObjectId, ref: 'Category' },
    events: [{ type: Schema.ObjectId, ref: 'EventShow' }]
  }], */
  footage : [{ type: Schema.ObjectId, ref: 'Footage' }],
  playlists : [{ type: Schema.ObjectId, ref: 'Playlist' }],
  news : [{ type: Schema.ObjectId, ref: 'News' }],

  roles: [],
  connections: [],

  // Organization Extra Data
  organizationData: {contacts:[]},

  flxermigrate: { type: Boolean, default: false },
  password: {
    type: String,
    validate: [{
      validator : function(password) {
        return this.flxermigrate || (password && password.length > 7);
      }, msg: "Password is too shorth, the minimum length is 8 characters. Try again..." //'INVALID_PASSWORD_LENGTH'
    },
    {
      validator : function(password) {
        return this.flxermigrate || (hasNumber(password) && hasLowerCase(password) && hasUpperCase(password));
      }, msg: "Password is not valid, have to contain at least 1 number, 1 lower case and 1 uppercase characters. Try again..." //'INVALID_PASSWORD_CHR'
    }]
  },
  newpassword: String,
  oldpassword: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  is_confirmed: { type: Boolean, default: false },
  is_pro: { type: Boolean, default: false },
  is_admin: { type: Boolean, default: false },
  confirm: String
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
  if (this.birthday) {
    const lang = global.getLocale();
    return moment(this.birthday).format(config.dateFormat[lang].weekdaydaymonthyear);
  }
});

// Return thumbnail
userSchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
    imageFormats[format] = process.env.WAREHOUSE+config.cpanel[adminsez].forms.image.components.image.config.sizes[format].default;
  }
  if (this.image && this.image.file) {
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/users_originals/', '/warehouse/users/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE+localPath+"/"+config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder+"/"+localFileNameWithoutExtension+"_"+localFileNameExtension+".jpg";
    }
  }
  return imageFormats;
});

userSchema.pre('validate', function (next) {
  let user = this;
  if ((user.oldpassword || user.oldpassword === "") && (user.newpassword || user.newpassword === "")) {
    user.comparePassword(user.oldpassword, (err, isMatch) => {
      if (err) return next(err);
      if (isMatch) {
        user.password = user.newpassword;
        user.set("oldpassword", undefined, {strict: false});
        user.set("newpassword", undefined, {strict: false});
        next();
      } else {
        var err = {
          errors: {
            oldpassword: {
              message: 'INVALID_PASSWORD',
              name: 'ValidatorError',
              kind: 'user defined',
              path: 'oldpassword',
              value: user.oldpassword,
              reason: undefined,
              '$isValidatorError': true
            }
          },
          _message: 'User validation failed',
          name: 'ValidationError'
        };
        next(err);
      }
    });
  } else {
    next();
  }
});
userSchema.pre('save', function (next) {
  if (this.crews) {
    this.stats.crews = this.crews.length;
  }
  if (this.members && this.members.length) {
    if (this.stats) this.stats.members = this.members.length;
    let addressesO = {};
    for(let a=0;a<this.members.length;a++)
      if (this.members[a].addresses && this.members[a].addresses.length)
        for(let b=0;b<this.members[a].addresses.length;b++) 
          if (!addressesO[this.members[a].addresses[b].locality+this.members[a].addresses[b].country]) addressesO[this.members[a].addresses[b].locality+this.members[a].addresses[b].country] = this.members[a].addresses[b]
    let addresses = Object.values(addressesO);
    if (addresses.length) this.addresses = addresses;
    next();
  } else {
    next();
  }
});

userSchema.pre('save', function (next) {
  let user = this;
  if (!user.isModified('password') || user.hashed) { if (user.hashed) delete user.hashed; return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.pre('save', function (next) {
  if (this.emails && this.emails.length && !this.is_crew) {
    let query = { _id:{$ne:this._id}, $or : [] };
    for (let item=0 ;item< this.emails.length; item++) {
      query.$or.push({ "email" : this.emails[item].email });
      query.$or.push({ "emails.email" : this.emails[item].email })
    }
    User.findOne(query,'_id', (err, user) => {
      if (!user){
          next();
      }else{                
          const err = {
            "message": "EMAIL IS NOT YOUR",
            "name": "MongoError",
            "stringValue":"\"EMAIL IS NOT YOUR\"",
            "kind":"Email",
            "value":null,
            "path":"email",
            "reason":{
              "message":"EMAIL IS NOT YOUR",
              "name":"MongoError",
              "stringValue":"\"EMAIL IS NOT YOUR\"",
              "kind":"string",
              "value":null,
              "path":"email"
            }
          };
          next(err);
      }
    });
  } else {
    next();
  }
});
userSchema.pre('save', function (next) {
  if (this.emails && this.emails.length) {
    const emailwithmailinglists = this.emails.filter(item => item.mailinglists)
    if (emailwithmailinglists.length>0) {
      let conta = 0;
      for (let item=0 ; item<emailwithmailinglists.length;item++) {
        let mailinglists = [];
        for (mailinglist in this.emails[item].mailinglists) if (this.emails[item].mailinglists[mailinglist]) mailinglists.push(mailinglist);
        let formData = {
          list: 'AXRGq2Ftn2Fiab3skb5E892g',
          email: this.emails[item].email,
          Topics: mailinglists.join(','),
          avnode_id: this._id.toString(),
          avnode_slug: this.slug,
          avnode_email: this.email,
          boolean: true
        };
        if (this.old_id) formData.flxer_id = this.old_id;
        if (this.name) formData.name = this.name;
        if (this.surname) formData.Surname = this.surname;
        if (this.stagename) formData.Stagename = this.stagename;
        if (this.addresses && this.addresses[0] && this.addresses[0].locality) formData.Location = this.addresses[0].locality;
        if (this.addresses && this.addresses[0] && this.addresses[0].country) formData.Country = this.addresses[0].country;
        if (this.addresses && this.addresses[0] && this.addresses[0].geometry && this.addresses[0].geometry.lat) formData.LATITUDE = this.addresses[0].geometry.lat;
        if (this.addresses && this.addresses[0] && this.addresses[0].geometry && this.addresses[0].geometry.lng) formData.LONGITUDE = this.addresses[0].geometry.lng;

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
            conta++;
            if (conta== emailwithmailinglists.length) next();
          });
          res.on('error', function (err) {
            if (conta== emailwithmailinglists.length) next();
          })
        });
        
        // req error
        req.on('error', function (err) {
          console.log(err);
        });
        
        //send request witht the postData form
        req.write(postData);
        req.end();
      } 
    } else {
      next();
    }
  } else {
    next();
  }
});
userSchema.pre('save', function (next) {
  if (this.emails && this.emails.length) {
    if (this.emails.filter(item => item.is_primary).length===0) {
      const err = {
        "message": "MISSING ONE PRIMARY EMAIL",
        "name": "MongoError",
        "stringValue":"\"MISSING ONE PRIMARY EMAIL\"",
        "kind":"Email",
        "value":null,
        "path":"email",
        "reason":{
          "message":"MISSING ONE PRIMARY EMAIL",
          "name":"MongoError",
          "stringValue":"\"MISSING ONE PRIMARY EMAIL\"",
          "kind":"string",
          "value":null,
          "path":"email"
        }
      };
      next(err);
    } else if (this.emails.filter(item => item.is_primary).length>1) {
      const err = {
        "message": "ONLY ONE EMAIL CAN BE PRIMARY",
        "name": "MongoError",
        "stringValue":"\"ONLY ONE EMAIL CAN BE PRIMARY\"",
        "kind":"Email",
        "value":null,
        "path":"email",
        "reason":{
          "message":"ONLY ONE EMAIL CAN BE PRIMARY",
          "name":"MongoError",
          "stringValue":"\"ONLY ONE EMAIL CAN BE PRIMARY\"",
          "kind":"string",
          "value":null,
          "path":"email"
        }
      };
      next(err);
    } else if (this.emails.filter(item => item.is_primary).length===1) {
      this.email = this.emails.filter(item => item.is_primary)[0].email;
      next();
    } else {
      next();
    }
  } else {
    next();
  }
});

/*userSchema.virtual('originalpassword').get(function () {
  return this.password;
});*/

userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

//userSchema.plugin(indexPlugin());
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
