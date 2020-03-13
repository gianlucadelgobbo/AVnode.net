const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const Media = new Schema({
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
  title: String,
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
    return moment(this.duration).format("h:mm:ss");
  }
});

module.exports = Media;
