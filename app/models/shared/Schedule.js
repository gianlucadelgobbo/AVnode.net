const Schema = require('mongoose').Schema;
const Venue = require('./Venue');
const moment = require('moment');

const Schedule = new Schema({
  disableautoschedule: Boolean,
  alleventschedulewithoneprice: Boolean,
  priceincludesothershows: Boolean,
  price: { type: Number},
  paypal: { type: String},
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
  physical: Boolean,
  categories: [{ type: Schema.ObjectId, ref: 'Category' }],
  status: [{ type: Schema.ObjectId, ref: 'Category' }]
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

Schedule.virtual('boxDateFull').get(function () {
  let boxDate;
  if (this.starttime) {
    const lang = global.getLocale();
    const start = new Date(this.starttime).getTime()
    const end = new Date(this.endtime).getTime()
    const days = Math.ceil((end-start)/(24*60*60*1000))
    //if (this.price == 120) console.log(days);
    if (days > 1) {
      let boxDateA = []
      for(let a=0;a<=days-1;a++) {
        let boxDateTMP = "";
        boxDateTMP = moment.utc((new Date(this.starttime).getTime())+(a*(24*60*60*1000))).format(config.dateFormat[lang].weekdaydaymonthyear);
        boxDateTMP+= " | "+moment.utc(this.starttime).format('HH:mm');
        boxDateTMP+= " > "+moment.utc(this.endtime).format('HH:mm');
        boxDateA.push(boxDateTMP);
      }
      boxDate = boxDateA.join("<br />");
    } else {
      boxDate = moment.utc(this.starttime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear);
      boxDate+= " | "+moment.utc(this.starttime).format('HH:mm');
      boxDate+= " > "+moment.utc(this.endtime).format('HH:mm');
    }
  }
  return boxDate;
});

/* Schedule.virtual('boxDateFull').get(function () {
  let boxDate;
  if (this.starttime) {
    const lang = global.getLocale();
    const start = new Date(this.starttime-(10*60*60*1000)).getTime()
    const end = new Date(this.endtime-(10*60*60*1000)).getTime()
    const days = Math.ceil((end-start)/(24*60*60*1000))
    if (days > 1) {
      let boxDateA = []
      for(let a=0;a<=days;a++) {
        let boxDateTMP = "";
        boxDateTMP = moment.utc((new Date(this.starttime-(10*60*60*1000)).getTime())+(a*(24*60*60*1000))).format(config.dateFormat[lang].weekdaydaymonthyear);
        boxDateTMP+= " | "+moment.utc(this.starttime).format('HH:mm');
        boxDateTMP+= " > "+moment.utc(this.endtime).format('HH:mm');
        boxDateA.push(boxDateTMP);
      }
      boxDate = boxDateA.join("<br />");
    } else {
      boxDate = moment.utc(this.starttime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear);
      boxDate+= " | "+moment.utc(this.starttime).format('HH:mm');
      boxDate+= " > "+moment.utc(this.endtime).format('HH:mm');
    }
  }
  return boxDate;
}); */
Schedule.virtual('boxDate').get(function () {
  let boxDate;
  if (this.starttime) {
    const lang = global.getLocale();
    const start = new Date(this.starttime-(10*60*60*1000)).getTime()
    const end = new Date(this.endtime-(10*60*60*1000)).getTime()
    const days = Math.ceil((end-start)/(24*60*60*1000))
    let startformattedA = moment.utc(this.starttime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear).split(" ");
    let endformattedA = moment.utc(this.endtime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear).split(" ");
    if (startformattedA[startformattedA.length-1] == endformattedA[startformattedA.length-1]) startformattedA.pop()
    if (startformattedA[startformattedA.length-1] == endformattedA[startformattedA.length-1]) startformattedA.pop()
    boxDate = startformattedA.join(" ");
    boxDate+= " > ";
    boxDate+= endformattedA.join(" ");
    boxDate+= " | "+moment.utc(this.starttime).format('HH:mm');
    boxDate+= " > "+moment.utc(this.endtime).format('HH:mm');
  }
  return boxDate;
});
Schedule.virtual('starttimeDay').get(function () {
  let boxDate;
  if (this.starttime) {
    const lang = global.getLocale();
    const start = new Date(this.starttime-(10*60*60*1000)).getTime()
    const end = new Date(this.endtime-(10*60*60*1000)).getTime()
    const days = Math.ceil((end-start)/(24*60*60*1000))
    if (days > 1) {
      let boxDateA = []
      for(let a=0;a<=days;a++) {
        let boxDateTMP = "";
        boxDateTMP = moment.utc((new Date(this.starttime-(10*60*60*1000)).getTime())+(a*(24*60*60*1000))).format(config.dateFormat[lang].weekdayday);
      }
      boxDate = boxDateA.join("<br />");
    } else {
      boxDate = moment.utc(this.starttime-(10*60*60*1000)).format(config.dateFormat[lang].weekdayday);
    }
  }
  return boxDate;
});

Schedule.virtual('starttimeTime').get(function () {
  let starttimeTime;
  if (this.starttime) {
    const lang = global.getLocale();
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
