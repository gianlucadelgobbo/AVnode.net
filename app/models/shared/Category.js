const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  old_id : Number,
  ancestor_old_id : Number,
  name : String,
  rel : String,
  permalink : String,
  ancestors : [{
    old_id : Number,
    ancestor_old_id : Number,
    name : String,
    rel : String,
    permalink : String
  }]
}, { collection: 'categories' });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
