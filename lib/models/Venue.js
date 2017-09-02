const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const venueSchema = new Schema({
  address: String,
  geometry: Object,
  place_id: String
}, {
  timestamps: true
});

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
