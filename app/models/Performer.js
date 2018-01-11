const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const indexPlugin = require('../utilities/elasticsearch/Performer');
const async = require('async');
const imageUtil = require('../utilities/image');
const assetUtil = require('../utilities/asset');
const Category = require('./Category');

const performerSchema = new Schema({
  slug: { type: String, unique: true },
  stagename: { type: String, unique: true },
  /*
  events: [{ type: Schema.ObjectId, ref: 'Event' }],
  crews: [{ type: Schema.ObjectId, ref: 'Crew' }],
  members: [{ type: Schema.ObjectId, ref: 'User' }],
  performances: [{ type: Schema.ObjectId, ref: 'Performance' }],
  galleries: [{ type: Schema.ObjectId, ref: 'Gallery' }],
  categories: [Category],
  is_crew: Boolean,
  street_number: String,
  errorMessage: String,
  route: String,
  postal_code: String,
  locality: String,
  administrative_area_level_1: String,
  country: String,
  addresses: [],
  email: { type: String, unique: true },
  emails: [{
    email: String,
    is_public: { type: Boolean, default: false },
    is_primary: { type: Boolean, default: false },
    is_confirmed: { type: Boolean, default: false },
    mailinglists: [],
    confirm: String
  }],
  links: [],
  linksSocial: [],
  linksTel: [],
  username: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  image: { type: Schema.ObjectId, ref: 'Asset' },
  teaserImage: { type: Schema.ObjectId, ref: 'Asset' },
  file: { file: String },
  is_confirmed: { type: Boolean, default: false },
  confirm: String,
  tokens: Array,
  gender: String,
  name: String,
  surname: String,
  language: String, // BL TODO navigator or user.settings or subdomain language
  about: String, // BL for the frontend
  aboutlanguage: String, // BL for the frontend, issue #5, about default language is english
  abouts: [],
  citizenship: [], // BL TODO frontend, issue #5, modified, was a string
  roles: [], // BL TODO frontend, issue #5, array of roles
  activity: Number, // BL TODO frontend, issue #5, added
  connections: [], // BL TODO frontend, issue #5, added
  birthday: Date,
  // Organization Extra Data
  org_name: String,
  org_foundation_year: Date,
  org_type: String, 
  org_logo:  {type:	Schema.ObjectId, ref: 'Asset'},
  org_web_social_channels: [],
  org_web_social_channels_for_project_likes_shares: String,
  org_phone: [],
  description: String,
  org_aims_and_activities: String,
  org_pic_code: String,
  org_address: [],
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
  */
}, {
  collection: 'users',
  timestamps: true,
  toObject: {
    virtuals: false // BL FIXME check http://mongoosejs.com/docs/api.html#schema_Schema-virtual
  },
  toJSON: {
    virtuals: true
  }
});



performerSchema.plugin(indexPlugin());

const Performer = mongoose.model('Performer', performerSchema);

module.exports = Performer;
