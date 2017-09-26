const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const Address = require('./Address');

// BL TODO index name with ES?
const venueSchema = new Schema({
  slug: { type: String, unique: true },
  name: String, // BL friendly name indexed for search
  address: Object,
  place_id: String // Mandatory for uniqueness?
}, {
  timestamps: true
});

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
