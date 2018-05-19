const chalk = require('chalk');
const app = require('./server');
const mongoose = require('./app/utilities/mongoose');

const options = {
  //useMongoClient: true
};

mongoose.connect(process.env.MONGODB_URI, options, () => {
  app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
});

