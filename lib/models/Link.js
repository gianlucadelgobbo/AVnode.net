var Schema = require('mongoose').Schema;

module.exports = new Schema({
  slug: String, // removed { type: String, unique: true },
  link: String,
  url: String,
  type: String,
  mailinglists: [],
  is_public: { type: Boolean, default: false },
  is_confirmed: { type: Boolean, default: false },
  is_primary: { type: Boolean, default: false }
}, { collection: 'links' });