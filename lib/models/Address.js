// const mongoose = require('mongoose');
let Schema = require('mongoose').Schema;

module.exports = new Schema({
  slug: String, // removed { type: String, unique: true },
  placename: String, // BL friendly name indexed for search, slug generated from it
  formatted_address: String, // BL gmap response formatted_address, should not be updated to stay unique
  street_number: String,
  route: String,
  postal_code: String,
  locality: String,
  administrative_area_level_1: String,
  country: String,
  geometry: Object,
  place_id: String,
  is_primary: { type: Boolean, default: false },
  is_public: {type: Boolean, default: false}
}, {collection: 'addresses'});