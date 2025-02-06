const chalk = require('chalk');
const app = require('./server');
const mongoose = require('./app/utilities/mongoose');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('Connesso con successo al database MongoDB');
    app.listen(app.get('port'), () => {
      console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
      console.log('  Press CTRL-C to stop\n');
    });
  } catch (error) {
    console.error('Errore di connessione al database:', error);
    process.exit(1);
  }
})();

