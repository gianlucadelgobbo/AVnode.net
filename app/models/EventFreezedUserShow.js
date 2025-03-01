import config from 'getconfig';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import moment from 'moment';
//const indexPlugin from '../utilities/elasticsearch/User.js';
//const async from 'async';
//const imageUtil from '../utilities/image.js';
import helpers from '../utilities/helpers.js';
import truncatise from 'truncatise';

import MediaImage from './shared/MediaImage.js';
import Address from './shared/Address.js';
import About from './shared/About.js';
import Link from './shared/Link.js';
import OrganizationData from './shared/OrganizationData.js';

const adminsez = 'profile';

const userSchema = new Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user_original: { type: mongoose.Schema.Types.ObjectId, ref: 'UserShow', required: true },

  is_crew: Boolean,
  is_partner: Boolean,
  /* partner_owner: [{
    "owner": { type: Schema.ObjectId, ref: 'User' },
    "delegate": String,
    "is_selecta": Boolean,
    "is_satellite": Boolean,
    "is_event": Boolean,
    "is_active": Boolean
  }],
  partners: [{
    "partner": { type: Schema.ObjectId, ref: 'User' },
    "delegate": String,
    "categories": [{ type: Schema.ObjectId, ref: 'Category' }],
    "is_selecta": {type: Boolean, default: false},
    "is_satellite": {type: Boolean, default: false},
    "is_event": {type: Boolean, default: false},
    "is_active": {type: Boolean, default: false}
  }], */
  /* partner_owner: [{ type: Schema.ObjectId, ref: 'User' }],
  partners: [{ type: Schema.ObjectId, ref: 'User' }], */
  /* partner_data: {},
  user_type : Number,
  activity: Number, // BL TODO frontend, issue #5, added
  activity_as_performer: Number,
  activity_as_organization: Number, */
  hide_members: { type: Boolean, default: false },

  stagename: { type: String, trim: true, required: [true, 'STAGE_NAME_IS_REQUIRED'], minlength: [1, 'STAGE_NAME_IS_TOO_SHORT'], maxlength: [100, 'STAGE_NAME_IS_TOO_LONG'] },
  slug: { type: String, trim: true, required: [true, 'PROFILE_URL_IS_REQUIRED'], minlength: [1, 'PROFILE_URL_IS_TOO_SHORT'], maxlength: [100, 'PROFILE_URL_IS_TOO_LONG'] ,
    validate: [(slug) => {
      var re = /^[a-z0-9-_]+$/;
      return re.test(slug)
    }, 'PROFILE_URL_IS_NOT_VALID']
  },
  email: { type: String, /*unique: true TODO TO CHECK*/ },
  image: MediaImage,
  teaserImage: MediaImage,
//  file: { file: String },
  name: String,
  surname: String,
  gender: String,
  lang: String, // BL TODO navigator or user.settings or subdomain language
  is_public: { type: Boolean, default: true },
  createdAt: Date,

  birthday: Date,
  citizenship: [], // NEW

  emails: [{
    email: String,
    is_public: { type: Boolean, default: false },
    is_primary: { type: Boolean, default: false },
    is_confirmed: { type: Boolean, default: false },
    mailinglists: {},
    confirm: String
  }],
  addresses: [Address],
  abouts: [About],
  web: [Link],
  social: [Link],
  phone: [Link],
  mobile: [Link],
  skype: [Link],
  categories: [{ type: Schema.ObjectId, ref: 'Category' }],
  crews: [{ type: Schema.ObjectId, ref: 'UserShow' }],
  members: [{ type: Schema.ObjectId, ref: 'UserShow' }],
  performances: [{ type: Schema.ObjectId, ref: 'Performance' }],
  events: [{ type: Schema.ObjectId, ref: 'Event' }],
  galleries: [{ type: Schema.ObjectId, ref: 'Gallery' }],
  videos: [{ type: Schema.ObjectId, ref: 'Video' }],
  partnerships : [{type: Schema.ObjectId, ref: 'EventShow' }],
/*   partnerships : [{
    category: { type: Schema.ObjectId, ref: 'Category' },
    events: [{ type: Schema.ObjectId, ref: 'EventShow' }]
  }], 
  footage : [{ type: Schema.ObjectId, ref: 'Footage' }],
  playlists : [{ type: Schema.ObjectId, ref: 'Playlist' }],*/
  news : [{ type: Schema.ObjectId, ref: 'News' }],
  pages: [],
  /* A todo
  videos : [{ type: Schema.ObjectId, ref: 'Gallery' }],
  */

  roles: [], // BL TODO frontend, issue #5, array of roles
  connections: [], // BL TODO frontend, issue #5, added
  // Organization Extra Data
  organizationData: {},

  /* password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  is_confirmed: { type: Boolean, default: false },
  is_pro: { type: Boolean, default: false },
  is_admin: { type: Boolean, default: false },
  is_banned: { type: Boolean, default: false },
  confirm: String,
  tokens: Array */
}, {
  timestamps: true,
  collection: 'event_freezed_users',
  toObject: {
    virtuals: true // BL FIXME check http://mongoosejs.com/docs/api.html#schema_Schema-virtual
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret, options) => {
      delete ret.id;
      delete ret.image;
      delete ret.abouts;
      delete ret.__v;
      //delete ret._id;
    }
  }
});

/*
userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.image;
  return obj;
}
userSchema.virtual('crews', {
  ref: 'UserShow',
  localField: '_id',
  foreignField: '_id'
}); */

// Crews only

/* userSchema.virtual('learnings', {
  ref: "Performance",
  foreignField: '_id',
  localField: 'performances',
  justOne: false,
  options: { 
    //"match": { "is_public": true, "type": {"$in":["5be8708afc39610000000099", "5be8708afc396100000001a1", "5be8708afc3961000000011c"]}},
    limit: 21
  }
}).get(function () {
  if (this.performances) {
    return this.performances;
  }
}); */

userSchema.virtual('publicEmails').get(function () {
  let emails = [];
  if (this.emails && this.emails.length) {
    this.emails.forEach((email) => {
      if (email.is_public) {
        emails.push(email.email);
      }
    });
    if (emails.length) {
      return emails;
    }
  }
});

userSchema.virtual('addressesFormatted').get(function () {
  let addresses = {};
  let addressesFormatted = [];
  if (this.addresses && this.addresses.length) {
    this.addresses.forEach((address) => {
      if (address && address.country) {
        if (!addresses[address.country.trim()]) addresses[address.country.trim()] = [];
        if (address.locality && addresses[address.country.trim()].indexOf(address.locality)===-1) addresses[address.country.trim()].push(address.locality.trim());
      }
    });
    for(let country in addresses) {
      addressesFormatted.push(" <b itemprop='addressCountry'>"+country+"</b> <span itemprop='addressLocality'>"+addresses[country].join(", ")+"</span>");
    }
    return addressesFormatted/* .join(", ") */;
  }
});

userSchema.virtual('about').get(function (req) {
  let about = this.$locals.__('Text is missing');
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === $locals.locale);

    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      aboutA = this.abouts.filter(item => item.lang === "en");
      if (aboutA.length && aboutA[0].abouttext) {
        about = "["+this.$locals.__("Text available only in English")+"] "+aboutA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    var options = {
      TruncateLength: 80,
      TruncateBy : "words",
      Strict : true,
      StripHTML : false,
    };
    let str = about;
    str = str.replace(new RegExp(/\n/gi)," <br />"); 

    str = helpers.linkify(str);

    str = truncatise(str, options);
  
    return str;
  }
});


userSchema.virtual('aboutFull').get(function (req) {
  let about = this.$locals.__('Text is missing');
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === $locals.locale);
    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      aboutA = this.abouts.filter(item => item.lang === "en");
      if (aboutA.length && aboutA[0].abouttext) {
        about = "["+this.$locals.__("Text available only in English")+"] "+aboutA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    var options = {
      TruncateLength: 4000000000,
      TruncateBy : "words",
      Strict : true,
      StripHTML : false,
    };
    about = truncatise(about, options);
    
    var options = {
      TruncateLength: 40,
      TruncateBy : "words",
      Strict : true,
      StripHTML : false,
    };
    let str = about;

    str = str.replace(new RegExp(/\n/gi)," <br />"); 

    str = helpers.linkify(str);
    //str = str.replace(new RegExp(/<br \/><br \/>+/gi), "<br />");

    str = str.replace(truncatise(str, options),"");

    return str;
  }
});

userSchema.virtual('description').get(function (req) {
  if (this.abouts && this.abouts.length) {
    return helpers.makeDescription(this.abouts, this.$locals);
  }
});

userSchema.virtual('birthdayFormatted').get(function () {
  if (this.birthday) {
    const lang = $locals.locale;
    return moment(this.birthday).format(config.dateFormat[lang].weekdaydaymonthyear);
  }
});

// Return thumbnail
userSchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
    imageFormats[format] = process.env.WAREHOUSE+config.cpanel[adminsez].forms.image.components.image.config.sizes[format].default;
  }
  if (this.organizationData && this.organizationData.logo) {
    for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE+this.organizationData.logo;
    }
  } else if (this.image && this.image.file) {
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


const EventFreezedUserShow = mongoose.model('EventFreezedUserShow', userSchema);

export default EventFreezedUserShow;
