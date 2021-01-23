const PUBLIC = {
  slug: {
    comp: 'simpletext',
    label: 'Footage url',
    required: true,
    unique: true,
    validators: {
        'String': {min: 3, max: 100},
        'Unique': 'admin/api...'
    }
  },
  title: {
    comp: 'simpletext',
    label: 'Footage name',
    required: true,
    unique: true,
    validators: {
        'String': {min: 3, max: 100},
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
  media: {
    comp: 'uploader',
    label: 'Footage file',
    validators: {
        'Mime': {},
        'Weight' : {},
        'Size': {}
    }
  },
  categories: [{
    comp: 'simpleselect',
    label: 'Footage categories',
    required: true,
    unique: true,
    validators: {
        'Array_max_length': 2
    }
  }],
  users: [{
    comp: 'simpleselect',
    label: 'Authors',
    required: true,
    unique: true,
    validators: {
    }
  }],
}

const EVENTS = {
  events: {
    comp: 'list_and_add', // relation manager
    rel_obj: 'Events',
    list_fields: ['Event name', 'stats', 'slug'],
    list_actions: ['add', 'remove', 'sort', 'view_sort'],
    add_form_search: ['Event name'],
    view_sort_modes: ['Event name'],
    rel_api: '/admin/api/...',
    label: 'Events',
    validators: {
      'Confirm': {},
    }
  },
}

const PERFORMANCES = {
  performances: {
    comp: 'list_and_add', // relation manager
    rel_obj: 'Performance',
    list_fields: ['Performance name', 'stats', 'slug'],
    list_actions: ['add', 'remove', 'sort', 'view_sort'],
    add_form_search: ['Performance name'],
    view_sort_modes: ['Performance name'],
    rel_api: '/admin/api/...',
    label: 'Performance',
    validators: {
      'Confirm': {},
    }
  },
}

