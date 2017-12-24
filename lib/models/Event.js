const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const indexPlugin = require('../plugins/elasticsearch/Event');
const Link = require('./Link');
// const About = require('./About');
const Category = require('./Category');

const eventSchema = new Schema({
  slug: { type: String, unique: true },
  title: String,
  subtitle: String,
  image: { type : Schema.ObjectId, ref : 'Asset' },
  teaserImage: { type : Schema.ObjectId, ref : 'Asset' },
  file: { file: String },  
  venues: [{ type : Schema.ObjectId, ref : 'Venue', default: []}],
  galleries: [{ type : Schema.ObjectId, ref : 'Gallery' }],  
  starts: Date,
  ends: Date,
  schedule:[
    {
      starts: Date, 
      ends: Date,
      venue: { type : Schema.ObjectId, ref : 'Venue', default: []}
    }
  ],
  about: String,
  aboutlanguage: String, // BL about default language
  abouts: [], // BL multilang
  // not needed: address: String, stored in Venue
  categories: [Category],
  links: [Link], // not needed: website: String, stored in Link
  is_public: { type: Boolean, default: false },
  is_open: { type: Boolean, default: false }
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});
// return thumbnail
eventSchema.virtual('squareThumbnailUrl').get(function () {
  let squareThumbnailUrl = '/images/profile-default.svg';

  if (this.file && this.file.file) {
    const serverPath = this.file.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(1, serverPath.lastIndexOf('/')); // warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    squareThumbnailUrl = `${process.env.WAREHOUSE}/${localPath}/55x55/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
  }
  return squareThumbnailUrl;
});
// return card image
eventSchema.virtual('cardUrl').get(function () {
  let cardUrl = '/images/profile-default.svg';

  if (this.file && this.file.file) {
    const serverPath = this.file.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(1, serverPath.lastIndexOf('/')); // warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    cardUrl = `${process.env.WAREHOUSE}/${localPath}/400x300/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
  }
  return cardUrl;
});
// return original image
eventSchema.virtual('imageUrl').get(function () {
  let image = '/images/profile-default.svg';

  if (this.image) {
    image = '/storage/' + this.image + '/512/200';
  }
  if (this.file && this.file.file) {
    const serverPath = this.file.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(1, serverPath.lastIndexOf('/')); // warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    /* if (fs.existsSync(localPath)) {

    } else {
      try {
        fs.mkdirSync(localPath);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          console.log(err);
        }
      }
    }  */
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    image = `${process.env.WAREHOUSE}/${localPath}/55x55/${localFileNameWithoutExtension}_jpg.jpg`;
    // original size image = `${process.env.WAREHOUSE}${this.file.file}`;
    /* console.log(image);
    var file = fs.createWriteStream(localPath + '/' + localFileName);
    var request = https.get(image, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        console.log('The file was saved:' + image);

      });
    }); */

  }
  return image;
});

eventSchema.virtual('organizers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'events'
});

eventSchema.virtual('organizing_crews', {
  ref: 'User',
  localField: '_id',
  foreignField: 'events'
});

eventSchema.virtual('performances', {
  ref: 'Performance',
  localField: '_id',
  foreignField: 'events'
});

eventSchema.virtual('editUrl').get(function () {
  return `${process.env.BASE}account/events/public/${this.slug}`;
});

eventSchema.virtual('publicUrl').get(function () {
  return `${process.env.BASE}events/${this.slug}`;
});

eventSchema.virtual('startsFormatted').get(function () {
  return moment(this.starts).format(process.env.DATEFORMAT);
});

eventSchema.virtual('endsFormatted').get(function () {
  return moment(this.ends).format(process.env.DATEFORMAT);
});

eventSchema.virtual('mapUrl').get(function () {
  let url = '';
  if (this.address) {
    url = 'https://maps.googleapis.com/maps/api/staticmap';
    url += '?center=' + encodeURIComponent(this.address);
    url += '&zoom=10';
    url += '&size=400x200';
    url += '&key=' + process.env.GOOGLEMAPSAPIKEY;
  }
  return url;
});

eventSchema.virtual('organizers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'events'
});

eventSchema.virtual('dateFormatted').get(function () {
  let date = '';
  if (this.ends && this.startsFormatted !== this.endsFormatted) {
    date = moment(this.starts).format('MMMM Do');
    date += ' - ' + moment(this.ends).format('MMMM Do YYYY');
  } else {
    date = moment(this.starts).format('MMMM Do YYYY');
  }
  return date;
});

eventSchema.pre('remove', function(next) {
  const event = this;
  event.model('User').update(
    { $pull: { events: event._id } },
    next
  );
});

eventSchema.plugin(indexPlugin());

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
