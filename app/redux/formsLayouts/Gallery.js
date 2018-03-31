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
  users: [{
    comp: 'simpleselect',
    label: 'Authors',
    required: true,
    unique: true,
    validators: {
    }]
  }],
  medias: {
    comp: 'list_and_add_and_upload', // relation manager
    list_fields: ['Picture name', 'users', 'stats', 'slug'],
    list_actions: ['add', 'upload', 'remove', 'sort', 'view_sort'],
    add_form_search: ['Picture name'],
    view_sort_modes: ['Picture name', 'category'],
    rel_api: '/admin/api/...'
    label: 'Medias',
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
