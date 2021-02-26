const app = require('./server');
const mongoose = require('./app/utilities/mongoose');

const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
  //useMongoClient: true
};

mongoose.connect(process.env.MONGODB_URI, options, () => {
  app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('Press CTRL-C to stop\n');
  });
});

