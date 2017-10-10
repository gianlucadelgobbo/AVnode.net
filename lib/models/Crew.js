const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const indexPlugin = require('../plugins/elasticsearch/Crew');
const About = require('./About');
const Address = require('./Address');
const Category = require('./Category');

const crewSchema = new Schema({
  slug: { type: String, unique: true },
  performances: [{ type : Schema.ObjectId, ref : 'Performance' }],
  events: [{ type : Schema.ObjectId, ref : 'Event' }],
  galleries: [{ type : Schema.ObjectId, ref : 'Gallery' }],  
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
  aboutlanguage: String,
  abouts: [About], 
  // Organization Extra Data
  logo:  {type:	Schema.ObjectId, ref: 'Asset'},
  websocialchannels: String,
  websocialchannelsforlikesshares: String,
  phone: String,
  description: String,
  foundationyear: String,
  legaladdress: Address,
  vatnumber: String,
  recuperatevat: Boolean,
  officialregistrationnumber: String,
  projects: [String],
  pic: String,
  type: Category,
  statute: {type:	Schema.ObjectId, ref: 'Asset'},
  memberscvs: [{type:	Schema.ObjectId, ref: 'Asset'}],
  summaryofmemberscvs: String,
  activityreport: {type:	Schema.ObjectId, ref: 'Asset'},
  permanentemployers: String,
  permanentemployersavnode: String,
  temporaryemployers: String,
  temporaryemployersavnode: String,
  relevanceintheproject: String,
  emergingartists: String,
  eugrants: String,
  membershipdate: String,
  avnodedelegate: String,
  agreementstatus: String,
  introducedby1: String,
  introducedby2: String,
  activities: [{
    name: String,
    description: String,
    img: {type:	Schema.ObjectId, ref: 'Asset'},
    foundationyear: String,
    gallery:  [{ type : Schema.ObjectId, ref : 'Gallery' }],
    url: [String],
    editions: [{
      audience : Number,
      event: { type : Schema.ObjectId, ref : 'Event' }
    }]
  }]
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
