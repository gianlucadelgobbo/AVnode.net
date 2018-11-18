const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminsez = 'galleries';

const Media = new Schema({
  url: String,
  slug: { type: String/* , unique: true */ },
  file: String,
  filename: String,
  preview: String,
  originalname: String,
  mimetype: String,
  filesize: Number,
  duration: Number,
  width: Number,
  height: Number,

  encoded: { type: Boolean, default: false },
  users: [{ type : Schema.ObjectId, ref : 'User' }],
  stats: {},
  title: String,
}, {
  _id : false,
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});
Media.virtual('imageFormats').get(function () {
  let imageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.image);
  //if (this.medias && this.medias.length && this.medias[0].file) {
  if (this.file) {
    for(let format in config.cpanel[adminsez].forms.public.components.medias.config.sizes) {
      imageFormats[format] = config.cpanel[adminsez].forms.public.components.medias.config.sizes[format].default;
    }
    //const serverPath = this.medias[0].file;
    const serverPath = this.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/galleries_originals/', process.env.WAREHOUSE+'/warehouse/galleries/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    for(let format in config.cpanel[adminsez].forms.public.components.medias.config.sizes) {
      imageFormats[format] = `${localPath}/${config.cpanel[adminsez].forms.public.components.medias.config.sizes[format].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
    }
  } else {
    for(let format in config.cpanel[adminsez].forms.public.components.medias.config.sizes) {
      imageFormats[format] = `${config.cpanel[adminsez].forms.public.components.medias.config.sizes[format].default}`;
    }
  }
  return imageFormats;
});
/*
Media.virtual('imageFormats').get(function () {
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
module.exports = Media;
