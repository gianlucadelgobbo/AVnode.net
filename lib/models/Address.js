const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const indexPlugin = require('../plugins/elasticsearch/Address');

const addressSchema = new Schema({
  slug: { type: String, unique: true },
  name: String, // BL friendly name indexed for search
  address: String, // BL gmap response
  formatted_address: String, // BL exists in the app, more details?
  street: String,
  streetnumber: String,
  city: String,
  region: String,
  zip: String,
  country: String,
  lat:Number,
  lng:Number
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

addressSchema.virtual('editUrl').get(function () {
  return process.env.BASE + 'account/address/' + this.slug;
});

addressSchema.virtual('publicUrl').get(function () {
  return process.env.BASE + 'address/' + this.slug;
});

addressSchema.virtual('mapUrl').get(function () {
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


addressSchema.pre('remove', function(next) {
  const address = this;
  address.model('User').update(
    { $pull: { addresses: address._id } },
    next
  );
});

addressSchema.plugin(indexPlugin());

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
