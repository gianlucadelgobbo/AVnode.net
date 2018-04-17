const Schema = require('mongoose').Schema;

const Link = new Schema({
  slug: String, // removed { type: String, unique: true },
  link: String,
  url: String,
  type: String,
  tel: String,
  mailinglists: [],
  is_public: { type: Boolean, default: false },
  is_confirmed: { type: Boolean, default: false },
  is_primary: { type: Boolean, default: false }
}, {
  timestamps: true,
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: true
  }
});

Link.virtual('label').get(function () {
  if (this.url) {
    const label = this.url.replace('http://www.','').replace('https://www.','').replace('http://','').replace('https://','').split('/')[0];
    return label;
  }
});

module.exports = Link;
