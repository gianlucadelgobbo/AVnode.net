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
  for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
    imageFormats[format] = process.env.WAREHOUSE+config.cpanel[adminsez].forms.public.components.image.config.sizes[format].default;
  }
  if (this.file) {
    //const serverPath = this.medias[0].file;
    const serverPath = this.file;
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

module.exports = GalleryItem;
