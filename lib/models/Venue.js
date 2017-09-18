const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const venueSchema = new Schema({
  address: String,
  street_number: String,
  route: String,
  postal_code: String,
  locality: String,
  administrative_area_level_1: String,
  country: String,
  geometry: Object,
  place_id: String
}, {
  timestamps: true
});

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
