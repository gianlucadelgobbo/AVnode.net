import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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

export default Citizenship;
