let Schema = require('mongoose').Schema;

module.exports = new Schema({
  name: String
}, { collection: 'categories' });