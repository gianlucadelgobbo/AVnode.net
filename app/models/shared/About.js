const Schema = require('mongoose').Schema;

const About = new Schema({
  lang: String, // removed { type: String, unique: true },
  abouttext: String,
  is_primary: { type: Boolean, default: false }
});

module.exports = About;
