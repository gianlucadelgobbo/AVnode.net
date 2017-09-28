const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const indexPlugin = require('../plugins/elasticsearch/Venue');
const Address = require('./Address');

// BL TODO index name with ES?
const venueSchema = new Schema({
  slug: { type: String, unique: true },
  // BL now in address name: String, // BL friendly name indexed for search
  address: Address,
  place_id: String 
}, {
  timestamps: true
});

venueSchema.virtual('editUrl').get(function () {
  return process.env.BASE + 'account/venues/' + this.slug;
});

venueSchema.virtual('publicUrl').get(function () {
  return process.env.BASE + 'venues/' + this.slug;
});

venueSchema.virtual('mapUrl').get(function () {
  let url = '';
  if (this.address && this.address.geometry) {
    url = 'https://maps.googleapis.com/maps/api/staticmap';
    url += '?center=' + encodeURIComponent(this.address.geometry.location);
    url += '&zoom=10';
    url += '&size=400x200';
    url += '&key=' + process.env.GOOGLEMAPSAPIKEY;
  }
  return url;
});

venueSchema.pre('remove', function(next) {
  const venue = this;
  venue.model('Event').update(
    { $pull: { venues: venue._id } },
    next
  );
});

venueSchema.plugin(indexPlugin());

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
