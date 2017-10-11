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
  org_logo:  {type:	Schema.ObjectId, ref: 'Asset'},
  org_web_social_channels: String,
  org_web_social_channels_for_project_likes_shares: String,
  org_phone: String,
  description: String,
  org_foundation_year: String,
  org_address: Address,
  org_vat_number: String,
  org_able_to_recuperate_vat: Boolean,
  org_official_registration_number: String,
  projects: [String],
  org_pic_code: String,
  org_type: Category,
  org_statute: {type:	Schema.ObjectId, ref: 'Asset'},
  memberscvs: [{type:	Schema.ObjectId, ref: 'Asset'}],
  summaryofmemberscvs: String,
  activityreport: {type:	Schema.ObjectId, ref: 'Asset'},
  org_permanent_employers: String,
  org_permanent_employers_avnode: String,
  org_temporary_employers: String,
  org_temporary_employers_avnode: String,
  org_relevance_in_the_project: String,
  org_emerging_artists_definition: String,
  org_eu_grants_received_in_the_last_3_years: String,
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
