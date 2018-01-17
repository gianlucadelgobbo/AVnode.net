const config = require('getconfig');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const indexPlugin = require('../utilities/elasticsearch/User');
const async = require('async');
const imageUtil = require('../utilities/image');
const Asset = require('../utilities/asset');
const Category = require('./Category');

const adminsez = 'user';

const userSchema = new Schema({
  slug: { type: String, unique: true },
  stagename: { type: String, unique: true },
  categories: [Category],
  is_crew: Boolean,
  /* C
 image: {
    file: String,
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    width: Number,
    height: Number
  },
   */
  image: Asset,
  teaserImage: Asset,
  file: { file: String },
  gender: String,
  name: String,
  surname: String,
  language: String, // BL TODO navigator or user.settings or subdomain language
  abouts: [],
  citizenship: [], // BL TODO frontend, issue #5, modified, was a string
  activity: Number, // BL TODO frontend, issue #5, added
  birthday: Date,

  /* C
  street_number: String,
  errorMessage: String,
  route: String,
  postal_code: String,
  locality: String,
  administrative_area_level_1: String,
  country: String,
  linksSocial: [],
  linksTel: [],
  */
  addresses: [],
  email: { type: String, unique: true },
  emails: [{
    email: String,
    is_public: { type: Boolean, default: false },
    is_primary: { type: Boolean, default: false },
    is_confirmed: { type: Boolean, default: false },
    mailinglists: {},
    confirm: String
  }],
  links: [],
  events: [{ type: Schema.ObjectId, ref: 'Event' }],
  crews: [{ type: Schema.ObjectId, ref: 'Crew' }],
  members: [{ type: Schema.ObjectId, ref: 'User' }],
  performances: [{ type: Schema.ObjectId, ref: 'Performance' }],
  galleries: [{ type: Schema.ObjectId, ref: 'Gallery' }],

  username: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  is_confirmed: { type: Boolean, default: false },
  confirm: String,
  tokens: Array,
  roles: [], // BL TODO frontend, issue #5, array of roles
  connections: [], // BL TODO frontend, issue #5, added
  // Organization Extra Data
  organizationData: {
    name: String,
    foundation_year: Date,
    type: Category,
    logo:  {type:	Schema.ObjectId, ref: 'Asset'},
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
    statute: {type:	Schema.ObjectId, ref: 'Asset'},
    members_cv: {type:	Schema.ObjectId, ref: 'Asset'},
    activity_report: {type:	Schema.ObjectId, ref: 'Asset'},
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
      logo: {type:	Schema.ObjectId, ref: 'Asset'},
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
}, {
  timestamps: true,
  toObject: {
    virtuals: false // BL FIXME check http://mongoosejs.com/docs/api.html#schema_Schema-virtual
  },
  toJSON: {
    virtuals: true
  }
});

/* userSchema.virtual('crews', {
  ref: 'User',
  localField: '_id',
  foreignField: '_id'
}); */

// Crews only
userSchema.virtual('crewEditUrl').get(function () {
  return `/admin/crew/${this.slug}`;
});

userSchema.virtual('crewPublicUrl').get(function () {
  return `/crew/${this.slug}`;
});

/* BL FIXME later for crews
userSchema.pre('remove', function(next) {
  const crew = this;
  crew.model('User').update(
    { $pull: { crews: crew._id } },
    next
  );
});*/

userSchema.virtual('birthdayFormatted').get(function () {
  return moment(this.birthday).format(process.env.DATEFORMAT);
});

userSchema.virtual('publicEmails').get(function () {
  let emails = [];
  if (this.emails) {
    this.emails.forEach((email) => {
      if (email.is_public) {
        emails.push(email);
      }
    });
  }
  return emails;
});

userSchema.virtual('publicUrl').get(function () {
  return `/${this.slug}`;
});

// Return thumbnail
userSchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.image);
  if (this.image && this.image.file) {
    for(let format in config.cpanel[adminsez].media.image.sizes) {
      imageFormats[format] = config.cpanel[adminsez].media.image.sizes[format].default;
    }
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/warehouse/', process.env.WAREHOUSE+'/warehouse/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    for(let format in config.cpanel[adminsez].media.image.sizes) {
      imageFormats[format] = `${localPath}/${config.cpanel[adminsez].media.image.sizes[format].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
    }
  }
  return imageFormats;
});

userSchema.virtual('teaserImageFormats').get(function () {
  let teaserImageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.teaserImage);
  if (this.teaserImage && this.teaserImage.file) {
    for(let format in config.cpanel[adminsez].media.teaserImage.sizes) {
      teaserImageFormats[format] = config.cpanel[adminsez].media.teaserImage.sizes[format].default;
    }
    const serverPath = this.teaserImage.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/warehouse/', process.env.WAREHOUSE+'/warehouse/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    for(let format in config.cpanel[adminsez].media.teaserImage.sizes) {
      teaserImageFormats[format] = `${localPath}/${config.cpanel[adminsez].media.teaserImage.sizes[format].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
    }
  }
  return teaserImageFormats;
});


// return teaser image url
userSchema.virtual('teaserImageUrl').get(function () {
  let teaserImageUrl = '/images/teaser-default.svg';
  if (this.teaserImage) {
    teaserImageUrl = this.teaserImage.publicUrl;
  } else {
    // from flxer import?
/* C
    if (this.file && this.file.file) {
      const serverPath = this.file.file;
      const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
      const localPath = serverPath.substring(1, serverPath.lastIndexOf('/')); // warehouse/2017/03
      const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
      const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
      // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
      teaserImageUrl = `${process.env.WAREHOUSE}/${localPath}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
      // save as asset
      async.parallel({
        image: (cb) => {
          console.log('migrate from flxer');
          if (teaserImageUrl) {
            const params = {
              filename: teaserImageUrl,
              originalname: serverPath
            } 
            assetUtil.createImageAssetFromUrl(params, (err, assetId) => {
              if (err) {
                console.log(err);
                throw err;
              }
              imageUtil.resize(assetId, imageUtil.sizes.user.teaser, cb);
            });
          } else {       
            cb(null);
          }
        }
      }, (err, results) => { 
        if (err) {
          console.log(err);
          throw err;
        }
        console.log('results[image]:' + results['image']);
        this.teaserImage = results['image'];
        this.save((err) => {  
          if (err) {
            console.log(err);
            throw err;
          }   
          teaserImageUrl = this.teaserImage.publicUrl;      
        });
      });
    }
*/
  }
  return teaserImageUrl;
});

// return original image
userSchema.virtual('imageUrl').get(function () {
  let image = '/images/profile-default.svg';

  if (this.image) {
    image = '/storage/' + this.image + '/512/200';
  }
  if (this.file && this.file.file) {
    const serverPath = this.file.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(1, serverPath.lastIndexOf('/')); // warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    image = `${process.env.WAREHOUSE}/${localPath}/55x55/${localFileNameWithoutExtension}_jpg.jpg`;
  }
  return image;
});

userSchema.pre('save', function save(next) {
  console.log('userSchema.pre(save) id:' + this._id);
  const user = this;
  console.log('userSchema.pre(save) name:' + JSON.stringify(user.name));
  //console.log('userSchema.pre(save) user:' + JSON.stringify(user));
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  // console.log('userSchema comparePassword:' + candidatePassword + ' p: ' + this.password);
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

userSchema.plugin(indexPlugin());

const User = mongoose.model('User', userSchema);

module.exports = User;
