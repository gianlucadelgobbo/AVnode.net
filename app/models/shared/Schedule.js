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
  categories: [{ type: Schema.ObjectId, ref: 'Category' }],
  status: { type: Schema.ObjectId, ref: 'Category' }
},{
  _id : false,
  toObject: {
    virtuals: true,
    getters: true
  },
  toJSON: {
    virtuals: true ,
    transform: (doc, ret, options) => {
      delete ret.id;
      delete ret.date;
      delete ret.data_i;
      delete ret.data_f;
      delete ret.ora_i;
      delete ret.ora_f;
      delete ret.rel_id;
      delete ret.user_id;
      delete ret.confirm;
      delete ret.day;
    }
  }
});

Schedule.virtual('boxDate').get(function () {
  let boxDate;
  if (this.starttime) {
    const lang = global.getLocale();
    moment.locale(lang);
    boxDate = moment.utc(this.starttime).format(config.dateFormat[lang].single);
    boxDate+= " | "+moment.utc(this.starttime).format('HH:mm');
  }
  return boxDate;
});

Schedule.virtual('starttimeTime').get(function () {
  let starttimeTime;
  if (this.starttime) {
    const lang = global.getLocale();
    moment.locale(lang);
    starttimeTime = moment.utc(new Date(this.starttime)).format('HH:mm');
  }
  return starttimeTime;
});

Schedule.virtual('endtimeTime').get(function () {
  let endtimeTime;
  if (this.endtime) {
    endtimeTime = moment.utc(this.endtime).format('HH:mm');
    endtimeTime = moment.utc(new Date(this.endtime)).format('HH:mm');
  }
  return endtimeTime;
});

module.exports = Schedule;
