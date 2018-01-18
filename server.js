const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');

// Require mongoose models once!
require('./app/models');

const i18n = require('./app/utilities/i18n');
const passport = require('./app/utilities/passport');
const routes = require('./app/routes');
const logger = require('./app/utilities///logger');

// config = require('getconfig');

// FIXME Kids say not cool
const dotenv = require('dotenv');
dotenv.load({ path: '.env.local' });
global.appRoot = path.resolve(__dirname);

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

app.use(morgan('short'));
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(i18n.init);
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true
  })
}));

// FIXME
// This blocks mocha testing, so we disable it
// in this context…
/**
const lusca = require('lusca');
if(process.env.NODE_ENV !== 'testing') {
  app.use((req, res, next) => {
    lusca.csrf()(req, res, next);
  });
}
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
*/

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use((req, res, next) => {
  const path = req.path.split('/')[1];
  const lang = req.headers.host.split('.')[0]!='avnode' || req.headers.host.split('.')[0]!='dev' || req.headers.host.split('.')[0]!='api' ? req.headers.host.split('.')[0] : 'en';
  //logger.debug('req.headers.host: '+req.headers.host);
  //logger.debug('lang: '+lang);
  //delete req.session.sessions;
  //logger.debug(req.session);
  if(!req.session.sessions) {
    //logger.debug('create sessions');
    req.session.sessions = {current_lang: 'en'};
    //logger.debug(req.session.sessions);
  }
  //logger.debug('req.session.sessions.current_lang: '+req.session.sessions.current_lang);
  if(req.session.sessions.current_lang != lang) {
    //logger.debug('changelang');
    req.session.sessions.current_lang = lang;
    //logger.debug('req.session.sessions.current_lang: '+req.session.sessions.current_lang);
    //logger.debug('global.getLocale: '+global.getLocale());
  }
  global.setLocale(req.session.sessions.current_lang);
  //logger.debug('global.getLocale: '+global.getLocale());

  if (/auth|login|logout|signup|images|fonts/i.test(path)) {
    return next();
  }
  /*if (!req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
      if (req.path.match(/^\/admin/)) {
        res.redirect('/login');
      } else {
        req.session.returnTo = req.path;
      }
  } else */
  //logger.debug('req.path: '+req.path);

  if (!req.user && req.path.indexOf('/admin')===0) {
    req.session.returnTo = req.path;
    res.redirect('/login');
  } else {
    next();
  }
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 84600 }));
// not needed because in public/ app.use(express.static(path.join(__dirname, process.env.STORAGE), { maxAge: 84600 }));

// FIXME
// From your there could be dragons!!!
// 🔥🐉 🔥🐉 🔥🐉 🔥🐉 🔥🐉 🔥🐉 🔥🐉 🔥🐉

// Temporary cors to have redux come in cross origin
const cors = require('cors');
app.use(cors());
app.use(routes);

// FIXME
// Blocks pug exceptions, do we need it at all?
//
app.use(function (err, req, res, _next) {
  if (err.isBoom) {
    req.flash('errors', { msg: err.message });
    return res.redirect('back');
  }
});

// FIXME
// What was this about?
//
// error middleware for errors that occurred in middleware
// declared before this

app.use(function onerror(err, req, res, next) {
  // happens on user not logged in  
  if (err) {
    console.log(`🔥🐉 🔥🐉 🔥🐉 🔥🐉 🔥🐉 🔥🐉 🔥🐉 🔥🐉 Server Error:${err}`);
    //throw err;
  }
});

const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler, {
  log: console.log
}));

module.exports = app;
