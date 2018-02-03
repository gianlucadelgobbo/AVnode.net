const Schema = require('mongoose').Schema;

const Media = new Schema({
  file: String,
  filename: String,
  preview: String,
  originalname: String,
  mimetype: String,
  size: Number,
  width: Number,
  height: Number,

  encoded: { type: Boolean, default: false },
  users: [{ type : Schema.ObjectId, ref : 'User' }],
  stats: {},
  title: String,
  slug: { type: String, unique: true }
});

module.exports = Media;
