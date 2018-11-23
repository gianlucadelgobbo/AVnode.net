const Schema = require('mongoose').Schema;

const Address = new Schema({
  postal_code: String,
  street_number: String,
  route: String,
  formatted_address: String,
  locality: String,
  country: String,
  geometry: Object,
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

