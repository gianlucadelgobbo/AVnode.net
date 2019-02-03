const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaImage = require('./shared/MediaImage');
const GalleryItem = require('./shared/GalleryItem');
const About = require('./shared/About');

const adminsez = 'galleries';

const gallerySchema = new Schema({
  old_id : String,

  createdAt: Date,
  slug: { type: String, unique: true, trim: true, required: true, minlength: 3, maxlength: 50 },
  title: { type: String, trim: true, required: true, maxlength: 50 },
  is_public: { type: Boolean, default: false },
  image: MediaImage,
  teaserImage: MediaImage,
  //  file: {file: String},
  abouts: [About],
  stats: {
    visits: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },

  users: [{ type : Schema.ObjectId, ref : 'User' }], 
  performances: [{ type : Schema.ObjectId, ref : 'Performance' }], 
  events: [{ type : Schema.ObjectId, ref : 'EventShow' }], 
  medias: [GalleryItem]
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
gallerySchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.image);
  //if (this.medias && this.medias.length && this.medias[0].file) {
  if (this.image && this.image.file) {
    for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
      imageFormats[format] = config.cpanel[adminsez].forms.public.components.image.config.sizes[format].default;
    }
    //const serverPath = this.medias[0].file;
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/galleries_originals/', process.env.WAREHOUSE+'/warehouse/galleries/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
      imageFormats[format] = `${localPath}/${config.cpanel[adminsez].forms.public.components.image.config.sizes[format].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
    }
  } else {
    for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
      imageFormats[format] = `${config.cpanel[adminsez].forms.public.components.image.config.sizes[format].default}`;
    }
  }
  return imageFormats;
});
/*
gallerySchema.virtual('medias2').get(function () {
  if (this.medias) {
    let mediaFormats = [];
    for(let image in this.medias) {
      let imageFormats = {};
      //console.log(config.cpanel[adminsez].sizes.image);
      //if (this.medias && this.medias.length && this.medias[0].file) {
      if (this.medias[image] && this.medias[image].file) {
        for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
          imageFormats[format] = config.cpanel[adminsez].forms.public.components.image.config.sizes[format].default;
        }
        //const serverPath = this.medias[0].file;
        const serverPath = this.medias[image].file;
        const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/galleries_originals/', process.env.WAREHOUSE+'/warehouse/galleries/'); // /warehouse/2017/03
        const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
        const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
        // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
          imageFormats[format] = `${localPath}/${config.cpanel[adminsez].forms.public.components.image.config.sizes[format].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
        }
      } else {
        for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
          imageFormats[format] = `${config.cpanel[adminsez].forms.public.components.image.config.sizes[format].default}`;
        }
      }
      mediaFormats.push({title:this.medias[image].title,slug:this.medias[image].slug,imageFormats:imageFormats});
    }
    return mediaFormats;  
  }
});

gallerySchema.virtual('teaserImageFormats').get(function () {
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


gallerySchema.virtual('editUrl').get(function () {
  return `/admin/galleries/public/${this.slug}`;
});

gallerySchema.virtual('publicUrl').get(function () {
  return `/galleries/${this.slug}`;
});
*/

gallerySchema.pre('remove', function (next) {
  const gallery = this;
  gallery.model('User').updateMany(
        { $pull: { galleries: gallery._id } },
        next
    );
  /*gallery.model('Crew').updateMany(
        { $pull: { galleries: gallery._id } },
        next
  );*/
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
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
