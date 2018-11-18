const Schema = require('mongoose').Schema;
const moment = require('moment');

const accounting = require('accounting');

const Package = new Schema({
  name: String,
  price: Number,
  description: String,
  personal: { type: Boolean, default: false },
  requested: { type: Boolean, default: false },
  allow_multiple: { type: Boolean, default: false },
  allow_options: { type: Boolean, default: false },
  options_name: String,
  options: String,
  daily: { type: Boolean, default: false },
  start_date: Date,
  end_date: Date
}, {
  _id : false,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

Package.virtual('price_formatted').get(function () {
  //return accounting.formatMoney(this.price, '€ ', 2, '.', ',');
  return this.price+"aaaaa";
});

module.exports = Package;


