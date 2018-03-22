const PUBLIC = {
    
      old_id: String,
      creation_date: Date,
    
      slug: { type: String, unique: true },
      title: String,
      subtitles: [{
        lang: String, // removed { type: String, unique: true },
        abouttext: String
      }],
      image: {
        file: String,
        preview: String,
        filename: String,
        originalname: String,
        mimetype: String,
        size: Number,
        width: Number,
        height: Number
      },
      abouts: [{
        lang: String, // removed { type: String, unique: true },
        abouttext: String
      }], // BL multilang
      web: [{
        slug: String, // removed { type: String, unique: true },
        link: String,
        url: String,
        type: String,
        tel:String,
        mailinglists: [],
        is_public: { type: Boolean, default: false },
        is_confirmed: { type: Boolean, default: false },
        is_primary: { type: Boolean, default: false }
      }],
      social: [{
        slug: String, // removed { type: String, unique: true },
        link: String,
        url: String,
        type: String,
        tel:String,
        mailinglists: [],
        is_public: { type: Boolean, default: false },
        is_confirmed: { type: Boolean, default: false },
        is_primary: { type: Boolean, default: false }
      }],
      emails: [{
        slug: String, // removed { type: String, unique: true },
        link: String,
        url: String,
        type: String,
        tel:String,
        mailinglists: [],
        is_public: { type: Boolean, default: false },
        is_confirmed: { type: Boolean, default: false },
        is_primary: { type: Boolean, default: false }
      }],
      is_public: { type: Boolean, default: false },
      gallery_is_public: { type: Boolean, default: false },
      is_freezed: { type: Boolean, default: false },
      stats: {},
      schedule: [{
        date: Date,
        starttime: Date,
        endtime: Date,
        venue: {
            name: String,
            room: String,
            location: Address
          }
      }],
      partners: [{
        category:  { type : Schema.ObjectId, ref : 'Category' },
        users:  [{ type : Schema.ObjectId, ref : 'UserShow' }]
      }],
      program: [{
        schedule: {
          date: Date,
          starttime: Date,
          endtime: Date,
          data_i: String,
          data_f: String,
          ora_i: Number,
          ora_f: Number,
          rel_id: String,
          user_id: String,
          confirm: String,
          day: String,
          venue: Venue,
          categories: [{ type: Schema.ObjectId, ref: 'Category' }]
        },
        performance: { type: Schema.ObjectId, ref: 'Performance' }
      }],
      categories: [{ type: Schema.ObjectId, ref: 'Category' }],
      users:  [{ type: Schema.ObjectId, ref: 'UserShow' }],
      galleries: [{ type: Schema.ObjectId, ref: 'Gallery' }],
      videos: [{ type: Schema.ObjectId, ref: 'Video' }],
      settings: {
        permissions: {
            administrator: [{ type: Schema.ObjectId, ref: 'UserShow' }]
        }
      },
      organizationsettings: {
        program_builder: { type: Boolean, default: false },
        advanced_proposals_manager: { type: Boolean, default: false },
        call_is_active: { type: Boolean, default: false },
        call: {
          nextEdition: String,
          subImg: String,
          subBkg: String,
          colBkg: String,
          permissions: {},
          calls: [{
            title: String,
            email: String,
            permalink: String,
            start_date: Date,
            end_date: Date,
            admitted: [{ type: Schema.ObjectId, ref: 'Category' }],
            excerpt: String,
            terms: String,
            packages: [{
                name: String,
                price: Number,
                description: String,
                personal: { type: Boolean, default: false },
                requested: { type: Boolean, default: false },
                allow_multiple: { type: Boolean, default: false },
                allow_options: { type: Boolean, default: false },
                options_name: String,
                options: String,
                daily: { type: Boolean, default: false },
                start_date: Date,
                end_date: Date
              }],
            topics: [{
              name: String,
              description: String
            }]
          }]
        }
      }    
}
