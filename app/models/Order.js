import config from 'getconfig';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderID: String,
  event: { type : Schema.ObjectId, ref : 'Event' },
  details: {},
  data: {}
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
