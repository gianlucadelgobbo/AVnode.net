const Schema = require('mongoose').Schema;
const Venue = require('./Venue');

const Booking = new Schema({
  schedule: {
      date: Date,
      starttime: Date,
      endtime: Date,
      data_i: String,
      data_f: String,
      ora_i: Number,
      ora_f: Number,
      rel_id: Number,
      user_id: Number,
      confirm: String,
      day: String,
      venue: Venue,
      categories: [{ type: Schema.ObjectId, ref: 'Category' }]
  },
  event: [{ type: Schema.ObjectId, ref: 'Event' }]
});

module.exports = Booking;
