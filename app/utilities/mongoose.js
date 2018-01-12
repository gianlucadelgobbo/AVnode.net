const chalk = require('chalk');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

module.exports = mongoose;
