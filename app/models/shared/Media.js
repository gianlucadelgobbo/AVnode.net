const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');

const Media = new Schema({
  title: String,
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
  rencoded: { type: Number, default: 0 },
  users: [{ type : Schema.ObjectId, ref : 'User' }],
  stats: {
    visits: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
}, {
  _id : false,
  id : false,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

Media.virtual('durationHR').get(function (req) {
  if (this.duration) {
    return moment.duration(this.duration).format('hh:mm:ss', {trim: false});
  }
});
Media.virtual('filesizeHR').get(function (req) {
  if (this.filesize) {
    return ( this.filesize / Math.pow(1024, Math.floor( Math.log(this.filesize) / Math.log(1024) )) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][Math.floor( Math.log(this.filesize) / Math.log(1024) )];
  }
});

module.exports = Media;
