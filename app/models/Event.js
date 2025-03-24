import config from 'getconfig';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//const indexPlugin from '../utilities/elasticsearch/Event');

import About from './shared/About.js';
import MediaImage from './shared/MediaImage.js';
import Link from './shared/Link.js';
import Venue from './shared/Venue.js';
import Schedule from './shared/Schedule.js';
import Program from './Program.js';
import Package from './shared/Package.js';

const adminsez = 'events';
import { logger, requestLogger, errorLogger } from '../utilities/logger.js';


const datevenueSchema = new Schema({
  starttime: Date,
  endtime: Date,
  admitted: [{ type : Schema.ObjectId, ref : 'Category' }],
  venue: Venue,
  location: String,
  location: String
},{ _id : false });

datevenueSchema.virtual('date').get(function () {
  const lang = this.$locals.locale;
  const startdatefake = new Date(new Date(this.starttime-(10*60*60*1000)).setUTCHours(0,0,0,0));
  return startdatefake;
});

datevenueSchema.virtual('date_formatted').get(function () {
  const lang = this.$locals.locale;
  const startdatefake = new Date(new Date(this.starttime-(10*60*60*1000)).setUTCHours(0,0,0,0));
  return this.$locals.moment(startdatefake).format(config.dateFormat[lang].weekdaydaymonthyear);
});

datevenueSchema.virtual('starttime_formatted').get(function () {
  return this.$locals.moment(this.starttime).format('h:mm');
});
datevenueSchema.virtual('endtime_formatted').get(function () {
  return this.$locals.moment(this.endtime).format('h:mm');
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
  _id : false,
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true
  }
});

const programFreezedSchema = new Schema({
  subscription_id: { type: Schema.ObjectId, ref: 'EventFreezedProgram' },
  schedule: [Schedule],
  performance: { type: Schema.ObjectId, ref: 'EventFreezedPerformance' }
}, {
  _id : false,
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true
  }
});

const callSchema = new Schema({
  title: String,
  email: String,
  emailname: String,
  emailuser: String,
  emailpassword: String,
  imgalt: String,
  imghead: String,
  colBkg: String,
  text_sign: String,
  html_sign: String,
  permalink: String,
  start_date: Date,
  end_date: Date,
  admitted: [{ type: Schema.ObjectId, ref: 'Category' }],
  excerpt: String,
  terms: String,
  availability: Boolean,
  availabilityDates: {
    start: Date,
    end: Date
  },
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
  console.log("irtual('start_date_formatted')")
  return this.$locals.moment(this.start_date).utc().format('MMMM Do YYYY');
});
callSchema.virtual('end_date_formatted').get(function () {
  console.log("irtual('end_date_formatted')")
  var bella = this.$locals.moment(this.end_date).utc().format('MMMM Do YYYY, HH:mm');
  console.log("irtual('end_date_formatted') fine")
  return bella
});
const isValidDate = (date) => {
  console.log("isValidDate")
  console.log(date instanceof Date && !isNaN(date.getTime()))
  return date instanceof Date && !isNaN(date.getTime());
};

const eventSchema = new Schema({
  createdAt: Date,
  wp_id: String,
  wp_users: [],
  wp_tags: [],
  
  old_id: String,

  title: { type: String, trim: true, required: [true, 'EVENT_TITLE_IS_REQUIRED'], minlength: [3, 'EVENT_TITLE_IS_TOO_SHORT'], maxlength: [100, 'EVENT_TITLE_IS_TOO_LONG'] },
  slug: { type: String, unique: true, trim: true, required: [true, 'EVENT_URL_IS_REQUIRED'], minlength: [3, 'EVENT_URL_IS_TOO_SHORT'], maxlength: [100, 'EVENT_URL_IS_TOO_LONG'],
    validate: [(slug) => {
      var re = /^[a-z0-9-_]+$/;
      return re.test(slug)
    }, 'EVENT_URL_IS_NOT_VALID']
  },
  subtitles: [],
  image: MediaImage,
  //teaserImage: MediaImage,
  //file: { file: String },
  abouts: [About], // BL multilang
  web: [Link],
  social: [Link],
  emails: [Link],
  phones: [Link],
  is_public: { type: Boolean, default: false },
  privacy: {
    type: Date,
    required: [true, 'PRIVACY_TERMS_ACCEPTANCE_IS_REQUIRED'],
    validate: [isValidDate, 'PRIVACY_TERMS_ACCEPTANCE_IS_REQUIRED']
  },
  terms: {
    type: Date,
    required: [true, 'TERMS_ACCEPTANCE_IS_REQUIRED'],
    validate: [isValidDate, 'TERMS_ACCEPTANCE_IS_REQUIRED']
  },
  gallery_is_public: { type: Boolean, default: false },
  is_freezed: { type: Boolean, default: false },
  stats: {
    visits: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  schedule: [datevenueSchema],
  partners: [partnershipSchema],
  program: [programSchema],
  program_freezed: [programFreezedSchema],
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
    emailuser: String,
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
  let about = this.$locals.__('Text is missing');
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === this.$locals.locale);
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
  let subtitle = this.$locals.__('Text is missing');
  let subtitleA = [];
  if (this.subtitles && this.subtitles.length) {
    subtitleA = this.subtitles.filter(item => item.lang === this.$locals.locale);
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
  for(let format in config.cpanel[adminsez].forms.public.image.config.sizes) {
    imageFormats[format] = process.env.WAREHOUSE+config.cpanel[adminsez].forms.public.image.config.sizes[format].default;
  }
  if (this.image && this.image.file) {
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/events_originals/', '/warehouse/events/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    for(let format in config.cpanel[adminsez].forms.public.image.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE+localPath+"/"+config.cpanel[adminsez].forms.public.image.config.sizes[format].folder+"/"+localFileNameWithoutExtension+"_"+localFileNameExtension+".jpg";
    }
  }
  return imageFormats;
});

//eventSchema.plugin(indexPlugin());

const Event = mongoose.model('Event', eventSchema);

export default Event;
