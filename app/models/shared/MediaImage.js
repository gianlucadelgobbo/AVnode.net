const Schema = require('mongoose').Schema;

const MediaImage = new Schema({
  file: String,
  preview: String,
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  width: Number,
  height: Number
},{ _id : false });
module.exports = MediaImage;
