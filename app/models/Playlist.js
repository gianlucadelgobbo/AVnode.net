import config from 'getconfig';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
//import indexPlugin from '../utilities/elasticsearch/Playlist.js';
import helpers from '../utilities/helpers.js';

import About from './shared/About.js';
import Media from './shared/Media.js';


const adminsez = 'playlists';

const playlistSchema = new Schema({
  old_id : String,

  createdAt: Date,
  title: { type: String, trim: true, required: [true, 'PLAYLIST_TITLE_IS_REQUIRED'], minlength: [3, 'PLAYLIST_TITLE_IS_TOO_SHORT'], maxlength: [100, 'PLAYLIST_TITLE_IS_TOO_LONG'] },
  slug: { type: String, unique: true, trim: true, required: [true, 'PLAYLIST_URL_IS_REQUIRED'], minlength: [3, 'PLAYLIST_URL_IS_TOO_SHORT'], maxlength: [100, 'PLAYLIST_URL_IS_TOO_LONG'],
    validate: [(slug) => {
      var re = /^[a-z0-9-_]+$/;
      return re.test(slug)
    }, 'PLAYLIST_URL_IS_NOT_VALID']
  },
  is_public: { type: Boolean, default: false },
  //image: MediaImage,
  abouts: [About],
  stats: {
    visits: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  media: Media,
  users: [{ type : Schema.ObjectId, ref : 'User' }],
  footage: [{ type : Schema.ObjectId, ref : 'Footage' }],
  // videos: [{ type : Schema.ObjectId, ref : 'Videos' }],
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

// Return thumbnail
playlistSchema.virtual("imageFormats").get(function() {
  let imageFormats = {};
  if (this.media && (!this.media.encoded || this.media.encoded === 0)) {
    for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE + config.cpanel[adminsez].forms.public.components.media.config.sizes[format].tobeencoded;
    }  
  } else {
    for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE + config.cpanel[adminsez].forms.public.components.media.config.sizes[format].default;
    }  
  }
  if (this.media && this.media.preview) {
    const serverPath = this.media.preview;
    const localFileName = serverPath.substring(serverPath.lastIndexOf("/") + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf("/")).replace("/glacier/footage_previews/", "/warehouse/footage/"); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf("."));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf(".") + 1);
    for (let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE + localPath+"/"+config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder+"/"+localFileNameWithoutExtension+"_"+localFileNameExtension+".jpg";
    }
  }
  return imageFormats;
});


playlistSchema.virtual('about').get(function (req) {
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

playlistSchema.virtual('description').get(function (req) {
  if (this.abouts && this.abouts.length) {
    return helpers.makeDescription(this.abouts, this.$locals);
  }
});

playlistSchema.pre('remove', function(next) {
  const playlist = this;
  playlist.model('User').updateMany(
    { $pull: { playlists: playlist._id } },
    next
  );
  playlist.model('Crew').updateMany(
    { $pull: { playlists: playlist._id } },
    next
  );
});

//playlistSchema.plugin(indexPlugin());

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;
