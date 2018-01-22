const Schema = require('mongoose').Schema;

const MediaImage = new Schema({
  file: String,
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  width: Number,
  height: Number
});
module.exports = MediaImage;
