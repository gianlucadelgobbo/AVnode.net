const Schema = require('mongoose').Schema;
const Venue = require('./Venue');
const moment = require('moment');

const Schedule = new Schema({
  date: Date,
  starttime: Date,
  endtime: Date,
  data_i: String,
  data_f: String,
  ora_i: Number,
  ora_f: Number,
  rel_id: Number,
  user_id: Number,
  confirm: String,
  day: String,
  venue: Venue,
  categories: [{ type: Schema.ObjectId, ref: 'Category' }]
},{
  _id : false,
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true
  }
});

Schedule.virtual('boxDate').get(function () {
  let boxDate;
  if (this.starttime) {
    const lang = global.getLocale();
    moment.locale(lang);
    boxDate = moment(this.starttime).format(config.dateFormat[lang].single);
    boxDate+= " | "+moment(this.starttime).format('hh:mm');
  }
  return boxDate;
});

Schedule.virtual('starttimeTime').get(function () {
  let starttimeTime;
  if (this.starttime) {
    const lang = global.getLocale();
    moment.locale(lang);
    starttimeTime = moment(this.starttime).format('hh:mm');
  }
  return starttimeTime;
});

Schedule.virtual('endtimeTime').get(function () {
  let endtimeTime;
  if (this.endtime) {
    const lang = global.getLocale();
    moment.locale(lang);
    endtimeTime = moment(this.endtime).format('hh:mm');
  }
  return endtimeTime;
});

module.exports = Schedule;
