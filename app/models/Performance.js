const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const indexPlugin = require('../utilities/elasticsearch/Performance');

const About = require('./shared/About');
const MediaImage = require('./shared/MediaImage');
const Venue = require('./shared/Venue');

const adminsez = 'performances';

const Booking = new Schema({
  schedule: {
      date: Date,
      starttime: Date,
      endtime: Date,
      data_i: String,
      data_f: String,
      ora_i: Number,
      ora_f: Number,
      rel_id: Number,
      user_id: Number,
      confirm: String,
      day: String,
      venue: Venue,
      categories: [{ type: Schema.ObjectId, ref: 'Category' }]
  },
  event: [{ type: Schema.ObjectId, ref: 'Event' }]
});

const Techreq = new Schema({
  lang: String,
  text: String
})

const performanceSchema = new Schema({
  old_id : String,

  creation_date: Date,
  slug: { type: String, unique: true },
  title: String,
  is_public: { type: Boolean, default: false },
  image: MediaImage,
  abouts: [About],
  stats: {},
  price: String,
  duration: String,
  tech_arts: [About], // what the artist brings
  tech_reqs: [About], // what the artist need
  bookings:[Booking],

  users: [{ type : Schema.ObjectId, ref : 'User' }],
  galleries: [{ type : Schema.ObjectId, ref : 'Gallery' }],
  videos: [{ type: Schema.ObjectId, ref: 'Video' }],
  categories: [{ type : Schema.ObjectId, ref : 'Category' }]
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
    return about;
  }
});

performanceSchema.virtual('tech_req').get(function (req) {
  let tech_req = __('Nothing');
  let tech_reqA = [];
  if (this.tech_reqs && this.tech_reqs.length) {
    tech_reqA = this.tech_reqs.filter(item => item.lang === global.getLocale());
    if (tech_reqA.length && tech_reqA[0].abouttext) {
      tech_req = tech_reqA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      tech_reqA = this.tech_reqs.filter(item => item.lang === config.defaultLocale);
      if (tech_reqA.length && tech_reqA[0].abouttext) {
        tech_req = tech_reqA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    return tech_req;
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
  }
  return tech_art;
});


// Return thumbnail
performanceSchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.image);
  if (this.image && this.image.file) {
    for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
      imageFormats[format] = config.cpanel[adminsez].forms.image.components.image.config.sizes[format].default;
    }
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/performances_originals/', process.env.WAREHOUSE+'/warehouse/performances/'); // /warehouse/2017/03
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
performanceSchema.virtual('teaserImageFormats').get(function () {
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

performanceSchema.virtual('editUrl').get(function () {
  return `/admin/performances/public/${this.slug}`;
});

performanceSchema.virtual('publicUrl').get(function () {
  return `/performances/${this.slug}`;
});
*/
performanceSchema.pre('remove', function(next) {
  const performance = this;
  performance.model('User').update(
    { $pull: { performances: performance._id } },
    next
  );
  performance.model('Crew').update(
    { $pull: { performances: performance._id } },
    next
  );
});

/*
// FIXME: Rename in performer?
performanceSchema.virtual('performers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'performances'
});

performanceSchema.virtual('crews', {
  ref: 'User',
  localField: '_id',
  foreignField: 'performances'
});
// return thumbnail
performanceSchema.virtual('squareThumbnailUrl').get(function () {
  let squareThumbnailUrl = '/images/profile-default.svg';

  if (this.file && this.file.file) {
    const serverPath = this.file.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(1, serverPath.lastIndexOf('/')); // warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    squareThumbnailUrl = `${process.env.WAREHOUSE}/${localPath}/55x55/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
  }
  return squareThumbnailUrl;
});
// return card img
performanceSchema.virtual('cardUrl').get(function () {
  let cardUrl = '/images/profile-default.svg';

  if (this.file && this.file.file) {
    const serverPath = this.file.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(1, serverPath.lastIndexOf('/')); // warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    cardUrl = `${process.env.WAREHOUSE}/${localPath}/400x300/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
  }
  return cardUrl;
});

// return original image
performanceSchema.virtual('imageUrl').get(function () {
  let image = '/images/profile-default.svg';
  if (this.image) {
    image = `/storage/${this.image}/512/200`;
  }
  if (this.file && this.file.file) {
    image = `${process.env.WAREHOUSE}${this.file.file}`;
  }
  // console.log(image);
  return image;
});
*/

performanceSchema.plugin(indexPlugin());

const Performance = mongoose.model('Performance', performanceSchema);

module.exports = Performance;
