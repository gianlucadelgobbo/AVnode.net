let Schema = require('mongoose').Schema;

module.exports = new Schema({
  lang: String, // removed { type: String, unique: true },
  abouttext: String,
  is_primary: { type: Boolean, default: false }
}, { collection: 'abouts' });