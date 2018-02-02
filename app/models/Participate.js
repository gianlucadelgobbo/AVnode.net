const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Package = require('./Package');

const adminsez = 'participate_admin';

const logger = require('../utilities/logger');

const participateSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  performance: { type: Schema.ObjectId, ref: 'Performance' },
  call_id: Number,
  topics: [String],
  subscriptions: [{
    subscriber_id: { type: Schema.ObjectId, ref: 'User' },
    days: [Date],
    packages: [Package]
  }]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

participateSchema.plugin(indexPlugin());

const Participate = mongoose.model('Participate', participateSchema);

module.exports = Participate;
