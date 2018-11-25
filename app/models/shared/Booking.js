const Schema = require('mongoose').Schema;
const Schedule = require('./Schedule');

const Booking = new Schema({
  schedule: Schedule,
  event: { type: Schema.ObjectId, ref: 'EventShow' }
},{
  _id : false
});

module.exports = Booking;
