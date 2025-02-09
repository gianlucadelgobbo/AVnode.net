import mongoose from 'mongoose';
const { Schema } = mongoose;

const MediaImage = new Schema({
  file: String,
  preview: String,
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  width: Number,
  height: Number
});
export default MediaImage;
