const NO_FORM = {
  old_id: String,
  stats: {},
  creation_date: Date,
}
const PUBLIC = {
  categories: [{
    comp: 'simpleselect',
    label: 'Event name',
    required: true,
    unique: true,
    validators: {
        'Array_max_length': 2
   }}]
  },
  schedule: [{
    date: {
      comp: 'date_picker',
      label: 'Date',
      required: true,
      unique: false,
      validators: {
          'is_date': {}
      }
    },
    starttime: {
      comp: 'time_picker',
      label: 'Start time',
      required: true,
      unique: false,
      validators: {
          'is_date': {}
      }
    },
    endtime: {
      comp: 'time_picker',
      label: 'End time',
      required: true,
      unique: false,
      validators: {
          'is_date': {}
      }
    },
    venue: {
      venue: {
        comp: 'google_venue',
        label: 'Venue name',
        required: true,
        unique: false,
        validators: {
          'String': {min: 3, max: 50},
          'geolocation': {min: 3, max: 50},
        }
      },
      room: {
        comp: 'simpletext',
        label: 'Room name',
        required: false,
        unique: false,
        validators: {
            'String': {min: 3, max: 50},
        }
      },
    }
 }],
  slug: {
    comp: 'simpletext',
    label: 'Event url',
    required: true,
    unique: true,
    validators: {
        'String': {min: 3, max: 50},
        'Unique': 'admin/api...'
    }
  },
  title: {
    comp: 'simpletext',
    label: 'Event name',
    required: true,
    unique: true,
    validators: {
        'String': {min: 3, max: 50},
        'Unique': 'admin/api...'
    }
  },
  subtitles: {
    schema: 'shared/About',
    comp: 'textarea_multilang',
    label: 'Event subtitle',
    validators: {
        'String': {min: 0, max: 300}
    }
  },
  abouts: {
    schema: 'shared/About',
    comp: 'textarea_multilang',
    label: 'Event description',
    validators: {
        'String': {min: 0, max: 50000}
    }
  },
  web: {
    schema: 'shared/Link',
    comp: 'multilink',
    label: 'Websites',
    validators: {
      'Url': {}
    }
  },
  social: {
    schema: 'shared/Link',
    comp: 'multilink',
    label: 'Social networks',
    validators: {
      'Url': {}
    }
  },
  emails: {
    schema: 'shared/Link',
    comp: 'multilink',
    label: 'Email contacts',
    validators: {
        'Email': {}
    }
  },
  phones: {
    schema: 'shared/Link',
    comp: 'multilink',
    label: 'Phone contacts',
    validators: {
        'Phone': {}
    }
  }
}

const IMAGE = {
  image: {
      comp: 'uploader',
      label: 'Event Image',
      validators: {
          'Mime': {},
          'Weight' : {},
          'Size': {}
      }
  },
}

const USERS = {
  //users:  [{ type: Schema.ObjectId, ref: 'UserShow'}}], TO DELETE
  partners: {
    comp: 'list_and_add_to_category', // relation manager
    rel_obj: 'User',
    list_fields: ['Stage name', 'partnership_category', 'slug'],
    list_actions: ['add', 'remove', 'edit_partnership_category', 'sort', 'view_sort'],
    add_form_search: ['Stage name', 'set_partnership_category'],
    view_sort_modes: ['Stage name', 'custom_order', 'partnership_category'],
    rel_api: '/admin/api/...'
    label: 'Event Production and partners',
    validators: {
      'Confirm': {}
    }
  }
}

const PROGRAM = {
  program: [{
    schedule: {
      programday: {
        comp: 'date_picker',
        label: 'Date',
        required: true,
        unique: false,
        validators: {
            'is_date': {}
        }
      },
      startdate: {
        comp: 'date_picker',
        label: 'Start time',
        required: true,
        unique: false,
        validators: {
            'is_date': {}
        }
      },
      starttime: {
        comp: 'time_picker',
        label: 'Start date',
        required: true,
        unique: false,
        validators: {
            'is_date': {}
        }
      },
      enddate: {
        comp: 'date_picker',
        label: 'End date',
        required: true,
        unique: false,
        validators: {
            'is_date': {}
        }
      },
      endtime: {
        comp: 'time_picker',
        label: 'End time',
        required: true,
        unique: false,
        validators: {
            'is_date': {}
        }
      },
      venue: {
        venue: {
          comp: 'google_venue',
          label: 'Venue name',
          required: true,
          unique: false,
          validators: {
            'String': {min: 3, max: 50},
            'geolocation': {min: 3, max: 50},
          }
        },
        room: {
          comp: 'simpletext',
          label: 'Room name',
          required: false,
          unique: false,
          validators: {
              'String': {min: 3, max: 50},
          }
        },
      }
      categories: [{
        comp: 'simpleselect',
        label: 'Event name',
        required: true,
        unique: true,
        validators: {
            'Array_max_length': 2
     }}],
    },
    performance: {
      comp: 'list_and_add', // relation manager
      rel_obj: 'Performace',
      list_fields: ['Performance name', 'users', 'category', 'stats', 'duration', 'slug'],
      list_actions: ['add', 'remove', 'sort', 'view_sort'],
      add_form_search: ['Performance name'],
      view_sort_modes: ['Performance name', 'custom_order', 'category'],
      rel_api: '/admin/api/...'
      label: 'Program',
      validators: {
        'Confirm': {}
      }
    }
 }}]
}

const GALLERIES = {
  galleries: {
    comp: 'list_and_add_and_upload', // relation manager
    rel_obj: 'Gallery',
    list_fields: ['Gallery name', 'users', 'stats', 'slug'],
    list_actions: ['add', 'upload', 'remove', 'sort', 'view_sort'],
    add_form_search: ['Gallery name'],
    view_sort_modes: ['Gallery name', 'category'],
    rel_api: '/admin/api/...'
    label: 'Galleries',
    validators: {
      'Confirm': {},
      'Upload': {
        'Mime': {},
        'Weight' : {},
        'Size': {}
      }
    }
  }
}

const VIDEOS = {
  videos: {
    comp: 'list_and_add_and_upload', // relation manager
    rel_obj: 'Video',
    list_fields: ['Video name', 'users', 'stats', 'slug'],
    list_actions: ['add', 'upload', 'remove', 'sort', 'view_sort'],
    add_form_search: ['Video name'],
    view_sort_modes: ['Video name', 'category'],
    rel_api: '/admin/api/...'
    label: 'Videos',
    validators: {
      'Confirm': {},
      'Upload': {
        'Mime': {},
        'Weight' : {},
        'Size': {}
      }
    }
  }
}

const CALLS = {
  calls: [{
  title: {
    comp: 'simpletext',
    label: 'Call name',
    required: false,
    unique: false,
    validators: {
        'String': {min: 3, max: 50},
    }
  },
  email: {
    schema: 'shared/Link',
    comp: 'multilink',
    label: 'Email contacts',
    validators: {
        'Email': {}
    }
  }
  slug: {
    comp: 'simpletext',
    label: 'Event url',
    required: true,
    unique: true,
    validators: {
        'String': {min: 3, max: 50},
        'Unique': 'admin/api...'
    }
  },
  start_date: {
    comp: 'date_picker',
    label: 'Date',
    required: true,
    unique: false,
    validators: {
        'is_date': {}
    }
  },
  end_date: {
    comp: 'date_picker',
    label: 'Date',
    required: true,
    unique: false,
    validators: {
        'is_date': {}
    }
  },
  admitted: [{ type: Schema.ObjectId, ref: 'Category'}}],
  excerpt: {
    schema: 'shared/About',
    comp: 'textarea_multilang',
    label: 'Event description',
    validators: {
        'String': {min: 0, max: 50000}
    }
  },
  terms: {
    schema: 'shared/About',
    comp: 'textarea_multilang',
    label: 'Event description',
    validators: {
        'String': {min: 0, max: 50000}
    }
  },
  closedcalltext: {
    schema: 'shared/About',
    comp: 'textarea_multilang',
    label: 'Event description',
    validators: {
        'String': {min: 0, max: 50000}
    }
  },
  packages: [{
    name: {
      comp: 'simpletext',
      label: 'Package name',
      required: false,
      unique: false,
      validators: {
          'String': {min: 3, max: 50},
      }
    },
    price: {
      comp: 'simpletext',
      label: 'Topic name',
      required: false,
      unique: false,
      validators: {
          'Number': {min: 3, max: 50},
      }
    },
    description: {
      schema: 'shared/About',
      comp: 'textarea_multilang',
      label: 'Event description',
      validators: {
          'String': {min: 0, max: 50000}
      }
    },
    personal: {
      comp: 'checkbox',
      label: 'Personal',
      required: false,
      unique: false,
      validators: {}
    },
    requested: {
      comp: 'checkbox',
      label: 'Requested',
      required: false,
      unique: false,
      validators: {}
    },
    allow_multiple: {
      comp: 'checkbox',
      label: 'Allow multiple',
      required: false,
      unique: false,
      validators: {}
    },
    allow_options: {
      comp: 'checkbox',
      label: 'Allow options',
      required: false,
      unique: false,
      validators: {}
    },
    options_name: {
      comp: 'simpletext',
      label: 'Topic name',
      required: false,
      unique: false,
      validators: {
          'String': {min: 3, max: 50},
      }
    },
    options: [{
      comp: 'simpletext',
      label: 'Topic name',
      required: false,
      unique: false,
      validators: {
          'String': {min: 3, max: 50},
      }
   }}],
    daily: {
      comp: 'checkbox',
      label: 'Daily',
      required: false,
      unique: false,
      validators: {}
    },
    start_date: {
      comp: 'date_picker',
      label: 'Date',
      required: true,
      unique: false,
      validators: {
          'is_date': {}
      }
    },
    end_date: {
      comp: 'date_picker',
      label: 'Date',
      required: true,
      unique: false,
      validators: {
          'is_date': {}
      }
    }
 }],
  topics: [{
    name: {
      comp: 'simpletext',
      label: 'Topic name',
      required: false,
      unique: false,
      validators: {
          'String': {min: 3, max: 50},
      }
    },
    description: {
      schema: 'shared/About',
      comp: 'textarea_multilang',
      label: 'Event description',
      validators: {
          'String': {min: 0, max: 50000}
      }
    }
 }}]
}]
}

const SETTINGS = {
  settings: {
    is_public: {
      comp: 'checkbox',
      label: 'Event is public',
      required: false,
      unique: false,
      validators: {}
    },
    gallery_is_public: {
      comp: 'checkbox',
      label: 'Galleries upload is open to all AVnode users',
      required: false,
      unique: false,
      validators: {}
    },
    is_freezed: {
      comp: 'checkbox',
      label: 'Event is freezed, nobody can edit any information on the event',
      required: false,
      unique: false,
      validators: {}
    },
    users: {
      comp: 'list_and_add_to_category', // relation manager
      rel_obj: 'User',
      list_fields: ['Stage name', 'user_category', 'slug'],
      list_actions: ['add', 'remove', 'edit_user_category'],
      add_form_search: ['Stage name', 'set_user_category'],
      rel_api: '/admin/api/...'
      label: 'Event managers',
      validators: {
        'Confirm': {}
      }
    }
  },
  organizationsettings: {
    program_builder: {
      comp: 'checkbox',
      label: 'Use Program Builder',
      required: false,
      unique: false,
      validators: {}
    },
    advanced_proposals_manager: {
      comp: 'checkbox',
      label: 'Use Program Manager',
      required: false,
      unique: false,
      validators: {}
    },
    call_manager: {
      comp: 'checkbox',
      label: 'Use Call to participate',
      required: false,
      unique: false,
      validators: {}
    },
  }
}


