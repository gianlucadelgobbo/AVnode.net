const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  old_id : Number,
  ancestor_old_id : Number,
  name : String,
  rel : String,
  slug : String,
  childrens : [],
  ancestor : { type : Schema.ObjectId, ref : 'Category' }
}, {
  id : false,
  collection: 'categories',
  timestamps: true,
  toObject: {
  virtuals: true
},
toJSON: {
  virtuals: true
}
});





const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
