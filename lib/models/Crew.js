const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const indexPlugin = require('../plugins/elasticsearch/Crew');
const About = require('./About');

const crewSchema = new Schema({
  slug: { type: String, unique: true },
  performances: [{ type : Schema.ObjectId, ref : 'Performance' }],
  events: [{ type : Schema.ObjectId, ref : 'Event' }],
  emails: [{
    email: String,
    is_public: {type: Boolean, default: false},
    is_primary: {type: Boolean, default: false},
    is_confirmed: { type: Boolean, default: false },
    confirm: String
  }],
  image: {type:	Schema.ObjectId, ref: 'Asset'},
  teaserImage: {type:	Schema.ObjectId, ref: 'Asset'},
  name: String,
  about: String,
  aboutlanguage: String, // BL about default language
  abouts: [About], // BL TODO frontend, multilang needed
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

crewSchema.virtual('members', {
  ref: 'User',
  localField: '_id',
  foreignField: 'crews'
});

crewSchema.virtual('editUrl').get(function () {
  return process.env.BASE + 'account/crews/' + this.slug;
});

crewSchema.virtual('publicUrl').get(function () {
  return process.env.BASE + 'crews/' + this.slug;
});

crewSchema.pre('remove', function(next) {
  const crew = this;
  crew.model('User').update(
    { $pull: { crews: crew._id } },
    next
  );
});

crewSchema.plugin(indexPlugin());

const Crew = mongoose.model('Crew', crewSchema);
module.exports = Crew;
