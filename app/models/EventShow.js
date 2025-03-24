import config from 'getconfig';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import truncatise from 'truncatise';
//const indexPlugin from '../utilities/elasticsearch/Event');

import About from './shared/About.js';
import Category from './shared/Category.js';

import MediaImage from './shared/MediaImage.js';
import Link from './shared/Link.js';
import Venue from './shared/Venue.js';
import Schedule from './shared/Schedule.js';
import Package from './shared/Package.js';

const adminsez = 'events';
import { logger, requestLogger, errorLogger } from '../utilities/logger.js';

import helpers from '../utilities/helpers.js';

const datevenueSchema = new Schema({
  starttime: Date,
  endtime: Date,
  venue: Venue
},{ _id : false });

datevenueSchema.virtual('date_formatted').get(function () {
  //logger.info("EventShow virtual date_formatted")
  const lang = this.$locals.locale;
  const startdatefake = new Date(new Date(this.starttime-(10*60*60*1000)).setUTCHours(0,0,0,0));
  return this.$locals.moment(startdatefake).format(config.dateFormat[lang].weekdaydaymonthyear);
});
datevenueSchema.virtual('date').get(function () {
  //logger.info("EventShow virtual date")
  const lang = this.$locals.locale;
  const startdatefake = new Date(new Date(this.starttime-(10*60*60*1000)).setUTCHours(0,0,0,0));
  return startdatefake;
});

datevenueSchema.virtual('starttime_formatted').get(function () {
  //logger.info("EventShow virtual starttime_formatted")
  return this.$locals.moment(this.starttime).format('h:mm');
});
datevenueSchema.virtual('endtime_formatted').get(function () {
  return this.$locals.moment(this.endtime).format('h:mm');
});

const partnershipSchema = new Schema({
  category:  { type : Schema.ObjectId, ref : 'Category' },
  users:  [{ type : Schema.ObjectId, ref : 'UserShow' }]
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
  //logger.info("EventShow virtual start_date_formatted")
  return this.$locals.moment(this.start_date).format('MMMM Do YYYY');
});
callSchema.virtual('end_date_formatted').get(function () {
  //logger.info("EventShow virtual end_date_formatted")
  return this.$locals.moment(this.end_date).format('MMMM Do YYYY, h:mm');
});

const isValidDate = (date) => {
  console.log("isValidDate")
  console.log(date instanceof Date && !isNaN(date.getTime()))
  return date instanceof Date && !isNaN(date.getTime());
};

const eventSchema = new Schema({
  createdAt: Date,
  old_id: String,
  createdAt: Date,

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
  participate: { type: Boolean, default: false },
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
  partnership_type: { type: Schema.ObjectId, ref: 'Category' },
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
      //delete ret._id;
      /* */ delete ret.program_freezed;
      delete ret.program;
    }
  }
});

/* eventSchema.virtual('programmenotscheduled').get(function (req) {
  if (this.program && this.program.length) return this.program.map((item)=>{return item.performance});
}); */

eventSchema.virtual('advanced').get(function (req) {
  console.log("virtual('advanced')")
  //logger.info("EventShow virtual advanced");
  //let programmebydayvenue = [];
  let performers = {
    performersN: 0,
    actsN: 0,
    performersCount: 0,
    countries: [],
    acts: [],
    performers:[]
  };
  let performersA = [];
  let performersN = [];
  let actsN = [];
  let advanced = {}
  advanced.menu = [];
  //
  let programmebydayvenueObj = {};
  let ret = false;
  const lang = this.$locals.locale;
  let program;
  if (this.program_freezed && this.program_freezed.length) {
    program = this.program_freezed;
    console.log("program_freezed")
  } else  if (this.program && this.program.length) {
    program = this.program;
  }
  if (program && program.length) {
    for(let a=0;a<program.length;a++){
      // Artists
      if (program[a].performance && program[a].performance.users && program[a].performance.users.length) {
        if(actsN.indexOf(program[a].performance._id)===-1) actsN.push(program[a].performance._id);
        for(let b=0;b<program[a].performance.users.length;b++){
          if (program[a].performance.users[b].members && program[a].performance.users[b].members.length) {
            for(let d=0;d<program[a].performance.users[b].members.length;d++){
              if (performersN.indexOf(program[a].performance.users[b].members[d]._id)===-1) performersN.push(program[a].performance.users[b].members[d]._id);
            }
          } else {
            if (performersN.indexOf(program[a].performance.users[b]._id)===-1) performersN.push(program[a].performance.users[b]._id);
          }
          if (performersA.indexOf(program[a].performance.users[b]._id)===-1) {
            performersA.push(program[a].performance.users[b]._id);
            performers.performers.push(program[a].performance.users[b]);
          }


          if (program[a].performance.users[b].addresses) {
            for(let c=0;c<program[a].performance.users[b].addresses.length;c++){
              if (program[a].performance.users[b].addresses[c] && program[a].performance.users[b].addresses[c].country && performers.countries.indexOf(program[a].performance.users[b].addresses[c].country)===-1) performers.countries.push(program[a].performance.users[b].addresses[c].country);
            }  
          }
          /* for(let c=0;c<program[a].performance.categories.length;c++){
            if (program[a].performance.categories[c].ancestor.toString()==='5be8708afc3961000000008f' && performers.acts.indexOf(program[a].performance.categories[c].name)===-1) performers.acts.push(program[a].performance.categories[c].name);
          } */
          if (program[a].performance && program[a].performance.type && program[a].performance.type.name && performers.acts.indexOf(program[a].performance.type.name)===-1) performers.acts.push(program[a].performance.type.name);
        }
        if (program[a].schedule && program[a].schedule.length) {
          for(let b=0;b<program[a].schedule.length;b++){
            if (program[a].schedule[b].starttime) {
              ret = true;
              if ((program[a].schedule[b].endtime-program[a].schedule[b].starttime)/(24*60*60*1000)<1) {
                let date = new Date(program[a].schedule[b].starttime);  // dateStr you get from mongodb
                if (date.getUTCHours()<10) date = new Date(program[a].schedule[b].starttime-(24*60*60*1000));
                let d = ('0'+date.getUTCDate()).substr(-2);
                let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
                let y = date.getUTCFullYear();
                let newdate = this.$locals.moment(date).utc().format(config.dateFormat[lang].weekdaydaymonthyear);
                if (!programmebydayvenueObj[y+"-"+m+"-"+d]) programmebydayvenueObj[y+"-"+m+"-"+d] = {
                  day: y+"-"+m+"-"+d,
                  date: newdate,
                  rooms: {}
                };
                if (!programmebydayvenueObj[y+"-"+m+"-"+d].rooms[program[a].schedule[b].venue.name+program[a].schedule[b].venue.room]) programmebydayvenueObj[y+"-"+m+"-"+d].rooms[program[a].schedule[b].venue.name+program[a].schedule[b].venue.room] = {
                  venue: program[a].schedule[b].venue.name,
                  room: program[a].schedule[b].venue.room,
                  performances: []
                };
                let clone = JSON.parse(JSON.stringify(program[a]));
                clone.schedule = program[a].schedule[b];
                //if (programmebydayvenueObj[y+"-"+m+"-"+d].rooms[program[a].schedule[b].venue.name+program[a].schedule[b].venue.room].performances.length<5) 
                programmebydayvenueObj[y+"-"+m+"-"+d].rooms[program[a].schedule[b].venue.name+program[a].schedule[b].venue.room].performances.push(clone);  
              } else {
                var days = Math.floor((program[a].schedule[b].endtime-program[a].schedule[b].starttime)/(24*60*60*1000))+1;
                for(let c=0;c<days;c++){
                  let date = new Date((program[a].schedule[b].starttime.getTime())+((24*60*60*1000)*c));
                  let d = ('0'+date.getUTCDate()).substr(-2);
                  let m = ('0'+(date.getUTCMonth()+1)).substr(-2);
                  let y = date.getUTCFullYear();
                  let newdate = this.$locals.moment(date).utc().format(config.dateFormat[lang].weekdaydaymonthyear);
                  if (!programmebydayvenueObj[y+"-"+m+"-"+d]) programmebydayvenueObj[y+"-"+m+"-"+d] = {
                    day: y+"-"+m+"-"+d,
                    date: newdate,
                    rooms: {}
                  };

                  if (!programmebydayvenueObj[y+"-"+m+"-"+d].rooms[program[a].schedule[b].venue.name+program[a].schedule[b].venue.room]) programmebydayvenueObj[y+"-"+m+"-"+d].rooms[program[a].schedule[b].venue.name+program[a].schedule[b].venue.room] = {
                    venue: program[a].schedule[b].venue.name,
                    room: program[a].schedule[b].venue.room,
                    performances: []
                  };
                  let clone = JSON.parse(JSON.stringify(program[a]));
                  clone.schedule = program[a].schedule[b];
                  //if (programmebydayvenueObj[y+"-"+m+"-"+d].rooms[program[a].schedule[b].venue.name+program[a].schedule[b].venue.room].performances.length<5) 
                  programmebydayvenueObj[y+"-"+m+"-"+d].rooms[program[a].schedule[b].venue.name+program[a].schedule[b].venue.room].performances.push(clone);  
                }
              }
            }
          }
        } else {
          if (!advanced.programmenotscheduled) advanced.programmenotscheduled = [];
          advanced.programmenotscheduled.push(program[a].performance);
        }
      }
    }
    performers.performersA = performersA.length;
    performers.performersN = performersN.length;
    performers.actsN = actsN.length;
    performers.performers.sort((a,b) => (a.stagename.toLowerCase() > b.stagename.toLowerCase()) ? 1 : ((b.stagename.toLowerCase() > a.stagename.toLowerCase()) ? -1 : 0));
    advanced.performers = performers;

    if (advanced.performers) advanced.menu.push({slug: "performers", name: this.$locals.__("Performers")});
    let programmebydayvenue = ret ? Object.values(programmebydayvenueObj) : undefined;
    if (programmebydayvenue) {
      programmebydayvenue.sort((a,b) => (a.day > b.day) ? 1 : ((b.day > a.day) ? -1 : 0));
      for(let a=0;a<programmebydayvenue.length;a++){
        let rooms = [];
        for(let b in programmebydayvenue[a].rooms) {
          programmebydayvenue[a].rooms[b].performances.sort((a,b) => (a.schedule.starttime > b.schedule.starttime) ? 1 : ((b.schedule.starttime > a.schedule.starttime) ? -1 : 0));
          rooms.push(programmebydayvenue[a].rooms[b]);
        }
        programmebydayvenue[a].rooms = rooms;
        programmebydayvenue[a].rooms.sort((a,b) => (a.room > b.room) ? 1 : ((b.room > a.room) ? -1 : 0));
      }
      let dd = programmebydayvenue.map((item) => {return {name: item.date, slug:item.day}});
      let types = [];
      for (var item in  programmebydayvenue) {
        for (var item2 in  programmebydayvenue[item].rooms) {
          for (var item3 in  programmebydayvenue[item].rooms[item2].performances) {
            if (!types.length || (programmebydayvenue[item].rooms[item2].performances[item3].performance && programmebydayvenue[item].rooms[item2].performances[item3].performance.type && programmebydayvenue[item].rooms[item2].performances[item3].performance.type.slug && types.map(i => {return i.slug}).indexOf(programmebydayvenue[item].rooms[item2].performances[item3].performance.type.slug)===-1)) {
              types.push(programmebydayvenue[item].rooms[item2].performances[item3].performance.type);
            }
          }
        }
      }

      if (program) {
        advanced.menu.push({slug: "program", name: this.$locals.__("Program"), days: dd, types:types});
      }
    }
    if (this.galleries && this.galleries.length) advanced.menu.push({slug: "galleries", name: this.$locals.__("Galleries")});
    if (this.videos && this.videos.length) advanced.menu.push({slug: "videos", name: this.$locals.__("Videos")});
    if (this.partners && this.partners.length) advanced.menu.push({slug: "partners", name: this.$locals.__("Partners")});

    advanced.performers.countries = advanced.performers.countries.sort();
    advanced.programmebydayvenue = programmebydayvenue;
  }
  if (!this.is_freezed) {
  }
  return advanced;
});

/* eventSchema.virtual('performers').get(function (req) {
  //let programmebydayvenue = [];
  let performers = {
    performersN: 0,
    actsN: 0,
    performersCount: 0,
    countries: [],
    acts: [],
    performers:[]
  };
  let performersA = [];
  let performersN = [];
  let actsN = [];
  if (this.program && this.program.length) {
    for(let a=0;a<this.program.length;a++){
      if(this.program[a].performance) {
        if(actsN.indexOf(this.program[a].performance._id)===-1) actsN.push(this.program[a].performance._id);
        for(let b=0;b<this.program[a].performance.users.length;b++){
          if (this.program[a].performance.users[b].members.length) {
            for(let d=0;d<this.program[a].performance.users[b].members.length;d++){
              if (performersN.indexOf(this.program[a].performance.users[b].members[d]._id)===-1) performersN.push(this.program[a].performance.users[b].members[d]._id);
            }
          } else {
            if (performersN.indexOf(this.program[a].performance.users[b]._id)===-1) performersN.push(this.program[a].performance.users[b]._id);
          }
          if (performersA.indexOf(this.program[a].performance.users[b]._id)===-1) {
            performersA.push(this.program[a].performance.users[b]._id);
            performers.performers.push(this.program[a].performance.users[b]);
          }


          if (this.program[a].performance.users[b].addresses) {
            for(let c=0;c<this.program[a].performance.users[b].addresses.length;c++){
              if (performers.countries.indexOf(this.program[a].performance.users[b].addresses[c].country)===-1) performers.countries.push(this.program[a].performance.users[b].addresses[c].country);
            }  
          }
          for(let c=0;c<this.program[a].performance.categories.length;c++){
            if (this.program[a].performance.categories[c].ancestor.toString()==='5be8708afc3961000000008f' && performers.acts.indexOf(this.program[a].performance.categories[c].name)===-1) performers.acts.push(this.program[a].performance.categories[c].name);
          }
        }
      }
    }
    performers.performersN = performersA.length;
    performers.performersCount = performersN.length;
    performers.actsN = actsN.length;
    performers.performers.sort((a,b) => (a.stagename > b.stagename) ? 1 : ((b.stagename > a.stagename) ? -1 : 0));
    return performers;
  }
}); */

eventSchema.virtual('about').get(function (req) {
  //logger.info("EventShow virtual about")
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
    var options = {
      TruncateLength: 100,
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


eventSchema.virtual('aboutFull').get(function (req) {
  //logger.info("EventShow virtual aboutFull")
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
eventSchema.virtual('description').get(function (req) {
  //logger.info("EventShow virtual description")
  if (this.abouts && this.abouts.length) {
    return helpers.makeDescription(this.abouts, this.$locals);
  }
});

eventSchema.virtual('call_is_active').get(function (req) {
  //logger.info("EventShow virtual description")
  return this.organizationsettings.call.calls && this.organizationsettings.call.calls.length;
});

eventSchema.virtual('subtitle').get(function (req) {
  //logger.info("EventShow virtual description")
  let subtitleA = [];
  if (this.subtitles && this.subtitles.length) {
    let subtitle;
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




eventSchema.virtual('imageFormats').get(function () {
  logger.info("EventShow virtual imageFormats")
  logger.info(config.cpanel[adminsez].forms)
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

eventSchema.virtual('boxDate').get(function () {
  //logger.info("EventShow virtual boxDate")
  let boxDate;
  if (this.schedule && this.schedule.length) {
    const lang = this.$locals.locale;
    const startdate = new Date(new Date(this.schedule[0].starttime).setUTCHours(0,0,0,0));
    const enddate = new Date(new Date(this.schedule[this.schedule.length-1].endtime).setUTCHours(0,0,0,0));
    const enddatefake = new Date(new Date(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).setUTCHours(0,0,0,0));
    if(startdate.toString()===enddatefake.toString()) {
      boxDate = this.$locals.moment(this.schedule[0].starttime).format(config.dateFormat[lang].weekdaydaymonthyear);
    } else {
      if (this.schedule[0].starttime.getFullYear()!==this.schedule[this.schedule.length-1].endtime.getFullYear()) {
        boxDate = this.$locals.moment(this.schedule[0].starttime).format(config.dateFormat[lang].weekdaydaymonthyear) + ' // ' + this.$locals.moment(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear);
      } else {
        if (this.schedule[0].starttime.getMonth()!==this.schedule[this.schedule.length-1].endtime.getMonth()) {
          boxDate = this.$locals.moment(this.schedule[0].starttime).format(config.dateFormat[lang].daymonth1) + ' // ' + this.$locals.moment(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).format(config.dateFormat[lang].daymonthyear);
        } else {
          boxDate = this.$locals.moment(this.schedule[0].starttime).format(config.dateFormat[lang].day1) + ' // ' + this.$locals.moment(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).format(config.dateFormat[lang].day2);
        }
      }
    }
  }
  return boxDate;
});

/* eventSchema.virtual('dateISO').get(function () {
  return this.updatedAt ? this.updatedAt : this.createdAt;
}); */

eventSchema.virtual('boxVenue').get(function () {
  //logger.info("EventShow virtual boxVenue")
  let boxVenue;
  if (this.schedule && this.schedule.length && this.schedule[0].venue && this.schedule[0].venue.location) {
    boxVenue = this.schedule[0].venue.name + ' ' + this.schedule[0].venue.location.locality + ' ' + this.schedule[0].venue.location.country;
  }
  if (this.schedule && this.schedule.length) {
    let boxVenueO = {};
    for (let schedule=0;schedule<this.schedule.length; schedule++) {
      //for (let venue in schedulebydayvenueObjGrouped[item].venues) {
        if (this.schedule[schedule].venue) {
          let v = this.schedule[schedule].venue;
          if (v.type != 'virtual') {
            if (v.location && v.location.country && !boxVenueO[v.location.country]) boxVenueO[v.location.country] = {};
            if (v.location && v.location.country && v.location.locality && !boxVenueO[v.location.country][v.location.locality]) boxVenueO[v.location.country][v.location.locality] = {};
            if (v.location && v.location.country && v.location.locality && v.name && !boxVenueO[v.location.country][v.location.locality][v.name]) boxVenueO[v.location.country][v.location.locality][v.name] = [];
            //if (v.location && v.location.country && v.location.locality && v.name && v.room && !boxVenueO[v.location.country][v.location.locality][v.name][v.room]) boxVenueO[v.location.country][v.location.locality][v.name][v.room] = {};
          } else if (v.type == 'virtual') {
            if (!boxVenueO['virtual']) boxVenueO['virtual'] = [];
            boxVenueO['virtual'].push(v)
          }
        }
      //}
    }
    let boxVenue = "";
    for (let country in boxVenueO) {
      if (country == 'virtual') {
        for (let city in boxVenueO[country]) {
          if (boxVenueO[country][city].url) {
            boxVenue = "<a href=\""+boxVenueO[country][city].url+"\" target=\"_blank\">"+(boxVenueO[country][city].name ? boxVenueO[country][city].name : country)+"</a> "+boxVenue;
          } else {
            boxVenue = (boxVenueO[country][city].name ? boxVenueO[country][city].name : country)+" "+boxVenue;
          }
        }
      } else {
        boxVenue = country+" "+boxVenue;
        for (let city in boxVenueO[country]) {
          boxVenue = city+", "+boxVenue;
          for (let venue in boxVenueO[country][city]) {
            boxVenue = venue+", "+boxVenue;
            /* for (let room in boxVenueO[country][city][venue]) {
              boxVenue = room+", "+boxVenue;
            } */
          }
        }  
      }
    }
    return boxVenue.trim();  
  }
});

eventSchema.virtual('fullSchedule').get(function (req) {
  //logger.info("EventShow virtual fullSchedule")
  //let schedulebydayvenue = [];
  let schedulebydayvenueObj = {};
  let ret = false;
  if (this.schedule && this.schedule.length) {
    const lang = this.$locals.locale;
    for(let a=0;a<this.schedule.length;a++){
      const startdate = new Date(new Date(this.schedule[a].starttime).setUTCHours(0,0,0,0));
      const enddate = new Date(new Date(this.schedule[a].endtime).setUTCHours(0,0,0,0));
      const enddatefake = new Date(new Date(this.schedule[a].endtime-(10*60*60*1000)).setUTCHours(0,0,0,0));
      let hs = ('0'+this.schedule[a].starttime.getUTCHours()).substr(-2);
      let ms = ('0'+this.schedule[a].starttime.getUTCMinutes()).substr(-2);
      let he = ('0'+this.schedule[a].endtime.getUTCHours()).substr(-2);
      let me = ('0'+this.schedule[a].endtime.getUTCMinutes()).substr(-2);
      for(let b=0;b<=(enddatefake-startdate)/(24*60*60*1000);b++){
        let day = new Date(startdate.getTime()+((24*60*60*1000)*b));
        let d = ('0'+day.getUTCDate()).substr(-2);
        let m = ('0'+(day.getUTCMonth()+1)).substr(-2);      
        let y = day.getUTCFullYear();
        if (this.schedule[a].venue) {
          if (!schedulebydayvenueObj[this.schedule[a].venue.name+"-"+this.schedule[a].venue.room]) schedulebydayvenueObj[this.schedule[a].venue.name+"-"+this.schedule[a].venue.room] = {dates:[], venue:this.schedule[a].venue};
          schedulebydayvenueObj[this.schedule[a].venue.name+"-"+this.schedule[a].venue.room].dates.push(y+"-"+m+"-"+d+"-"+hs+"-"+ms+"-"+he+"-"+me);
        }
      }
    }
    let schedulebydayvenueObjSorted = {};
    for (let item in schedulebydayvenueObj) {
      schedulebydayvenueObj[item].dates = schedulebydayvenueObj[item].dates.sort();
      if (!schedulebydayvenueObjSorted[schedulebydayvenueObj[item].dates.join("-")]) schedulebydayvenueObjSorted[schedulebydayvenueObj[item].dates.join("-")] = [];
      schedulebydayvenueObjSorted[schedulebydayvenueObj[item].dates.join("-")].push(schedulebydayvenueObj[item]);
    }
    let schedulebydayvenueObjGrouped = [];
    for (let item in schedulebydayvenueObjSorted) {
      var tmp = {
        start: schedulebydayvenueObjSorted[item][0].dates[0],
        end: schedulebydayvenueObjSorted[item][0].dates[schedulebydayvenueObjSorted[item][0].dates.length-1],
        venues: []
      };
      for (let venue in schedulebydayvenueObjSorted[item]) {
        tmp.venues.push(schedulebydayvenueObjSorted[item][venue].venue);
      }
      schedulebydayvenueObjGrouped.push(tmp);
    }
    let boxDates = [];
    for (let item in schedulebydayvenueObjGrouped) {
      let date = schedulebydayvenueObjGrouped[item].start.split("-");
      let starttime = new Date(date[0],date[1]-1,date[2],date[3],date[4],date[5],date[6]);
      date = schedulebydayvenueObjGrouped[item].end.split("-");
      let endtime = new Date(date[0],date[1]-1,date[2],date[3],date[4],date[5],date[6]);
      let boxVenueO = {};
      for (let venue in schedulebydayvenueObjGrouped[item].venues) {
        let v = schedulebydayvenueObjGrouped[item].venues[venue];
        if (v.type != 'virtual') {
          if (v.location && v.location.country && !boxVenueO[v.location.country]) boxVenueO[v.location.country] = {};
          if (v.location && v.location.country && v.location.locality && !boxVenueO[v.location.country][v.location.locality]) boxVenueO[v.location.country][v.location.locality] = {};
          if (v.location && v.location.country && v.location.locality && v.name && !boxVenueO[v.location.country][v.location.locality][v.name]) boxVenueO[v.location.country][v.location.locality][v.name] = [];
          if (v.location && v.location.country && v.location.locality && v.name && v.room && !boxVenueO[v.location.country][v.location.locality][v.name][v.room]) boxVenueO[v.location.country][v.location.locality][v.name][v.room] = {};
        } else if (v.type == 'virtual') {
          if (!boxVenueO['virtual']) boxVenueO['virtual'] = [];
          boxVenueO['virtual'].push(v)
        }
      }
      let boxVenue = "";
      for (let country in boxVenueO) {
        if (country == 'virtual') {
          for (let city in boxVenueO[country]) {
            if (boxVenueO[country][city].url) {
              boxVenue = "<a href=\""+boxVenueO[country][city].url+"\" target=\"_blank\">"+(boxVenueO[country][city].name ? boxVenueO[country][city].name : country)+"</a> "+boxVenue;
            } else {
              boxVenue = (boxVenueO[country][city].name ? boxVenueO[country][city].name : country)+" "+boxVenue;
            }
          }
        } else {
          boxVenue = country+" "+boxVenue;
          for (let city in boxVenueO[country]) {
            boxVenue = city+", "+boxVenue;
            for (let venue in boxVenueO[country][city]) {
              boxVenue = venue+", "+boxVenue;
              for (let room in boxVenueO[country][city][venue]) {
                boxVenue = room+", "+boxVenue;
              }
            }
          }
        }
      }
      boxDates.push(eventSchema.boxDateCreator(starttime, endtime, boxVenue, this.$locals.locale,this.$locals.moment));
    }
    //logger.info(boxDates);

    return boxDates;
  }
});

eventSchema.boxDateCreator = (starttime, endtime, boxVenue, lang, myMoment) => {
  //logger.info("function boxDateCreator")
  let boxDate;
  const startdate = new Date(new Date(starttime).setUTCHours(0,0,0,0));
  const enddate = new Date(new Date(endtime).setUTCHours(0,0,0,0));
  const enddatefake = new Date(new Date(endtime-(10*60*60*1000)).setUTCHours(0,0,0,0));
  if(startdate.toString()===enddatefake.toString()) {
    boxDate = myMoment(starttime).format(config.dateFormat[lang].weekdaydaymonthyear);
  } else {
    if (starttime.getFullYear()!==endtime.getFullYear()) {
      boxDate = myMoment(starttime).format(config.dateFormat[lang].weekdaydaymonthyear) + ' // ' + myMoment(endtime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear);
    } else {
      if (starttime.getMonth()!==endtime.getMonth()) {
        boxDate = myMoment(starttime).format(config.dateFormat[lang].daymonth1) + ' // ' + myMoment(endtime-(10*60*60*1000)).format(config.dateFormat[lang].daymonthyear);
      } else {
        boxDate = myMoment(starttime).format(config.dateFormat[lang].day1) + ' // ' + myMoment(endtime-(10*60*60*1000)).format(config.dateFormat[lang].day2);
      }
    }
  }
  return boxDate+" | "+boxVenue;
}

//eventSchema.plugin(indexPlugin());

const EventShow = mongoose.model('EventShow', eventSchema);

export default EventShow;
