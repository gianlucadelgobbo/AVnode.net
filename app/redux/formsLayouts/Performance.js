const PUBLIC = {
  slug: {
    comp: 'simpletext',
    label: 'Footage url',
    required: true,
    unique: true,
    validators: {
        'String': {min: 3, max: 50},
        'Unique': 'admin/api...'
    }
  },
  title: {
    comp: 'simpletext',
    label: 'Footage name',
    required: true,
    unique: true,
    validators: {
        'String': {min: 3, max: 50},
        'Unique': 'admin/api...'
    }
  },
  abouts: {
    schema: 'shared/About',
    comp: 'textarea_multilang',
    label: 'Footage description',
    validators: {
        'String': {min: 0, max: 50000}
    }
  },
  is_public: {
    comp: 'checkbox',
    label: 'Footage is public',
    required: false,
    unique: false,
    validators: {}
  },
  categories: [{
    comp: 'simpleselect',
    label: 'Footage categories',
    required: true,
    unique: true,
    validators: {
        'Array_max_length': 2
    }]
  }],
  users: [{
    comp: 'simpleselect',
    label: 'Authors',
    required: true,
    unique: true,
    validators: {
    }]
  }],
  price: {
    comp: 'simpletext',
    label: 'Price',
    required: true,
    unique: true,
    validators: {
        'Number': {min: 3, max: 50},
    }
  },
  duration: {
    comp: 'simpletext',
    label: 'Durationd',
    required: true,
    unique: true,
    validators: {
        'Number': {min: 3, max: 50},
    }
  },
  tech_art: {
    schema: 'shared/About',
    comp: 'textarea_multilang',
    label: 'Technologies with the artists',
    validators: {
        'String': {min: 0, max: 50000}
    }
  }, // what the artist brings
  tech_req: {
    schema: 'shared/About',
    comp: 'textarea_multilang',
    label: 'Technical requirements',
    validators: {
        'String': {min: 0, max: 50000}
    }
  }, // what the artist need
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

