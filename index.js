const app = require('./server');
const mongoose = require('./app/utilities/mongoose');

/* const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
  //useMongoClient: true
}; */
const options = {
  autoIndex: true, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect(process.env.MONGODB_URI, options, (error) => {
  app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('Press CTRL-C to stop\n');
  });
});

