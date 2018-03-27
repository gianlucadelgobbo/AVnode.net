const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const indexPlugin = require('../utilities/elasticsearch/Playlist');

const About = require('./shared/About');
const Media = require('./shared/Media');

const adminsez = 'playlists';

const playlistSchema = new Schema({
  old_id : String,

  creation_date: Date,
  slug: { type: String, unique: true },
  title: String,
  is_public: { type: Boolean, default: false },
  //image: MediaImage,
  abouts: [About],
  stats: {},
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
playlistSchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  console.log(this.media);
  for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
    imageFormats[format] = config.cpanel[adminsez].forms.public.components.media.config.sizes[format].default;
  }
  if (this.media && this.media.preview) {
    const serverPath = this.media.preview;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/footage_previews/', process.env.WAREHOUSE+'/warehouse/footage/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
      imageFormats[format] = `${localPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
    }
  }
  return imageFormats;
});
  /*
playlistSchema.virtual('teaserImageFormats').get(function () {
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
*/
playlistSchema.virtual('editUrl').get(function () {
  return `/admin/playlists/public/${this.slug}`;
});

playlistSchema.virtual('publicUrl').get(function () {
  return `/playlists/${this.slug}`;
});

playlistSchema.pre('remove', function(next) {
  const playlist = this;
  playlist.model('User').update(
    { $pull: { playlists: playlist._id } },
    next
  );
  playlist.model('Crew').update(
    { $pull: { playlists: playlist._id } },
    next
  );
});

/*
// FIXME: Rename in performer?
playlistSchema.virtual('performers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'playlists'
});

playlistSchema.virtual('crews', {
  ref: 'User',
  localField: '_id',
  foreignField: 'playlists'
});
// return thumbnail
playlistSchema.virtual('squareThumbnailUrl').get(function () {
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
playlistSchema.virtual('cardUrl').get(function () {
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
playlistSchema.virtual('imageUrl').get(function () {
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

playlistSchema.plugin(indexPlugin());

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
