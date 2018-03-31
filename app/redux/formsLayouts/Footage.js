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
  tags: [{
    comp: 'simpletext',
    label: 'Tags',
    required: false,
    unique: false,
    validators: {
        'String': {min: 3, max: 50},
    }
  }]
}