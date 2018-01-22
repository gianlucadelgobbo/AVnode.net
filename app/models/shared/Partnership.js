const Schema = require('mongoose').Schema;

const Partnership = new Schema({
  category:  { type : Schema.ObjectId, ref : 'Category' },
  users:  [{ type : Schema.ObjectId, ref : 'Users' }]
});

module.exports = Partnership;
