const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Emailqueueschema = new Schema({
  to_html: String,
  cc_html: [String],
  from_name: String,
  from_email: String,
  user_email: String,
  user_password: String,
  subject: String,
  text: String
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
