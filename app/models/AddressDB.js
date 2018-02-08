const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressDBschema = new Schema({
  locality: String,
  country: String,
  formatted_address: String,
  geometry: Object,
  localityOld: []
});

const AddressDB = mongoose.model('AddressDB', AddressDBschema);

module.exports = AddressDB;
