const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const indexPlugin = require('../plugins/elasticsearch/Crew');
// const About = require('./About');
const Link = require('./Link');
const Address = require('./Address');
const Category = require('./Category');

const crewSchema = new Schema({
  slug: { type: String, unique: true },
  performances: [{ type : Schema.ObjectId, ref : 'Performance' }],
  events: [{ type : Schema.ObjectId, ref : 'Event' }],
  galleries: [{ type : Schema.ObjectId, ref : 'Gallery' }],  
  members: [{ type : Schema.ObjectId, ref : 'User' }], 
  createdBy: { type : Schema.ObjectId, ref : 'User' },
  emails: [{
    email: String,
    is_public: {type: Boolean, default: false},
    is_primary: {type: Boolean, default: false},
    is_confirmed: { type: Boolean, default: false },
    confirm: String
  }],
  image: {type: Schema.ObjectId, ref: 'Asset'},
  teaserImage: {type: Schema.ObjectId, ref: 'Asset'},
  name: String,
  about: String,
  aboutlanguage: String,
  abouts: [], 
  // Organization Extra Data
  org_name: String,
  org_foundation_year: String,
  org_type: Category, 
  org_logo:  {type:	Schema.ObjectId, ref: 'Asset'},
  org_web_social_channels: String,
  org_web_social_channels_for_project_likes_shares: String,
  org_phone: String,
  description: String,
  org_aims_and_activities: String,
  org_pic_code: String,
  org_address: Address,
  org_vat_number: String,
  org_able_to_recuperate_vat: Boolean,
  org_official_registration_number: String,
  org_legal_representative_title: String,
  org_legal_representative_role: String,
  org_legal_representative_name: String,
  org_legal_representative_surname: String,
  org_legal_representative_email: String,
  org_legal_representative_mobile_phone: String,
  org_legal_representative_skype: String,
  org_legal_representative_facebook: String,
  org_contact_facebook: String,
  activity_season: String,
  org_statute: {type:	Schema.ObjectId, ref: 'Asset'},
  org_members_cv: {type:	Schema.ObjectId, ref: 'Asset'},
  org_activity_report: {type:	Schema.ObjectId, ref: 'Asset'},
  org_permanent_employees: String,
  org_permanent_employees_avnode: String,
  org_temporary_employees: String,
  org_temporary_employees_avnode: String,
  org_relevance_in_the_project: String,
  org_emerging_artists_definition: String,
  org_eu_grants_received_in_the_last_3_years: String,
  org_annual_turnover_in_euro: String,
  org_contact_title: String,
  org_contact_role: String,
  org_contact_name: String,
  org_contact_surname: String,
  org_contact_email: String,
  org_contact_language: String,
  org_contact_mobile_phone: String,
  org_contact_skype: String,
  org_website: String,
  org_public_email: String,
  activity_name: String,
  activity_logo: String,
  activity_start_date: String,
  activity_is_running: String,
  activity_end_date: String,
  activity_address: String,
  activity_website: String,
  activity_web_social_channels: String,
  activity_public_email: String,
  projects: [String],
  memberscvs: [{type:	Schema.ObjectId, ref: 'Asset'}],
  summaryofmemberscvs: String,
  activityreport: {type:	Schema.ObjectId, ref: 'Asset'},
  membershipdate: String,
  avnodedelegate: String,
  agreementstatus: String,
  introducedby1: String,
  introducedby2: String,
  links: [Link],
  linkWeb: String,
  linkSocial: String,
  linkTel: String,
  linkType: String,
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

/* crewSchema.virtual('members', {
  ref: 'User',
  localField: '_id',
  foreignField: 'crews'
}); */

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
