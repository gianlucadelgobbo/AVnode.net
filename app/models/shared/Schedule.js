const Schema = require('mongoose').Schema;
const moment = require('moment');

const Venue = require('./Venue');

const Schedule = new Schema({
  date: Date,
  starttime: Date,
  endtime: Date,
  venue: Venue
});

Schedule.virtual('date_formatted').get(function () {
  return moment(this.date).format('MMMM Do YYYY');
});
Schedule.virtual('starttime_formatted').get(function () {
  return moment(this.starttime).format('h:mm');
});
Schedule.virtual('endtime_formatted').get(function () {
  return moment(this.endtime).format('h:mm');
});

module.exports = Schedule;
