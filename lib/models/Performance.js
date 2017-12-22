const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const indexPlugin = require('../plugins/elasticsearch/Performance');
// const About = require('./About');
const Category = require('./Category');

const performanceSchema = new Schema({
  slug: { type: String, unique: true },
  image: {type:	Schema.ObjectId, ref: 'Asset'},
  events: [{ type : Schema.ObjectId, ref : 'Event' }],
  teaserImage: {type:	Schema.ObjectId, ref: 'Asset'},
  file: {file: String},
  galleries: [{ type : Schema.ObjectId, ref : 'Gallery' }],  
  title: String,
  about: String,
  aboutlanguage: String,
  abouts: [],
  categories: [Category],
  // BL TODO put back on next import tech_art: String, // what the artist brings
  // BL TODO put back on next import tech_req: String, // what the artist need
  is_public: { type: Boolean, default: false },
  video: { type: Schema.ObjectId, ref: 'Asset' }
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

// FIXME: Rename in performer?
performanceSchema.virtual('performers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'performances'
});

performanceSchema.virtual('crews', {
  ref: 'User',
  localField: '_id',
  foreignField: 'performances'
});

performanceSchema.virtual('editUrl').get(function () {
  return `${process.env.BASE}account/performances/${this.slug}`;
});

performanceSchema.virtual('publicUrl').get(function () {
  return `${process.env.BASE}performances/${this.slug}`;
});
// return thumbnail
performanceSchema.virtual('squareThumbnailUrl').get(function () {
  let squareThumbnailUrl = '/images/profile-default.svg';

  if (this.file && this.file.file) {
    const serverPath = this.file.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(1, serverPath.lastIndexOf('/')); // warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    squareThumbnailUrl = `${process.env.WAREHOUSE}/${localPath}/55x55/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
  }
  return squareThumbnailUrl;
});
// return card img
performanceSchema.virtual('cardUrl').get(function () {
  let cardUrl = '/images/profile-default.svg';

  if (this.file && this.file.file) {
    const serverPath = this.file.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(1, serverPath.lastIndexOf('/')); // warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    cardUrl = `${process.env.WAREHOUSE}/${localPath}/400x300/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
  }
  return cardUrl;
});

// return original image
performanceSchema.virtual('imageUrl').get(function () {
  let image = '/images/profile-default.svg';
  if (this.image) {
    image = `/storage/${this.image}/512/200`;
  }
  if (this.file && this.file.file) {
    image = `${process.env.WAREHOUSE}${this.file.file}`;
  }
  // console.log(image);
  return image;
});

performanceSchema.pre('remove', function(next) {
  const performance = this;
  performance.model('User').update(
    { $pull: { performances: performance._id } },
    next
  );
  performance.model('Crew').update(
    { $pull: { performances: performance._id } },
    next
  );
});

performanceSchema.plugin(indexPlugin());

const Performance = mongoose.model('Performance', performanceSchema);
module.exports = Performance;
