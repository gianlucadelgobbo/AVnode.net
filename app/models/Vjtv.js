const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vjtvSchema = new Schema({
  createdAt: Date,
  programming: Date,
  video: { type : Schema.ObjectId, ref : 'Video' },
  category: { type : Schema.ObjectId, ref : 'Category' },
}, {
  collection: 'vjtvs',
  id: false,
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});


const Vjtv = mongoose.model('Vjtv', vjtvSchema);

module.exports = Vjtv;
