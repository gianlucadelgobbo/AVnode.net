const Schema = require('mongoose').Schema;

const Address = new Schema({
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
},{ _id : false });

Address.virtual('mapUrl').get(function () {
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
module.exports = Address;
