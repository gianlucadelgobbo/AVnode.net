const Schema = require('mongoose').Schema;

const Link = new Schema({
  txt: String, // removed { type: String, unique: true },
  target: String,
  url: String,
  is_public: { type: Boolean, default: true },
  is_confirmed: { type: Boolean, default: false },
  is_primary: { type: Boolean, default: false }
},{
  _id : false,
  id : false,
  timestamps: false,
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
