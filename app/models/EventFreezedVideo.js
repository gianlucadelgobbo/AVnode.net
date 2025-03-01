import config from 'getconfig';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
//const indexPlugin from '../utilities/elasticsearch/Video.js';
import helpers from '../utilities/helpers.js';

import About from './shared/About.js';
import Media from './shared/Media.js';


const adminsez = 'event_videos';

const videoSchema = new Schema({
  old_id : String,
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  video_original: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },

  createdAt: Date,
  title: { type: String, trim: true, required: [true, 'VIDEO_TITLE_IS_REQUIRED'], minlength: [3, 'VIDEO_TITLE_IS_TOO_SHORT'], maxlength: [100, 'VIDEO_TITLE_IS_TOO_LONG'] },
  slug: { type: String, trim: true, required: [true, 'VIDEO_URL_IS_REQUIRED'], minlength: [3, 'VIDEO_URL_IS_TOO_SHORT'], maxlength: [100, 'VIDEO_URL_IS_TOO_LONG'],
    validate: [(slug) => {
      var re = /^[a-z0-9-_]+$/;
      return re.test(slug)
    }, 'VIDEO_URL_IS_NOT_VALID']
  },
  is_public: { type: Boolean, default: false },
  vjtv_exclude: { type: Boolean, default: false },
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
  collection: 'event_freezed_videos',
  id: false,
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});
videoSchema.index({ event: 1, video_original: 1 }, { unique: true });

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
    about = about.replace(new RegExp(/\n/gi)," <br />");

    about = helpers.linkify(about);

    return about;
  }
});

videoSchema.virtual('description').get(function (req) {
  if (this.abouts && this.abouts.length) {
    return helpers.makeDescription(this.abouts, this.$locals);
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

const EventFreezedVideo = mongoose.model('EventFreezedVideo', videoSchema);

export default EventFreezedVideo;
