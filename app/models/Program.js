import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import Schedule from './shared/Schedule.js';
import Package from './shared/Package.js';

const subSchema = new Schema({
  subscriber_id: { type: Schema.ObjectId, ref: 'User' },
  freezed: { type: Boolean, default: false },
  wepay: { type: Boolean, default: false },
  cash: { type: Boolean, default: false },
  days: { type: [Date], minlength: 1},
  availabilityDates: { "start": Date, "end": Date},
  packages: [Package]
},
{
  timestamps: true,
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
  performance: { type: Schema.ObjectId, ref: 'Performance' },
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
  if (!this.days || !this.days.length) return [];
  const momentFn = this.$locals?.moment;
  if (typeof momentFn !== 'function') return this.days.map(d => new Date(d).toISOString().slice(0, 10));
  return this.days.map(day => momentFn(day).format('DD-MM-YYYY'));
});

const Program = mongoose.model('Program', programSchema);

export default Program;
