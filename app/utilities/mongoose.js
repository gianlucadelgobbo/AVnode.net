const mongoose = require('mongoose');

//mongoose.Promise = Promise;
mongoose.connection.on('error', () => {
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

module.exports = mongoose;
