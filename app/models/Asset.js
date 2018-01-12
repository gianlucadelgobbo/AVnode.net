const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  height: Number,
  width: Number,
  origin: {
    type: Schema.ObjectId,
    ref: 'Asset'
  }
});

const externalVideoSchema = new Schema({
  type: String, // Hoster (youtube, vimeo … )
  id: String, // Video id
  url: String
});

const assetSchema = new Schema({
  owner: {
    ref: 'User',
    type: Schema.ObjectId
  },
  identifier: {
    type: String, // Identifier for access through /storage/{identifier}
    unique: true
  },
  publicUrl: String,
  type: String,
  image: imageSchema,
  video: externalVideoSchema,
  origin: {
    type: Schema.ObjectId,
    ref: 'Asset'
  }
});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;
