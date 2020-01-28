const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const moment = require('moment');

const Schedule = require('./shared/Schedule');
const Package = require('./shared/Package');

const subSchema = new Schema({
  subscriber_id: { type: Schema.ObjectId, ref: 'User' },
  freezed: { type: Boolean, default: false },
  wepay: { type: Boolean, default: false },
  days: { type: [Date], minlength: 1},
  packages: [Package]
},
{
  _id: false,
  id: false,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

const programSchema = new Schema({
  event: { type: Schema.ObjectId, ref: 'Event', required: true },
  call: { type: Number},
  topics: { type: [String], minlength: 1},
  schedule: [Schedule],
  performance: { type: Schema.ObjectId, ref: 'Performance', required: true },
  performance_category: { type : Schema.ObjectId, ref : 'Category' },
  reference: { type: Schema.ObjectId, ref: 'User', required: true },
  status: { type: Schema.ObjectId, ref: 'Category' },
  fee: { type: Number},
  technical_cost: { type: Number},
  accommodation_cost: { type: Number},
  transfer_cost: { type: Number},
  subscriptions: {
    type: [subSchema],
    minlength: 1
  }
},
{
  id: false,
  timestamps: true,
  collection: 'program',
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});



subSchema.virtual('daysFormatted').get(function () {
  let daysFormatted = [];
  if (this.days && this.days.length) {
    this.days.forEach((day) => {
      daysFormatted.push(moment(day).format('DD-MM-YYYY'));
    });
    return daysFormatted;
  }
});

programSchema.plugin(uniqueValidator);

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
