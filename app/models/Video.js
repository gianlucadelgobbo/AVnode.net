const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const indexPlugin = require('../utilities/elasticsearch/Video');
const helper = require('../utilities/helper');

const About = require('./shared/About');
const Media = require('./shared/Media');

const adminsez = 'videos';

const videoSchema = new Schema({
  old_id : String,

  creation_date: Date,
  slug: { type: String, unique: true },
  title: String,
  is_public: { type: Boolean, default: false },
  media: Media,
  // teaserImage: MediaImage,
  //  file: {file: String},
  abouts: [About],
  stats: {},
  programming:[Date],

  performances: [{ type : Schema.ObjectId, ref : 'Performances' }],
  events: [{ type : Schema.ObjectId, ref : 'Event' }],
  users: [{ type : Schema.ObjectId, ref : 'User' }],
  categories: [{ type : Schema.ObjectId, ref : 'Category' }]
}, {
  collection: 'videos',
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

// Return thumbnail
videoSchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.image);
  if (this.media && this.media.preview) {
    for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
      imageFormats[format] = config.cpanel[adminsez].forms.public.components.media.config.sizes[format].default;
    }
    const serverPath = this.media.preview;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    //const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/videos_originals/', process.env.WAREHOUSE+'/warehouse/videos/'); // /warehouse/2017/03
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/videos_previews/', process.env.WAREHOUSE+'/warehouse/videos/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
      imageFormats[format] = `${localPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
    }
  } else {
    for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
      imageFormats[format] = `${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].default}`;
    }
  }
  return imageFormats;
});

videoSchema.virtual('about').get(function (req) {
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
    about = about.trim().replace(/###b###/g , "<b>").replace(/###\/b###/g , "</b>").replace(/  /g , " ");

    about = helper.linkify(about);

    return about;
  }
});

videoSchema.virtual('description').get(function (req) {
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

/*
videoSchema.virtual('teaserImageFormats').get(function () {
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
videoSchema.virtual('editUrl').get(function () {
  return `/admin/videos/public/${this.slug}`;
});

videoSchema.virtual('publicUrl').get(function () {
  return `/videos/${this.slug}`;
});
*/

videoSchema.pre('remove', function(next) {
  const video = this;
  video.model('User').updateMany(
    { $pull: { videos: video._id } },
    next
  );
  video.model('Crew').updateMany(
    { $pull: { videos: video._id } },
    next
  );
});

/*
// FIXME: Rename in performer?
videoSchema.virtual('performers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'videos'
});

videoSchema.virtual('crews', {
  ref: 'User',
  localField: '_id',
  foreignField: 'videos'
});
// return thumbnail
videoSchema.virtual('squareThumbnailUrl').get(function () {
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
videoSchema.virtual('cardUrl').get(function () {
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
videoSchema.virtual('imageUrl').get(function () {
  let image = '/images/profile-default.svg';
  if (this.media) {
    image = `/storage/${this.media}/512/200`;
  }
  if (this.file && this.file.file) {
    image = `${process.env.WAREHOUSE}${this.file.file}`;
  }
  // console.log(image);
  return image;
});
*/

videoSchema.plugin(indexPlugin());

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
