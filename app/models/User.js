

const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const indexPlugin = require('../utilities/elasticsearch/User');

const MediaImage = require('./shared/MediaImage');
const About = require('./shared/About');
const Address = require('./shared/Address');
const AddressPrivate = require('./shared/AddressPrivate');
const Link = require('./shared/Link');
const OrganizationData = require('./shared/OrganizationData');

const bcrypt = require('bcrypt-nodejs');
const mailer = require('../utilities/mailer');
const uid = require('uuid');
const request = require('request');

const adminsez = 'profile';

const userSchema = new Schema({
  old_id: String,
  is_crew: Boolean,
  user_type : Number,
  activity: Number,
  is_public: Boolean,
  creation_date: Date,
  stats: {},

  slug: { type: String, unique: true, trim: true, required: true, minlength: 3, maxlength: 50 },
  stagename: { type: String, /*unique: true, TODO TO CHECK*/ required: [true, 'FIELD_REQUIRED'], minlength: [4, 'FIELD_TOO_SHORT'], maxlength: [50, 'FIELD_TOO_LONG'] },
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
        let confirmed_exists = false;
        for (let a=0; a<array.length ;a++) {
          if (array[a].is_confirmed) confirmed_exists = array[a].is_confirmed;
        }
        return confirmed_exists;
      }, msg: 'EMAILS_NO_CONFIRMED'
    },{
      validator : function(array) {
        let primary_exists = false;
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
  crews: [{ type: Schema.ObjectId, ref: 'Crew' }],
  members: [{ type: Schema.ObjectId, ref: 'User' }],
  performances: [{ type: Schema.ObjectId, ref: 'Performance' }],
  events: [{ type: Schema.ObjectId, ref: 'Event' }],
  galleries: [{ type: Schema.ObjectId, ref: 'Gallery' }],
  videos: [{ type: Schema.ObjectId, ref: 'Video' }],
  partnerships : [{ type: Schema.ObjectId, ref: 'User' }],
  footage : [{ type: Schema.ObjectId, ref: 'Footage' }],
  playlists : [{ type: Schema.ObjectId, ref: 'Playlist' }],
  news : [{ type: Schema.ObjectId, ref: 'News' }],

  roles: [],
  connections: [],

  // Organization Extra Data
  organizationData: [OrganizationData],

  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  is_confirmed: { type: Boolean, default: false },
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

/*
userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.image;
  return obj;
}
userSchema.virtual('crews', {
  ref: 'User',
  localField: '_id',
  foreignField: '_id'
}); */

// Crews only



/* BL FIXME later for crews
userSchema.pre('remove', function(next) {
  const crew = this;
  crew.model('User').update(
    { $pull: { crews: crew._id } },
    next
  );
});

userSchema.virtual('publicUrl').get(function () {
  if (this.slug) return `/${this.slug}`;
});
userSchema.virtual('editUrl').get(function () {
  if (this.slug) {
    if (this.is_crew) {
      return `/admin/crew/${this.slug}`;
    } else {
      return `/admin/${this.slug}`;
    } 
  } 
});
userSchema.path('slug').validate(function(n) {
  //return !!n && n.length >= 3 && n.length < 25;
  return !n=='gianlucadelgobbo';
}, 'Invalid Slug');
*/

userSchema.virtual('birthdayFormatted').get(function () {
  if (this.birthday) {
    const lang = global.getLocale();
    moment.locale(lang);
    return moment(this.birthday).format(config.dateFormat[lang].single);
  }
});

// Return thumbnail
userSchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.image);
  if (this.image && this.image.file) {
    for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
      imageFormats[format] = config.cpanel[adminsez].forms.image.components.image.config.sizes[format].default;
    }
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/users_originals/', '/warehouse/users/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
      imageFormats[format] = `${localPath}/${config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
    }
  } else {
    for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
      imageFormats[format] = `${config.cpanel[adminsez].forms.image.components.image.config.sizes[format].default}`;
    }
  }
  return imageFormats;
});
/*
userSchema.virtual('teaserImageFormats').get(function () {
  let teaserImageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.teaserImage);
  if (this.teaserImage && this.teaserImage.file) {
    for(let format in config.cpanel[adminsez].media.teaserImage.sizes) {
      teaserImageFormats[format] = config.cpanel[adminsez].media.teaserImage.sizes[format].default;
    }
    const serverPath = this.teaserImage.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/warehouse/', process.env.WAREHOUSE+'/warehouse/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    for(let format in config.cpanel[adminsez].media.teaserImage.sizes) {
      teaserImageFormats[format] = `${localPath}/${config.cpanel[adminsez].media.teaserImage.sizes[format].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
    }
  } else {
    for(let teaserFormat in config.cpanel[adminsez].media.teaserImage.sizes) {
      teaserImageFormats[teaserFormat] = `${config.cpanel[adminsez].media.teaserImage.sizes[teaserFormat].default}`;
    }
  }
  return teaserImageFormats;
});
*/
userSchema.pre('save', function (next) {
  console.log('userSchema.pre(save) id:' + this._id);
  const user = this;
  console.log(process.env.BASE);
  let errors = [];
  let conta = 0;
  if (user.emails && !user.is_crew) {
    for(let item=0;item<user.emails.length;item++) {
      if (!user.emails[item].is_confirmed) this.emails[item].confirm = uid.v4();
      User.find({"_id":{$ne: user._id}, $or: [{"emails.email": user.emails[item].email, "email": user.emails[item].email}]}).
      select({_id: 1}).
      limit(100).
      exec((err, data) => {
        console.log("MAIL EXISTS?");
        console.log(user.emails[item].email);
        console.log(err);
        console.log(user._id);
        console.log(data);
        conta++;
        if (err) { return next(err); }
        if (data.length) {
          user.emails[item].error = "Email in use";
          errors.push({email: user.emails[item].email,error: "Email in use"});
          console.log("Email in use");
          if (conta === user.emails.length) console.log("FINISCHED");
          if (conta === user.emails.length) console.log(errors);
          if (conta === user.emails.length) return next(errors);
        } else {
          console.log("Email OK");
          let mailinglists = [];
          for (mailinglist in user.emails[item].mailinglists) if (user.emails[item].mailinglists[mailinglist]) mailinglists.push(mailinglist);
    
          let formData = {
            list: 'AXRGq2Ftn2Fiab3skb5E892g',
            email: user.emails[item].email,
            Topics: mailinglists.join(','),
            avnode_id: user._id.toString(),
            flxer_id: user.old_id ? user.old_id : "avnode",
          };
          if (user.name) formData.Name = user.name;
          if (user.surname) formData.Surname = user.surname;
          if (user.stagename) formData.Stagename = user.stagename;
          if (user.addresses && user.addresses[0] && user.addresses[0].locality) formData.Location = user.addresses[0].locality;
          if (user.addresses && user.addresses[0] && user.addresses[0].country) formData.Country = user.addresses[0].country;
          if (user.addresses && user.addresses[0] && user.addresses[0].geometry && user.addresses[0].geometry.lat) formData.LATITUDE = user.addresses[0].geometry.lat;
          if (user.addresses && user.addresses[0] && user.addresses[0].geometry && user.addresses[0].geometry.lng) formData.LONGITUDE = user.addresses[0].geometry.lng;
    
          request.post({
            url: 'https://ml.avnode.net/subscribe',
            formData:formData,
            function (error, response, body) {
              console.log("Newsletter");
              console.log(error);
              console.log(body);
            }
          });
          //console.log(mailinglists.join(','));
    
          if (!user.emails[item].is_confirmed) {
            console.log("sendEmailConfirm");
            //console.log(user.emails[item].email);
            mailer.sendEmailConfirm({
              template: 'confirm-email',
              message: {
                to: user.emails[item].email
              },
              locals: {
                link: '/verify/email/',
                stagename: user.stagename,
                email: user.email,
                confirm: this.emails[item].confirm
              }
            }, function (err){
              if (err) {
                errors.push({email: user.emails[item].email,error: "Email sending failure"});
                console.log("Email sending failure");
                if (conta === user.emails.length) console.log("FINISCHED");
                if (conta === user.emails.length) console.log(errors);
                if (conta === user.emails.length) return next(errors);
              } else {
                console.log("Email sending OK");
                if (conta === user.emails.length) console.log("FINISCHED");
                if (conta === user.emails.length) console.log(errors);
                if (conta === user.emails.length) return next(errors);
              }
            });
          } else {
            if (conta === user.emails.length) console.log("FINISCHED");
            if (conta === user.emails.length) console.log(errors);
              if (conta === user.emails.length) return next(errors);
          }
        }
      });
    }
    next();
  }
  if (!user.isModified('password')) { return next(); }
  console.log('userSchema.pre(save) id:' + this._id);
  console.log('userSchema.pre(save) name:' + JSON.stringify(user.name));
  //console.log('userSchema.pre(save) user:' + JSON.stringify(user.linkSocial));
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
  next();
});


userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    console.log('userSchema comparePassword:' + candidatePassword + ' p: ' + this.password);
    cb(err, isMatch);
  });
};

userSchema.plugin(indexPlugin());

const User = mongoose.model('User', userSchema);

module.exports = User;
