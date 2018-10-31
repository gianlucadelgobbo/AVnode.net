const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const subscriptionSchema = new Schema({
  event: { type: Schema.ObjectId, ref: 'Event', required: true },
  call: { type: Number, required: true},
  topics: { type: [String], minlength: 1},
  performance: { type: Schema.ObjectId, ref: 'Performance', required: true, unique: true },
  reference: { type: Schema.ObjectId, ref: 'User', required: true },
  subscriptions: {
    type: [{
      subscriber_id: { type: Schema.ObjectId, ref: 'User' },
      days: { type: [Date], minlength: 1},
      packages: [{
        name: String,
        price: Number,
        description: String,
        personal: { type: Boolean, default: false },
        requested: { type: Boolean, default: false },
        allow_multiple: { type: Boolean, default: false },
        allow_options: { type: Boolean, default: false },
        options_name: String,
        options: String,
        option: String,
        daily: { type: Boolean, default: false },
        start_date: Date,
        end_date: Date
      }]
    }],
    minlength: 1
  }
},
{
  timestamps: true,
  collection: 'subscriptions',
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
