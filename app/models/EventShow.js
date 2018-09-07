const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const indexPlugin = require('../utilities/elasticsearch/Event');

const About = require('./shared/About');
const MediaImage = require('./shared/MediaImage');
const Link = require('./shared/Link');
const Venue = require('./shared/Venue');
//const scheduleSchema = require('./shared/scheduleSchema');
//const Package = require('./shared/Package');

const adminsez = 'events';
const logger = require('../utilities/logger');

const scheduleSchema = new Schema({
  date: Date,
  starttime: Date,
  endtime: Date,
  venue: Venue
});

scheduleSchema.virtual('date_formatted').get(function () {
  return moment(this.date).format('MMMM Do YYYY');
});
scheduleSchema.virtual('starttime_formatted').get(function () {
  return moment(this.starttime).format('h:mm');
});
scheduleSchema.virtual('endtime_formatted').get(function () {
  return moment(this.endtime).format('h:mm');
});

const packageSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  personal: { type: Boolean, default: false },
  requested: { type: Boolean, default: false },
  allow_multiple: { type: Boolean, default: false },
  allow_options: { type: Boolean, default: false },
  options_name: String,
  options: String,
  daily: { type: Boolean, default: false },
  start_date: Date,
  end_date: Date
}, {
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true,
    getters: true
  }
});

const partnershipSchema = new Schema({
  category:  { type : Schema.ObjectId, ref : 'Category' },
  users:  [{ type : Schema.ObjectId, ref : 'UserShow' }]
});

const programSchema = new Schema({
  schedule: {
    date: Date,
    starttime: Date,
    endtime: Date,
    data_i: String,
    data_f: String,
    ora_i: Number,
    ora_f: Number,
    rel_id: String,
    user_id: String,
    confirm: String,
    day: String,
    venue: Venue,
    categories: [{ type: Schema.ObjectId, ref: 'Category' }]
  },
  performance: { type: Schema.ObjectId, ref: 'Performance' }
}, {
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret, options) => {
      delete ret.schedule.data_i;
      delete ret.schedule.data_f;
      delete ret.schedule.ora_i;
      delete ret.schedule.ora_f;
      delete ret.schedule.rel_id;
      delete ret.schedule.user_id;
      delete ret.schedule.confirm;
      delete ret.schedule.day;
      delete ret.schedule.date;
    }
  }
});

packageSchema.virtual('price_formatted').get(function () {
  //return accounting.formatMoney(this.price, '€ ', 2, '.', ',');
  return this.price;
});

const callSchema = new Schema({
  title: String,
  email: String,
  permalink: String,
  start_date: Date,
  end_date: Date,
  admitted: [{ type: Schema.ObjectId, ref: 'Category' }],
  excerpt: String,
  terms: String,
  packages: [packageSchema],
  topics: [{
    name: String,
    description: String
  }]
}, {
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
  return moment(this.start_date).format('MMMM Do YYYY, h:mm:ss a');
});
callSchema.virtual('end_date_formatted').get(function () {
  return moment(this.end_date).format('MMMM Do YYYY, h:mm:ss a');
});

const eventSchema = new Schema({
  old_id: String,
  creation_date: Date,

  slug: { type: String, unique: true },
  title: String,
  subtitles: [About],
  image: MediaImage,
  //teaserImage: MediaImage,
  //file: { file: String },
  abouts: [About], // BL multilang
  web: [Link],
  social: [Link],
  emails: [Link],
  is_public: { type: Boolean, default: false },
  gallery_is_public: { type: Boolean, default: false },
  is_freezed: { type: Boolean, default: false },
  stats: {},
  schedule: [scheduleSchema],
  partners: [partnershipSchema],
  program: [programSchema],
  schedule: [scheduleSchema],
  categories: [{ type: Schema.ObjectId, ref: 'Category' }],
  users:  [{ type: Schema.ObjectId, ref: 'UserShow' }],
  galleries: [{ type: Schema.ObjectId, ref: 'Gallery' }],
  videos: [{ type: Schema.ObjectId, ref: 'Video' }],
  settings: {
    permissions: {
        administrator: [{ type: Schema.ObjectId, ref: 'UserShow' }]
    }
  },
  organizationsettings: {
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
  collection: 'events',
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret, options) => {
      delete ret.id;
      delete ret.image;
      //delete ret.schedule;
      delete ret.abouts;
      delete ret.subtitles;
      delete ret.__v;
      delete ret._id;
      delete ret.program;
    }
  }
});

eventSchema.virtual('programmebydayvenue').get(function (req) {
  //let programmebydayvenue = [];
  let programmebydayvenueObj = {};
  if (this.program && this.program.length) {
    const lang = global.getLocale();
    for(let a=0;a<this.program.length;a++){
      let date = new Date(this.program[a].schedule.starttime);  // dateStr you get from mongodb
      let d = date.getDate();
      let m = date.getMonth()+1;      
      let y = date.getFullYear();
      let newdate = moment(this.program[a].schedule.starttime).format(config.dateFormat[lang].single);
      if (!programmebydayvenueObj[y+"-"+m+"-"+d]) programmebydayvenueObj[y+"-"+m+"-"+d] = {
        date: newdate,
        rooms: {}
      };
      if (!programmebydayvenueObj[y+"-"+m+"-"+d].rooms[this.program[a].schedule.venue.name+this.program[a].schedule.venue.room]) programmebydayvenueObj[y+"-"+m+"-"+d].rooms[this.program[a].schedule.venue.name+this.program[a].schedule.venue.room] = {
        venue: this.program[a].schedule.venue.name,
        room: this.program[a].schedule.venue.room,
        performances: []
      };
      if (programmebydayvenueObj[y+"-"+m+"-"+d].rooms[this.program[a].schedule.venue.name+this.program[a].schedule.venue.room].performances.length<5) programmebydayvenueObj[y+"-"+m+"-"+d].rooms[this.program[a].schedule.venue.name+this.program[a].schedule.venue.room].performances.push(this.program[a]);
    }
    return programmebydayvenueObj;
  }
});

eventSchema.virtual('artists').get(function (req) {
  //let programmebydayvenue = [];
  let artists = {
    artistsN: 0,
    actsN: 0,
    artistsCount: 0,
    countries: [],
    acts: [],
    artists:[]
  };
  let artistsA = [];
  let artistsN = [];
  let actsN = [];
  if (this.program && this.program.length) {
    for(let a=0;a<this.program.length;a++){
      if(actsN.indexOf(this.program[a].performance._id)===-1) actsN.push(this.program[a].performance._id);
      for(let b=0;b<this.program[a].performance.users.length;b++){
        if (artistsA.indexOf(this.program[a].performance.users[b]._id)===-1) artistsA.push(this.program[a].performance.users[b]._id);
        artists.artistsCount+= this.program[a].performance.users[b].members ? this.program[a].performance.users[b].members.length : 1;
        artists.artistsN+= 1;
        for(let d=0;d<this.program[a].performance.users[b].members.length;d++){
          if (artistsN.indexOf(this.program[a].performance.users[b].members[d]._id)===-1) artistsN.push(this.program[a].performance.users[b].members[d]._id);
        }
        for(let c=0;c<this.program[a].performance.users[b].addresses.length;c++){
          if (artists.countries.indexOf(this.program[a].performance.users[b].addresses[c].country)===-1) artists.countries.push(this.program[a].performance.users[b].addresses[c].country);
        }
        for(let c=0;c<this.program[a].performance.categories.length;c++){
          if (this.program[a].performance.categories[c].ancestor.toString()==='5a9bba176066240000000188' && artists.acts.indexOf(this.program[a].performance.categories[c].name)===-1) artists.acts.push(this.program[a].performance.categories[c].name);
        }
        if (artists.artists.length<15) artists.artists.push(this.program[a].performance.users[b]);
      }
    }
    artists.artistsN = artistsA.length;
    artists.artistsCount = artistsN.length;
    artists.actsN = actsN.length;
    return artists;
  }
});

eventSchema.virtual('about').get(function (req) {
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
    return about;
  }
});

eventSchema.virtual('description').get(function (req) {
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
    about = about.trim().replace(/,/g , "").replace(/###b###/g , "").replace(/"/g , "").replace(/###\/b###/g , "").replace(/<br \/>/g , " ").replace(/  /g , " ");

    descriptionA = about.split(" ");
    let descriptionShort = "";
    for(let item in descriptionA) if ((descriptionShort+" "+descriptionA[item]).trim().length<300) descriptionShort+=descriptionA[item]+" ";
    return descriptionShort.trim();
  }
});

eventSchema.virtual('subtitle').get(function (req) {
  let subtitle = __('Text is missing');
  let subtitleA = [];
  if (this.subtitles && this.subtitles.length) {
    subtitleA = this.subtitles.filter(item => item.lang === global.getLocale());
    if (subtitleA.length && subtitleA[0].subtitletext) {
      subtitle = subtitleA[0].subtitletext.replace(/\r\n/g, '<br />');
    } else {
      subtitleA = this.subtitles.filter(item => item.lang === config.defaultLocale);
      if (subtitleA.length && subtitleA[0].abouttext) {
        subtitle = subtitleA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    return subtitle;
  }
});




eventSchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.image);
  if (this.image && this.image.file) {
    for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
      imageFormats[format] = config.cpanel[adminsez].forms.image.components.image.config.sizes[format].default;
    }
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/events_originals/', process.env.WAREHOUSE+'/warehouse/events/'); // /warehouse/2017/03
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

eventSchema.virtual('boxDate').get(function () {
  let boxDate;
  if (this.schedule && this.schedule.length) {
    const lang = global.getLocale();
    moment.locale(lang);
    if (this.schedule.length == 1) {
      boxDate = moment(this.schedule[0].date).format(config.dateFormat[lang].single);
    } else {
      if (this.schedule[0].date.getFullYear()!==this.schedule[this.schedule.length-1].date.getFullYear()) {
        boxDate = moment(this.schedule[0].date).format(config.dateFormat[lang].single) + ' // ' + moment(this.schedule[this.schedule.length-1].date).format(config.dateFormat[lang].single);
      } else {
        if (this.schedule[0].date.getMonth()!==this.schedule[this.schedule.length-1].date.getMonth()) {
          boxDate = moment(this.schedule[0].date).format(config.dateFormat[lang].daymonth1) + ' // ' + moment(this.schedule[this.schedule.length-1].date).format(config.dateFormat[lang].daymonth2);
        } else {
          boxDate = moment(this.schedule[0].date).format(config.dateFormat[lang].day1) + ' // ' + moment(this.schedule[this.schedule.length-1].date).format(config.dateFormat[lang].day2);
        }
      }
    }
  }
  return boxDate;
});

eventSchema.virtual('boxVenue').get(function () {
  let boxVenue;
  if (this.schedule && this.schedule.length) {
    boxVenue = this.schedule[0].venue.name + ' ' + this.schedule[0].venue.location.locality + ' ' + this.schedule[0].venue.location.country;
  }
  return boxVenue;
});

/* C
eventSchema.virtual('teaserImageFormats').get(function () {
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

eventSchema.virtual('editUrl').get(function () {
  return `/admin/events/public/${this.slug}`;
});

eventSchema.virtual('publicUrl').get(function () {
  return `/events/${this.slug}`;
});

eventSchema.virtual('organizers',{
  ref: 'UserShow',
  localField: '_id',
  foreignField: 'events'
});

eventSchema.virtual('organizing_crews',{
  ref: 'UserShow',
  localField: '_id',
  foreignField: 'events'
});

eventSchema.virtual('performances',{
  ref: 'Performance',
  localField: '_id',
  foreignField: 'events'
});

eventSchema.virtual('startsFormatted').get(function () {
  return moment(this.starts).format(config.dateFormat);
});

eventSchema.virtual('endsFormatted').get(function () {
  return moment(this.ends).format(config.dateFormat);
});

eventSchema.virtual('organizers',{
  ref: 'UserShow',
  localField: '_id',
  foreignField: 'events'
});

eventSchema.virtual('dateFormatted').get(function () {
  let date = '';
  if (this.ends && this.startsFormatted !== this.endsFormatted) {
    date = moment(this.starts).format('MMMM Do');
    date += ' - ' + moment(this.ends).format('MMMM Do YYYY');
  } else {
    date = moment(this.starts).format('MMMM Do YYYY');
  }
  return date;
});

eventSchema.pre('remove',function(next) {
  const event = this;
  event.model('UserShow').update(
    { $pull: { events: event._id } },
    next
  );
});
*/

eventSchema.plugin(indexPlugin());

const EventShow = mongoose.model('EventShow', eventSchema);

module.exports = EventShow;
