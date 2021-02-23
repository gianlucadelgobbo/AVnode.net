const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

//const indexPlugin = require('../utilities/elasticsearch/Event');

const About = require('./shared/About');
const MediaImage = require('./shared/MediaImage');
const Link = require('./shared/Link');
const Venue = require('./shared/Venue');
const Schedule = require('./shared/Schedule');
const Program = require('./Program');
const Package = require('./shared/Package');

const adminsez = 'events';
const logger = require('../utilities/logger');

const datevenueSchema = new Schema({
  starttime: Date,
  endtime: Date,
  breakduration: Number,
  admitted: [{ type : Schema.ObjectId, ref : 'Category' }],
  venue: Venue
},{ _id : false });

datevenueSchema.virtual('date').get(function () {
  const lang = global.getLocale();
  const startdatefake = new Date(new Date(this.starttime-(10*60*60*1000)).setUTCHours(0,0,0,0));
  return startdatefake;
});

datevenueSchema.virtual('date_formatted').get(function () {
  const lang = global.getLocale();
  const startdatefake = new Date(new Date(this.starttime-(10*60*60*1000)).setUTCHours(0,0,0,0));
  return moment(startdatefake).format(config.dateFormat[lang].weekdaydaymonthyear);
});

datevenueSchema.virtual('starttime_formatted').get(function () {
  return moment(this.starttime).format('h:mm');
});
datevenueSchema.virtual('endtime_formatted').get(function () {
  return moment(this.endtime).format('h:mm');
});


const partnershipSchema = new Schema({
  category:  { type : Schema.ObjectId, ref : 'Category' },
  users:  [{ type : Schema.ObjectId, ref : 'User' }]
}, {
  _id : false
});

const programSchema = new Schema({
  subscription_id: { type: Schema.ObjectId, ref: 'Program' },
  schedule: [Schedule],
  performance: { type: Schema.ObjectId, ref: 'Performance' }
}, {
  _id : false
});

const callSchema = new Schema({
  title: String,
  email: String,
  emailname: String,
  emailpassword: String,
  imgalt: String,
  imghead: String,
  text_sign: String,
  html_sign: String,
  permalink: String,
  start_date: Date,
  end_date: Date,
  admitted: [{ type: Schema.ObjectId, ref: 'Category' }],
  excerpt: String,
  terms: String,
  packages: [Package],
  topics: [{
    name: String,
    description: String
  }]
}, {
  _id : false,
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true,
    getters: true
  }
});
callSchema.virtual('start_date_formatted').get(function () {
  return moment(this.start_date).utc().format('MMMM Do YYYY');
});
callSchema.virtual('end_date_formatted').get(function () {
  return moment(this.end_date).utc().format('MMMM Do YYYY, HH:mm');
});

const eventSchema = new Schema({
  createdAt: Date,
  wp_id: String,
  wp_users: [],
  wp_tags: [],
  
  old_id: String,

  title: { type: String, trim: true, required: true, maxlength: 100 },
  slug: { type: String, unique: true, trim: true, required: true, minlength: 3, maxlength: 100,
    validate: [(slug) => {
      var re = /^[a-z0-9-_]+$/;
      return re.test(slug)
    }, 'URL_IS_NOT_VALID']
  },
  subtitles: [About],
  image: MediaImage,
  //teaserImage: MediaImage,
  //file: { file: String },
  abouts: [About], // BL multilang
  web: [Link],
  social: [Link],
  emails: [Link],
  phones: [Link],
  is_public: { type: Boolean, default: false },
  gallery_is_public: { type: Boolean, default: false },
  is_freezed: { type: Boolean, default: false },
  stats: {
    visits: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  schedule: [datevenueSchema],
  partners: [partnershipSchema],
  program: [programSchema],
  categories: [{ type: Schema.ObjectId, ref: 'Category' }],
  type: { type: Schema.ObjectId, ref: 'Category' },
  users:  [{ type: Schema.ObjectId, ref: 'UserShow' }],
  galleries: [{ type: Schema.ObjectId, ref: 'Gallery' }],
  videos: [{ type: Schema.ObjectId, ref: 'Video' }],
  settings: {
    permissions: {
        administrator: [{ type: Schema.ObjectId, ref: 'UserShow' }]
    }
  },
  organizationsettings: {
    email : String,
    emailname : String,
    emailpassword : String,
    text_sign : String,
    program_builder: { type: Boolean, default: false },
    advanced_proposals_manager: { type: Boolean, default: false },
    call_is_active: { type: Boolean, default: false },
    call: {
      nextEdition: String,
      subImg: String,
      subBkg: String,
      colBkg: String,
      permissions: {},
      calls: [callSchema]
    }
  }
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true
  }
});

/*eventSchema.virtual('about').get(function (req) {
  let about = __('Text is missing');
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === global.getLocale());
    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      aboutA = this.abouts.filter(item => item.lang === "en");
      if (aboutA.length && aboutA[0].abouttext) {
        about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    return about;
  }
});

eventSchema.virtual('subtitle').get(function (req) {
  let subtitle = __('Text is missing');
  let subtitleA = [];
  if (this.subtitles && this.subtitles.length) {
    subtitleA = this.subtitles.filter(item => item.lang === global.getLocale());
    if (subtitleA.length && subtitleA[0].abouttext) {
      subtitle = subtitleA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      subtitleA = this.subtitles.filter(item => item.lang === "en");
      if (subtitleA.length && subtitleA[0].abouttext) {
        subtitle = subtitleA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    return subtitle;
  }
});

*/


eventSchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
    imageFormats[format] = process.env.WAREHOUSE+config.cpanel[adminsez].forms.image.components.image.config.sizes[format].default;
  }
  if (this.image && this.image.file) {
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/events_originals/', '/warehouse/events/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE+localPath+"/"+config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder+"/"+localFileNameWithoutExtension+"_"+localFileNameExtension+".jpg";
    }
  }
  return imageFormats;
});



//eventSchema.plugin(indexPlugin());

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
