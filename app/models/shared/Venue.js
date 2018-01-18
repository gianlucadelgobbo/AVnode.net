const Schema = require('mongoose').Schema;

const Address = require('./Address');

const Venue = new Schema({
  name: String,
  room: String,
  location: Address
});

Venue.virtual('mapUrl').get(function () {
  let url = '';
  if (this.location && this.location.geometry) {
    url = 'https://maps.googleapis.com/maps/api/staticmap';
    url += '?center=' + encodeURIComponent(this.location.geometry.location);
    url += '&zoom=10';
    url += '&size=400x200';
    url += '&key=' + process.env.GOOGLEMAPSAPIKEY;
  }
  return url;
});

module.exports = Venue;
