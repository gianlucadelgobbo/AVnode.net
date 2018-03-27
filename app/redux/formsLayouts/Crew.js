const PUBLIC = {
  slug: {
    comp: 'simpletext'
    label: 'Crew url',
    required: true,
    unique: true,
    validators: {
      'String': {min: 3, max: 50},
      'Unique': 'admin/api...'
    }
  },
  stagename: {
    comp: 'simpletext'
    label: 'Crew name',
    required: true,
    unique: true,
    validators: {
      'String': {min: 3, max: 50},
      'Unique': 'admin/api...'
    }
  },
  abouts: {
    schema: 'shared/About'
    comp: 'textarea_multilang'
    label: 'About crew',
    validators: {
      'String': {min: 0, max: 50000}
    }
  },
  web: {
    schema: 'shared/Link'
    comp: 'multilink'
    label: 'Websites',
    validators: {
      'Url': {}
    }
  },
  social: {
    comp: 'multilink'
    label: 'Websites',
    validators: {
      'Url': {}
    }
  },
};

const IMAGE = {
  image: {
    comp: 'uploader'
    label: 'Crew Image',
    validators: {
      'Mime': {},
      'Weight' : {},
      'Size': {}
    }
  },
}

const MEMBERS = {
  members: [{ type: Schema.ObjectId, ref: 'User' }],
}

const ORG_DATA = {
  name: String,
  foundation_year: Date,
  type: String,
  logo:  MediaImage,
  phone: String,
  description: String,
  links: [],
  /*
  web_social_channels: [],
  web_social_channels_for_project_likes_shares: String,
  */
  public_email: String,
  pic_code: String,
  address: [],
  vat_number: String,
  able_to_recuperate_vat: Boolean,
  official_registration_number: String,
  legal_representative_title: String,
  legal_representative_role: String,
  legal_representative_name: String,
  legal_representative_surname: String,
  legal_representative_email: String,
  legal_representative_mobile_phone: String,
  legal_representative_skype: String,
  legal_representative_facebook: String,
  statute: MediaImage,
  members_cv: MediaImage,
  activity_report: MediaImage,
  permanent_employees: String,
  permanent_employees_avnode: String,
  temporary_employees: String,
  temporary_employees_avnode: String,
  relevance_in_the_project: String,
  emerging_artists_definition: String,
  eu_grants_received_in_the_last_3_years: String,
  annual_turnover_in_euro: String,
  contacts: [{
    contact_title: String,
    contact_role: String,
    contact_name: String,
    contact_surname: String,
    contact_email: String,
    contact_language: String,
    contact_mobile_phone: String,
    contact_skype: String,
    contact_facebook: String
  }],
  summaryofmemberscvs: String,
  membershipdate: String,
  avnodedelegate: String,
  agreementstatus: String,
  introducedby1: String,
  introducedby2: String,
  activities: [{
    name: String,
    description: String,
    logo: MediaImage,
    foundationyear: String,
    start_date: String,
    is_running: String,
    end_date: String,
    address: String,
    links: [],
    season: String,
    gallery:  [{ type : Schema.ObjectId, ref : 'Gallery' }],
    editions: [{
    audience : Number,
    event: { type : Schema.ObjectId, ref : 'Event' }
    }]
  }]
}
