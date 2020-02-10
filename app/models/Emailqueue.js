const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Emailqueueschema = new Schema({
  organization: { type: Schema.ObjectId, ref: 'User' },
  event: { type: Schema.ObjectId, ref: 'Event' },
  user: { type: Schema.ObjectId, ref: 'User' },
  subject: String,
  messages_tosend: [{
    to_html: String,
    cc_html: [String],
    from_name: String,
    from_email: String,
    user_email: String,
    user_password: String,
    subject: String,
    text: String
  }],
  messages_sent: [{
    date: Date,
    to_html: String,
    cc_html: [String],
    from_name: String,
    from_email: String,
    user_email: String,
    user_password: String,
    subject: String,
    text: String
  }]
}, {
  timestamps: true,
  collection: 'emailqueue',
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true
  }
});

const Emailqueue = mongoose.model('Emailqueue', Emailqueueschema);

module.exports = Emailqueue;
