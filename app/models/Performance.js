import config from 'getconfig';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
//import indexPlugin from '../utilities/elasticsearch/Performance.js';
import helpers from '../utilities/helpers.js';

import About from './shared/About.js';
import MediaImage from './shared/MediaImage.js';
import Booking from './shared/Booking.js';
import { logger } from 'express-winston';


const adminsez = 'performances';

function ignoreEmpty (val) {
  if ("" === val) {
    return undefined;
  } else {
    return val
  }
}
const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date.getTime());
};


const performanceSchema = new Schema({
  old_id : String,

  createdAt: Date,
  title: { type: String, trim: true, required: [true, 'PERFORMANCE_TITLE_IS_REQUIRED'], minlength: [3, 'PERFORMANCE_TITLE_IS_TOO_SHORT'], maxlength: [100, 'PERFORMANCE_TITLE_IS_TOO_LONG'] },
  slug: { type: String, unique: true, trim: true, required: [true, 'PERFORMANCE_URL_IS_REQUIRED'], minlength: [3, 'PERFORMANCE_URL_IS_TOO_SHORT'], maxlength: [100, 'PERFORMANCE_URL_IS_TOO_LONG'],
    validate: [(slug) => {
      var re = /^[a-z0-9-_]+$/;
      return re.test(slug)
    }, 'PERFORMANCE_URL_IS_NOT_VALID']
  },
  is_public: { type: Boolean, default: false },
  privacy: {type: Date},
  terms: {type: Date},
  image: MediaImage,
  abouts: [About],
  stats: {
    visits: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  price: String,
  paypal: String,
  duration: String,
  tech_arts: [About], // what the artist brings
  tech_reqs: [About], // what the artist need
  bookings:[Booking],


  users: [{ type : Schema.ObjectId, ref : 'User' }],
  galleries: [{ type : Schema.ObjectId, ref : 'Gallery' }],
  videos: [{ type: Schema.ObjectId, ref: 'Video' }],
  categories: [{ type : Schema.ObjectId, ref : 'Category' }],
  type: { type : Schema.ObjectId, ref : 'Category' },
  tecnique: { type : Schema.ObjectId, set: ignoreEmpty, ref : 'Category' },
  genre: { type : Schema.ObjectId, set: ignoreEmpty, ref : 'Category' }
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret, options) => {
      delete ret.id;
      delete ret.image;
      delete ret.abouts;
      delete ret.tech_reqs;
      delete ret.tech_arts;
      delete ret.__v;
    }
  }
});

performanceSchema.pre('validate', function(next) {
  if (this.is_public) {
    if (!isValidDate(this.privacy)) {
      this.invalidate('privacy', 'PRIVACY_TERMS_ACCEPTANCE_IS_REQUIRED');
    }
    if (!isValidDate(this.terms)) {
      this.invalidate('terms', 'TERMS_ACCEPTANCE_IS_REQUIRED');
    }
  }
  next();
});

performanceSchema.virtual('about').get(function (req) {
  let about = this.$locals.__('Text is missing');
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === this.$locals.locale);
    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      aboutA = this.abouts.filter(item => item.lang === "en");
      if (aboutA.length && aboutA[0].abouttext) {
        about = "["+this.$locals.__("Text available only in English")+"] "+aboutA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    about = about.replace(new RegExp(/\n/gi)," <br />");

    about = helpers.linkify(about);

    return about;
  }
});

performanceSchema.virtual('description').get(function (req) {
  if (this.abouts && this.abouts.length) {
    return helpers.makeDescription(this.abouts, this.$locals);
  }
});

performanceSchema.virtual('tech_req').get(function (req) {
  let tech_req = this.$locals.__('Nothing');
  let tech_reqA = [];
  if (this.tech_reqs && this.tech_reqs.length) {
    tech_reqA = this.tech_reqs.filter(item => item.lang === this.$locals.locale);
    if (tech_reqA.length && tech_reqA[0].abouttext) {
      tech_req = tech_reqA[0].abouttext.replace(/\r\n/g, '<br />').replace(/\n/g, '<br />');
    } else {
      tech_reqA = this.tech_reqs.filter(item => item.lang === "en");
      if (tech_reqA.length && tech_reqA[0].abouttext) {
        tech_req = tech_reqA[0].abouttext.replace(/\r\n/g, '<br />').replace(/\n/g, '<br />');
      }
    }
    return tech_req;
  }
});

performanceSchema.virtual('humanDuration').get(function () {
  if (this.duration) {
    const durationMinutes = parseFloat(String(this.duration).replace(",", "."));
    if (durationMinutes > 59) {
      return this.$locals.moment.duration({"minutes": durationMinutes}).humanize();
    } else {
      const __ = (this.$locals && this.$locals.__) || ((text) => text);
      const totalSeconds = Math.round(durationMinutes * 60);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      const label = secs ? mins + ":" + String(secs).padStart(2, "0") : String(mins);
      return label + " " + __("min.");
    }
  }
});

// Multi-day span (e.g. workshops): only set when a single booking's own schedule spans more
// than 24h. Each booking is a separate event engagement, so bookings are never mixed together
// (a performance booked in two unrelated events must not have their dates combined into one span).
performanceSchema.virtual('days').get(function () {
  if (!this.bookings || !this.bookings.length) return undefined;
  let maxDays = 0;
  for (const booking of this.bookings) {
    if (!booking.schedule || !booking.schedule.length) continue;
    let start = null, end = null;
    for (const slot of booking.schedule) {
      if (slot.starttime && (!start || slot.starttime < start)) start = slot.starttime;
      if (slot.endtime && (!end || slot.endtime > end)) end = slot.endtime;
    }
    if (!start || !end) continue;
    const s = new Date(start), e = new Date(end);
    if (e.getTime() - s.getTime() <= 24 * 60 * 60 * 1000) continue;
    const startDay = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
    const endDay = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());
    const daysCount = Math.round((endDay - startDay) / 86400000) + 1;
    if (daysCount > maxDays) maxDays = daysCount;
  }
  if (!maxDays) return undefined;
  if (this.$locals && this.$locals.moment) {
    return this.$locals.moment.duration(maxDays, 'days').humanize();
  }
  return maxDays + ' days';
});

performanceSchema.virtual('tech_art').get(function (req) {
  let tech_art = this.$locals.__('Nothing');
  let tech_artA = [];
  if (this.tech_arts && this.tech_arts.length) {
    tech_artA = this.tech_arts.filter(item => item.lang === this.$locals.locale);
    if (tech_artA.length && tech_artA[0].abouttext) {
      tech_art = tech_artA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      tech_artA = this.tech_arts.filter(item => item.lang === "en");
      if (tech_artA.length && tech_artA[0].abouttext) {
        tech_art = tech_artA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    return tech_art;
  }
});


// Return thumbnail
performanceSchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  for(let format in config.cpanel[adminsez].forms.public.image.config.sizes) {
    imageFormats[format] = process.env.WAREHOUSE+config.cpanel[adminsez].forms.public.image.config.sizes[format].default;
  }
  if (this.image && this.image.file) {
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/performances_originals/', '/warehouse/performances/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    for(let format in config.cpanel[adminsez].forms.public.image.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE+localPath+"/"+config.cpanel[adminsez].forms.public.image.config.sizes[format].folder+"/"+localFileNameWithoutExtension+"_"+localFileNameExtension+".jpg";
    }
  }
  return imageFormats;
});

performanceSchema.pre('remove', function(next) {
  const performance = this;
  performance.model('User').updateMany(
    { $pull: { performances: performance._id } },
    next
  );
  performance.model('Crew').updateMany(
    { $pull: { performances: performance._id } },
    next
  );
});
 /*  
performanceSchema.pre('validate', function(next) {
  if (this.tecnique == '') this.tecnique = undefined;
  if (this.genre == '') this.genre = undefined;
  next();
});
 */

//performanceSchema.plugin(indexPlugin());

const Performance = mongoose.model('Performance', performanceSchema);

export default Performance;
