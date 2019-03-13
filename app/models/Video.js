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

  createdAt: Date,
  slug: { type: String, unique: true, trim: true, required: true, minlength: 3, maxlength: 50 },
  title: { type: String, trim: true, required: true, maxlength: 50 },
  is_public: { type: Boolean, default: false },
  media: Media,
  // teaserImage: MediaImage,
  //  file: {file: String},
  abouts: [About],
  stats: {
    visits: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
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
  for(let format in config.cpanel[adminsez].forms.video.components.media.config.sizes) {
    imageFormats[format] = process.env.WAREHOUSE+config.cpanel[adminsez].forms.video.components.media.config.sizes[format].default;
  }
  if (this.media && this.media.preview) {
    const serverPath = this.media.preview;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    //const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/videos_originals/', process.env.WAREHOUSE+'/warehouse/videos/'); // /warehouse/2017/03
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/videos_previews/', '/warehouse/videos_previews/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    for(let format in config.cpanel[adminsez].forms.video.components.media.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE+localPath+"/"+config.cpanel[adminsez].forms.video.components.media.config.sizes[format].folder+"/"+localFileNameWithoutExtension+"_"+localFileNameExtension+".jpg";
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
    about = about.replace(new RegExp(/\n/gi)," <br />");

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
    about = about.replace(new RegExp(/<(?:.|\n)*?>/gm), "").trim().replace(/  /g , " ");

    descriptionA = about.split(" ");
    let descriptionShort = "";
    for(let item in descriptionA) if ((descriptionShort+" "+descriptionA[item]).trim().length<300) descriptionShort+=descriptionA[item]+" ";
    descriptionShort = descriptionShort.trim();
    if (descriptionShort.length < about.length) descriptionShort+"..."
    return descriptionShort;
  }
});

/* videoSchema.pre('remove', function(next) {
  const video = this;
  video.model('User').updateMany(
    { $pull: { videos: video._id } },
    next
  );
  video.model('Crew').updateMany(
    { $pull: { videos: video._id } },
    next
  );
}); */

//videoSchema.plugin(indexPlugin());

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
