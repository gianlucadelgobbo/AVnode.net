const Schema = require('mongoose').Schema;

const Citizenship = new Schema({
  label: String, // removed { type: String, unique: true },
  value: String
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

module.exports = Citizenship;
