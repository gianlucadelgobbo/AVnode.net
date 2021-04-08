const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaImage = require('./shared/MediaImage');
const GalleryItem = require('./shared/GalleryItem');
const About = require('./shared/About');
const uniqueValidator = require('mongoose-unique-validator');

const adminsez = 'galleries';

const gallerySchema = new Schema({
  old_id : String,

  createdAt: Date,
  title: { type: String, trim: true, required: [true, 'GALLERY_TITLE_IS_REQUIRED'], minlength: [3, 'GALLERY_TITLE_IS_TOO_SHORT'], maxlength: [100, 'GALLERY_TITLE_IS_TOO_LONG'] },
  slug: { type: String, unique: true, trim: true, required: [true, 'GALLERY_URL_IS_REQUIRED'], minlength: [3, 'GALLERY_URL_IS_TOO_SHORT'], maxlength: [100, 'GALLERY_URL_IS_TOO_LONG'],
    validate: [(slug) => {
      var re = /^[a-z0-9-_]+$/;
      return re.test(slug)
    }, 'GALLERY_URL_IS_NOT_VALID']
  },
  is_public: { type: Boolean, default: false },
  image: MediaImage,
  //teaserImage: MediaImage,
  //  file: {file: String},
  abouts: [About],
  stats: {
    visits: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    img: { type: Number, default: 0 }
  },

  users: [{ type : Schema.ObjectId, ref : 'User' }], 
  performances: [{ type : Schema.ObjectId, ref : 'Performance' }], 
  events: [{ type : Schema.ObjectId, ref : 'EventShow' }], 
  medias: [GalleryItem]
}, {
  id: false,
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

// Return thumbnail
gallerySchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
    imageFormats[format] = process.env.WAREHOUSE+config.cpanel[adminsez].forms.public.components.image.config.sizes[format].default;
  }
  if (this.image && this.image.file) {
    //const serverPath = this.medias[0].file;
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/galleries_originals/', '/warehouse/galleries/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE+localPath+"/"+config.cpanel[adminsez].forms.public.components.image.config.sizes[format].folder+"/"+localFileNameWithoutExtension+"_"+localFileNameExtension+".jpg";
    }
  }
  return imageFormats;
});

/* gallerySchema.pre('remove', function (next) {
  const gallery = this;
  gallery.model('User').updateMany(
        { $pull: { galleries: gallery._id } },
        next
    );
  gallery.model('Crew').updateMany(
        { $pull: { galleries: gallery._id } },
        next
  );
  gallery.model('Event').updateMany(
        { $pull: { galleries: gallery._id } },
        next
    );
  gallery.model('Performance').updateMany(
        { $pull: { galleries: gallery._id } },
        next
    );
  gallery.model('User').updateMany(
        { $pull: { galleries: gallery._id } },
        next
    );
}); */
gallerySchema.plugin(uniqueValidator);

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
