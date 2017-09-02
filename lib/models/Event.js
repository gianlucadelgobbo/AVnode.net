const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const indexPlugin = require('../plugins/elasticsearch/Event');

const eventSchema = new Schema({
  slug: { type: String, unique: true },
  title: String,
  subtitle: String,
  image: { type : Schema.ObjectId, ref : 'Asset' },
  teaserImage: { type : Schema.ObjectId, ref : 'Asset' },
  venues: [{ type : Schema.ObjectId, ref : 'Venue', default: []}],
  starts: Date,
  ends: Date,
  about: String,
  address: String,
  website: String,
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

eventSchema.virtual('organizers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'events'
});

eventSchema.virtual('organizing_crews', {
  ref: 'Crew',
  localField: '_id',
  foreignField: 'events'
});

eventSchema.virtual('performances', {
  ref: 'Performance',
  localField: '_id',
  foreignField: 'events'
});

eventSchema.virtual('editUrl').get(function () {
  return process.env.BASE + 'account/events/' + this.slug;
});

eventSchema.virtual('publicUrl').get(function () {
  return process.env.BASE + 'events/' + this.slug;
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
