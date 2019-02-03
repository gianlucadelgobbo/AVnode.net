const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

adminsez = "galleries";

const GalleryItem = new Schema({
  url: String,
  slug: { type: String/* , unique: true */ },
  file: String,
  original: String,
  filename: String,
  preview: String,
  originalname: String,
  mimetype: String,
  filesize: Number,
  duration: Number,
  width: Number,
  height: Number,

  encoded: { type: Number, default: 0 },
  users: [{ type : Schema.ObjectId, ref : 'User' }],
  stats: {
    visits: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  title: String,
}, {
  _id : false,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

GalleryItem.virtual('imageFormats').get(function () {
  let imageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.image);
  //if (this.medias && this.medias.length && this.medias[0].file) {
  if (this.file) {
    for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
      imageFormats[format] = config.cpanel[adminsez].forms.public.components.image.config.sizes[format].default;
    }
    //const serverPath = this.medias[0].file;
    const serverPath = this.file;
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
GalleryItem.virtual('imageFormats').get(function () {
  let imageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.image);
  //if (this.medias && this.medias.length && this.medias[0].file) {
  if (this.file) {
    for(let format in config.cpanel[adminsez].media.image.sizes) {
      imageFormats[format] = config.cpanel[adminsez].media.image.sizes[format].default;
    }
    //const serverPath = this.medias[0].file;
    const serverPath = this.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/warehouse/', process.env.WAREHOUSE+'/warehouse/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    for(let format in config.cpanel[adminsez].media.image.sizes) {
      imageFormats[format] = `${localPath}/${config.cpanel[adminsez].media.image.sizes[format].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
    }
  } else {
    for(let format in config.cpanel[adminsez].media.image.sizes) {
      imageFormats[format] = `${config.cpanel[adminsez].media.image.sizes[format].default}`;
    }
  }
  return imageFormats;
});
*/
module.exports = GalleryItem;
