import mongoose from 'mongoose';
const { Schema } = mongoose;

import Address from './Address.js';

const Venue = new Schema({
  name: String,
  room: String,
  breakduration: Number,
  url: String,
  type: String,
  location: Address
},{ _id : false });

Venue.virtual('mapUrl').get(function () {
  let url = '';
  if (this.location && this.location.geometry) {
    url = 'https://maps.googleapis.com/maps/api/staticmap';
    url += '?center=' + encodeURIComponent(this.location.geometry.location);
    url += '&zoom=10';
    url += '&size=400x200';
    url += '&key=' + process.env.GOOGLEMAPSAPIKEY;
  }
  return url;
});

export default Venue;
