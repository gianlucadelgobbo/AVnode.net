const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const Address = require('./Address');
// BL TODO index name with ES?
const venueSchema = new Schema({
  slug: String,
  name: String, // BL friendly name indexed for search
  address: Address,
  geometry: Object
}, {
  timestamps: true
});

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
