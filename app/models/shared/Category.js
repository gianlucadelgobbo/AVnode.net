const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  old_id : Number,
  ancestor_old_id : Number,
  name : String,
  rel : String,
  slug : String,
  ancestor : { type : Schema.ObjectId, ref : 'Category' }
}, { collection: 'categories' });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
