const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const PartnerSchema = new Schema({
  /* event: { type: Schema.ObjectId, ref: 'Event', required: true },
  call: { type: Number, required: true},
  topics: { type: [String], minlength: 1},
  schedule: Schedule,
  performance: { type: Schema.ObjectId, ref: 'Performance', required: true },
  performance_category: { type : Schema.ObjectId, ref : 'Category' },
  reference: { type: Schema.ObjectId, ref: 'User', required: true },
  subscriptions: {
    type: [subSchema],
    minlength: 1
  } */
},
{
  timestamps: true,
  collection: 'partners',
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});



PartnerSchema.virtual('daysFormatted').get(function () {
  let daysFormatted = [];
  if (this.days && this.days.length) {
    this.days.forEach((day) => {
      daysFormatted.push(moment(day).format('DD-MM-YYYY'));
    });
    return daysFormatted;
  }
});

PartnerSchema.plugin(uniqueValidator);

const Partner = mongoose.model('Partner', PartnerSchema);

module.exports = Partner;
