import mongoose from 'mongoose';
const { Schema } = mongoose;

const About = new Schema({
  lang: String, // removed { type: String, unique: true },
  abouttext: String,
  is_primary: { type: Boolean, default: false }
},{ _id : false });

export default About;
