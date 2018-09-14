const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminsez = 'gallery';

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
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});
/*
Media.virtual('files').get(function () {
  console.log('filesfilesfilesfilesfilesfilesfilesfiles');
  if (this.file) {
    //const pre = '';
    const pre = process.env.WAREHOUSE;
    
    const serverPath = this.file;
    const localFileNameExtension = serverPath.substring(serverPath.lastIndexOf('.') + 1);
    if (localFileNameExtension == "mp4") {
      const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
      const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/warehouse/', process.env.WAREHOUSE+'/warehouse/'); // /warehouse/2017/03
      const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
      console.log(localFileName);
      const localFileNameOriginalExtension = localFileName.substring(localFileName.lastIndexOf('_') + 1, localFileName.lastIndexOf('.'));
      const localFileNameWithoutOriginalExtension = localFileName.substring(0, localFileName.lastIndexOf('_'));
      const files = {
        file: pre+this.file,
        previewFile: `${localPath}/preview_files/${localFileNameWithoutExtension}.png`,
        originalFile: `${localPath}/original_video/${localFileNameWithoutOriginalExtension}.${localFileNameOriginalExtension}`,
        fileNew: this.file.replace('/warehouse/', '/warehouse/videos/'),
        previewFileNew: `${localPath}/preview_files/${localFileNameWithoutExtension}.png`.replace('https://flxer.net/warehouse/','/warehouse/videos/'),
        originalFileNew: `${localPath}/${localFileNameWithoutOriginalExtension}.${localFileNameOriginalExtension}`.replace('https://flxer.net/warehouse/','/warehouse/videos_originals/'),
      };

      console.log(files);

      return files;
    }
  }
});
*/
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
