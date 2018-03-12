const Schema = require('mongoose').Schema;

const Link = new Schema({
  slug: String, // removed { type: String, unique: true },
  link: String,
  url: String,
  type: String,
  tel:String,
  mailinglists: [],
  is_public: { type: Boolean, default: false },
  is_confirmed: { type: Boolean, default: false },
  is_primary: { type: Boolean, default: false }
});

module.exports = Link;
