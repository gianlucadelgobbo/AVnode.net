const PUBLIC = {
    slug: {
        comp: 'simpletext'
        label: 'Profile url',
        required: true,
        unique: true,
        validators: {
            'String': {min: 3, max: 50},
            'Unique': 'admin/api...'
        }
    },
    stagename: {
        comp: 'simpletext'
        label: 'Stage name',
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
        label: 'About me',
        validators: {
            'String': {min: 0, max: 50000}
        }
    },
    addresses: {
        schema: 'shared/Address'
        comp: 'citycountry_multi_googleautocomplete'
        label: 'Where I\'m based',
        required: true,
        validators: {
            'geometry': true
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
        label: 'Profile Image',
        validators: {
            'Mime': {},
            'Weight' : {},
            'Size': {}
        }
    },
}

const EMAILS = {
    emails: {
        comp: 'emails'
        label: 'Emails',
        validators: {
            'Email': {},
            'Confirm' : {},
            'Primary': {}
        }
    }  
}

const PRIVATE = {
    name: {
        comp: 'simpletext'
        label: 'Name',
        validators: {
            'String': {min: 3, max: 50}
        }
    },
    surname: {
        comp: 'simpletext'
        label: 'Name',
        validators: {
            'String': {min: 3, max: 50}
        }
    },
    gender: {
        comp: 'select'
        label: 'Gender',
        validators: {
            'String': [M,F,Other]
        }
    },
    lang: {
        comp: 'select'
        label: 'Preferred language',
        validators: {
            'String': '' // Available languages in config
        }
    },
    birthday: {
        comp: 'datepicker'
        label: 'Birthday',
        validators: {
            'Date': '' // Available languages in config
        }
    },
    citizenship: {
        comp: 'select'
        label: 'Citizenship',
        validators: {
            'String': '' // Available citizenship list
        }
    },
    addresses_private: {
        schema: 'shared/AddressPrivate'
        comp: 'fulladdress_multi_googleautocomplete'
        label: 'Private addresses',
        validators: {
            'geometry': true
        }
    },
    phone: {
        schema: 'shared/Link'
        comp: 'multilink'
        label: 'Websites',
        validators: {
            'Phone': {}
        }
    },
    mobile: {
        schema: 'shared/Link'
        comp: 'multilink'
        label: 'Mobile',
        validators: {
            'Phone': {}
        }
    },
    skype: {
        schema: 'shared/Link'
        comp: 'multilink'
        label: 'Skype',
        validators: {
            'Skype': {}
        }
    },
}

const PASSWORD = {
    password: String
}

const CONNECTIONS = { // TO BE DEFINED
    connections: [],
}
