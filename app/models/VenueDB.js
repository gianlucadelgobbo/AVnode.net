const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VenueDBschema = new Schema({
  name: String,
  street_number: String,
  route: String,
  postal_code: String,
  locality: String,
  country: String,
  
  name_new: String,
  street_number_new: String,
  route_new: String,
  postal_code_new: String,
  locality_new: String,
  country_new: String,

  formatted_address: String,
  status: String,
  geometry: Object,
  localityOld: []
}, {
  timestamps: true,
  collection: 'venuedb',
});

const VenueDB = mongoose.model('VenueDB', VenueDBschema);

module.exports = VenueDB;
