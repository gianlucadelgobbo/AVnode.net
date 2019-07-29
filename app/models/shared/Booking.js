const Schema = require('mongoose').Schema;
const Schedule = require('./Schedule');
const moment = require('moment');

const Booking = new Schema({
  schedule: [Schedule],
  event: { type: Schema.ObjectId, ref: 'EventShow' }
},{
  _id : false,
  id : false,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

Booking.virtual('boxDate').get(function () {
  let boxDate;
  if (this.schedule && this.schedule.length) {
    const lang = global.getLocale();
    const startdate = new Date(new Date(this.schedule[0].starttime).setUTCHours(0,0,0,0));
    const enddate = new Date(new Date(this.schedule[this.schedule.length-1].endtime).setUTCHours(0,0,0,0));
    const enddatefake = new Date(new Date(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).setUTCHours(0,0,0,0));
    if(startdate.toString()===enddatefake.toString()) {
      boxDate = moment(this.schedule[0].starttime).format(config.dateFormat[lang].weekdaydaymonthyear);
    } else {
      if (this.schedule[0].starttime.getFullYear()!==this.schedule[this.schedule.length-1].endtime.getFullYear()) {
        boxDate = moment(this.schedule[0].starttime).format(config.dateFormat[lang].weekdaydaymonthyear) + ' // ' + moment(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear);
      } else {
        if (this.schedule[0].starttime.getMonth()!==this.schedule[this.schedule.length-1].endtime.getMonth()) {
          boxDate = moment(this.schedule[0].starttime).format(config.dateFormat[lang].daymonth1) + ' // ' + moment(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).format(config.dateFormat[lang].daymonthyear);
        } else {
          boxDate = moment(this.schedule[0].starttime).format(config.dateFormat[lang].day1) + ' // ' + moment(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).format(config.dateFormat[lang].day2);
        }
      }
    }
  }
  return boxDate;
});

module.exports = Booking;
