import mongoose from 'mongoose';
const { Schema } = mongoose;
import Schedule from './Schedule.js';
import config from 'getconfig';

const Booking = new Schema({
  subscription_id: { type: Schema.ObjectId, ref: 'Program' },
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
  if (this.schedule && this.schedule.length && this.schedule[0].starttime) {
    const lang = this.$locals.locale;
    const startdate = new Date(new Date(this.schedule[0].starttime).setUTCHours(0,0,0,0));
    const enddate = new Date(new Date(this.schedule[this.schedule.length-1].endtime).setUTCHours(0,0,0,0));
    const enddatefake = new Date(new Date(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).setUTCHours(0,0,0,0));
    if(startdate.toString()===enddatefake.toString()) {
      boxDate = this.$locals.moment(this.schedule[0].starttime).format(config.dateFormat[lang].weekdaydaymonthyear);
    } else {
      if (this.schedule[0].starttime.getFullYear()!==this.schedule[this.schedule.length-1].endtime.getFullYear()) {
        boxDate = this.$locals.moment(this.schedule[0].starttime).format(config.dateFormat[lang].weekdaydaymonthyear) + ' // ' + this.$locals.moment(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear);
      } else {
        if (this.schedule[0].starttime.getMonth()!==this.schedule[this.schedule.length-1].endtime.getMonth()) {
          boxDate = this.$locals.moment(this.schedule[0].starttime).format(config.dateFormat[lang].daymonth1) + ' // ' + this.$locals.moment(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).format(config.dateFormat[lang].daymonthyear);
        } else {
          boxDate = this.$locals.moment(this.schedule[0].starttime).format(config.dateFormat[lang].day1) + ' // ' + this.$locals.moment(this.schedule[this.schedule.length-1].endtime-(10*60*60*1000)).format(config.dateFormat[lang].day2);
        }
      }
    }
  }
  return boxDate;
});

export default Booking;
