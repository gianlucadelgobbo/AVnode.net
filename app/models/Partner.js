const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const PartnerSchema = new Schema({
  /*
	"brand" : "Livincool",
	"legalentity" : "",
	"delegate" : "Chiara",
	"selecta" : "",
	"satellite" : "",
	"event" : "",
	"country" : "Italy",
	"description" : "",
	"address" : "",
	"type" : "",
	"websites" : [ ],
	"contacts" : [
		{
			"name" : "Fabrizio",
			"surname" : "Galati",
			"email" : "fabri.galati@gmail.com",
			"phone" : "",
			"lang" : "it",
			"types" : [
				"Contact"
			]
		}
	],
	"partnerships" : [
		{
			"name" : "LPM-2017",
			"status" : "NEW",
			"group" : "6. Media Partners",
			"notes" : "not for ZA"
		},
		{
			"name" : "LCF-2017",
			"status" : "NEW",
			"group" : "6. Media Partners",
			"notes" : "not for ZA"
		}
	],
	"channels" : [ ],
	"users" : [
		ObjectId("5be87f15fc3961000000a669")
	]
  
  
  event: { type: Schema.ObjectId, ref: 'Event', required: true },
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
