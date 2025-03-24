import mongoose from 'mongoose';
const { Schema } = mongoose;
import Venue from './Venue.js';
import config from 'getconfig';

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
  //console.log("virtual('boxDateFull')");
  //console.log(this.starttime);
  //console.log(this.endtime);

  if (!this?.$locals?.moment || !this?.$locals?.locale) {
    console.warn(`⚠️ moment or locale is missing in $locals for _id ${this._id}`);
    return ''; // ✅ questo evita l'errore .utc of undefined
  }

  if (!this.starttime || !this.endtime) {
    console.warn(`⚠️ Missing starttime or endtime for _id ${this._id}`);
    return '';
  }

  try {
    const moment = this.$locals.moment;
    const lang = this.$locals.locale;

    const start = new Date(this.starttime).getTime();
    const end = new Date(this.endtime).getTime();
    const days = Math.ceil((end - start) / (24 * 60 * 60 * 1000));

    let boxDate;

    if (days > 1) {
      boxDate = `From: ${moment.utc(start).format(config.dateFormat[lang].weekdaydaymonthyear)}<br />` +
                `To: ${moment.utc(end).format(config.dateFormat[lang].weekdaydaymonthyear)}<br />` +
                `${moment.utc(this.starttime).format("HH:mm")} > ${moment.utc(this.endtime).format("HH:mm")}`;
    } else {
      boxDate = moment.utc(this.starttime - 10 * 60 * 60 * 1000).format(config.dateFormat[lang].weekdaydaymonthyear);
      boxDate += " | " + moment.utc(this.starttime).format("HH:mm");
      boxDate += " > " + moment.utc(this.endtime).format("HH:mm");
    }

    //console.log("virtual('boxDateFull') end");
    return boxDate;
  } catch (err) {
    console.error(`❌ Error in virtual boxDateFull for _id=${this._id}:`, err);
    return '';
  }
});

/* Schedule.virtual('boxDateFull').get(function () {
  //console.log("virtual('boxDateFull')")
  //console.log(this.starttime)
  //console.log(this.endtime)
  if (!this?.$locals?.moment || !this?.$locals?.locale) {
    console.warn("⚠️ moment or locale is missing in $locals");
    return '';
  }

  if (!this.starttime || !this.endtime) {
    console.warn(`⚠️ Missing starttime or endtime in document ${this._id}`);
    return '';
  }
  let boxDate;
  if (this.starttime) {
    const lang = this.$locals.locale;
    const start = new Date(this.starttime).getTime()
    const end = new Date(this.endtime).getTime()
    const days = Math.ceil((end-start)/(24*60*60*1000))
    if (days > 1) {
      let boxDateA = []
      let boxDateTMP = "";
      let a=0
      boxDateTMP = "From: "+this.$locals.moment.utc((new Date(this.starttime).getTime())+(a*(24*60*60*1000))).format(config.dateFormat[lang].weekdaydaymonthyear);
      boxDateA.push(boxDateTMP);

      boxDateTMP = "";
      a<=days-1
      boxDateTMP = "To: "+this.$locals.moment.utc((new Date(this.endtime).getTime())+(a*(24*60*60*1000))).format(config.dateFormat[lang].weekdaydaymonthyear);
      boxDateA.push(boxDateTMP);

      boxDate = boxDateA.join("<br />");
      boxDate+= "<br />"+this.$locals.moment.utc(this.starttime).format('HH:mm');
      boxDate+= " > "+this.$locals.moment.utc(this.endtime).format('HH:mm');
    } else {
      boxDate = this.$locals.moment.utc(this.starttime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear);
      boxDate+= " | "+this.$locals.moment.utc(this.starttime).format('HH:mm');
      boxDate+= " > "+this.$locals.moment.utc(this.endtime).format('HH:mm');
    }
  }
  //console.log("virtual('boxDateFull') end")
  return boxDate;
}); */

/* Schedule.virtual('boxDateFull').get(function () {
  let boxDate;
  if (this.starttime) {
    const lang = this.$locals.locale;
    const start = new Date(this.starttime-(10*60*60*1000)).getTime()
    const end = new Date(this.endtime-(10*60*60*1000)).getTime()
    const days = Math.ceil((end-start)/(24*60*60*1000))
    if (days > 1) {
      let boxDateA = []
      for(let a=0;a<=days;a++) {
        let boxDateTMP = "";
        boxDateTMP = this.$locals.moment.utc((new Date(this.starttime-(10*60*60*1000)).getTime())+(a*(24*60*60*1000))).format(config.dateFormat[lang].weekdaydaymonthyear);
        boxDateTMP+= " | "+this.$locals.moment.utc(this.starttime).format('HH:mm');
        boxDateTMP+= " > "+this.$locals.moment.utc(this.endtime).format('HH:mm');
        boxDateA.push(boxDateTMP);
      }
      boxDate = boxDateA.join("<br />");
    } else {
      boxDate = this.$locals.moment.utc(this.starttime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear);
      boxDate+= " | "+this.$locals.moment.utc(this.starttime).format('HH:mm');
      boxDate+= " > "+this.$locals.moment.utc(this.endtime).format('HH:mm');
    }
  }
  return boxDate;
}); */
Schedule.virtual('boxDate').get(function () {
  ////console.log("virtual('boxDate')")
  let boxDate;
  if (this.starttime && this.endtime && this.$locals && this.$locals.moment && this.$locals.moment.utc) {
    const lang = this.$locals.locale;
    const start = new Date(this.starttime-(10*60*60*1000)).getTime()
    const end = new Date(this.endtime-(10*60*60*1000)).getTime()
    const days = Math.ceil((end-start)/(24*60*60*1000))
    let startformattedA = this.$locals.moment.utc(this.starttime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear).split(" ");
    let endformattedA = this.$locals.moment.utc(this.endtime-(10*60*60*1000)).format(config.dateFormat[lang].weekdaydaymonthyear).split(" ");
    if (startformattedA[startformattedA.length-1] == endformattedA[startformattedA.length-1]) startformattedA.pop()
    if (startformattedA[startformattedA.length-1] == endformattedA[startformattedA.length-1]) startformattedA.pop()
    if (days>1) {
      boxDate = startformattedA.join(" ");
      boxDate+= " > ";
    } else {
      boxDate = "";
    }
    boxDate+= endformattedA.join(" ");
    boxDate+= " | "+this.$locals.moment.utc(this.starttime).format('HH:mm');
    boxDate+= " > "+this.$locals.moment.utc(this.endtime).format('HH:mm');
  }
  ////console.log("virtual('boxDate') end")
  return boxDate;
});
Schedule.virtual('starttimeDay').get(function () {
  ////console.log("virtual('starttimeDay')")
  let boxDate;
  if (this.starttime && this.endtime && this.$locals && this.$locals.moment && this.$locals.moment.utc) {
    const lang = this.$locals.locale;
    const start = new Date(this.starttime-(10*60*60*1000)).getTime()
    const end = new Date(this.endtime-(10*60*60*1000)).getTime()
    const days = Math.ceil((end-start)/(24*60*60*1000))
    if (days > 1) {
      let boxDateA = []
      for(let a=0;a<=days;a++) {
        let boxDateTMP = "";
        boxDateTMP = this.$locals.moment.utc((new Date(this.starttime-(10*60*60*1000)).getTime())+(a*(24*60*60*1000))).format(config.dateFormat[lang].weekdayday);
      }
      boxDate = boxDateA.join("<br />");
    } else {
      boxDate = this.$locals.moment.utc(this.starttime-(10*60*60*1000)).format(config.dateFormat[lang].weekdayday);
    }
  }
  ////console.log("virtual('starttimeDay') end")
  return boxDate;
});

Schedule.virtual('starttimeTime').get(function () {
  ////console.log("virtual('starttimeTime')")
  let starttimeTime;
  if (this.starttime && this.$locals && this.$locals.moment && this.$locals.moment.utc) {
    const lang = this.$locals.locale;
    starttimeTime = this.$locals.moment.utc(new Date(this.starttime)).format('HH:mm');
  }
  ////console.log("virtual('starttimeTime') end")
  return starttimeTime;
});

Schedule.virtual('endtimeTime').get(function () {
  let endtimeTime;
  if (this.endtime && this.$locals && this.$locals.moment && this.$locals.moment.utc) {
    endtimeTime = this.$locals.moment.utc(this.endtime).format('HH:mm');
    endtimeTime = this.$locals.moment.utc(new Date(this.endtime)).format('HH:mm');
  }
  return endtimeTime;
});

export default Schedule;
