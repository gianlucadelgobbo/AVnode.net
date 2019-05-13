const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const indexPlugin = require('../utilities/elasticsearch/Performance');
const helper = require('../utilities/helper');

const About = require('./shared/About');
const MediaImage = require('./shared/MediaImage');
const Booking = require('./shared/Booking');
const moment = require('moment');

const adminsez = 'performances';
function ignoreEmpty (val) {
  if ("" === val) {
    return undefined;
  } else {
    return val
  }
}
const performanceSchema = new Schema({
  old_id : String,

  createdAt: Date,
  slug: { type: String, unique: true, trim: true, required: true, minlength: 3, maxlength: 50 },
  title: { type: String, trim: true, required: true, maxlength: 50 },
  is_public: { type: Boolean, default: false },
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
    virtuals: true
  }
});

performanceSchema.virtual('about').get(function (req) {
  let about = __('Text is missing');
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === global.getLocale());
    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      aboutA = this.abouts.filter(item => item.lang === config.defaultLocale);
      if (aboutA.length && aboutA[0].abouttext) {
        about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    about = about.replace(new RegExp(/\n/gi)," <br />");

    about = helper.linkify(about);

    return about;
  }
});

performanceSchema.virtual('description').get(function (req) {
  let about = __('Text is missing');
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === global.getLocale());
    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      aboutA = this.abouts.filter(item => item.lang === config.defaultLocale);
      if (aboutA.length && aboutA[0].abouttext) {
        about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    about = about.replace(new RegExp(/<(?:.|\n)*?>/gm), "").trim().replace(/  /g , " ");

    descriptionA = about.split(" ");
    let descriptionShort = "";
    for(let item in descriptionA) if ((descriptionShort+" "+descriptionA[item]).trim().length<300) descriptionShort+=descriptionA[item]+" ";
    descriptionShort = descriptionShort.trim();
    if (descriptionShort.length < about.length) descriptionShort+"..."
    return descriptionShort;
  }
});

performanceSchema.virtual('tech_req').get(function (req) {
  let tech_req = __('Nothing');
  let tech_reqA = [];
  if (this.tech_reqs && this.tech_reqs.length) {
    tech_reqA = this.tech_reqs.filter(item => item.lang === global.getLocale());
    if (tech_reqA.length && tech_reqA[0].abouttext) {
      tech_req = tech_reqA[0].abouttext.replace(/\r\n/g, '<br />').replace(/\n/g, '<br />');
    } else {
      tech_reqA = this.tech_reqs.filter(item => item.lang === config.defaultLocale);
      if (tech_reqA.length && tech_reqA[0].abouttext) {
        tech_req = tech_reqA[0].abouttext.replace(/\r\n/g, '<br />').replace(/\n/g, '<br />');
      }
    }
    return tech_req;
  }
});

performanceSchema.virtual('humanDuration').get(function () {
  if (this.duration) {
    return moment.duration({"minutes": this.duration}).humanize()
  }
});

performanceSchema.virtual('tech_art').get(function (req) {
  let tech_art = __('Nothing');
  let tech_artA = [];
  if (this.tech_arts && this.tech_arts.length) {
    tech_artA = this.tech_arts.filter(item => item.lang === global.getLocale());
    if (tech_artA.length && tech_artA[0].abouttext) {
      tech_art = tech_artA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      tech_artA = this.tech_arts.filter(item => item.lang === config.defaultLocale);
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
  for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
    imageFormats[format] = process.env.WAREHOUSE+config.cpanel[adminsez].forms.image.components.image.config.sizes[format].default;
  }
  if (this.image && this.image.file) {
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/performances_originals/', '/warehouse/performances/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE+localPath+"/"+config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder+"/"+localFileNameWithoutExtension+"_"+localFileNameExtension+".jpg";
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

module.exports = Performance;
