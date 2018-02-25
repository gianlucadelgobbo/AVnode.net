const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressDBschema = new Schema({
  locality: String,
  country: String,
  locality_new: String,
  country_new: String,
  formatted_address: String,
  status: String,
  geometry: Object,
  localityOld: []
});

const AddressDB = mongoose.model('AddressDB', AddressDBschema);

module.exports = AddressDB;
