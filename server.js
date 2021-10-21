const express = require("express");
const compression = require("compression");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require('morgan');
const MongoStore = require("connect-mongo");
const flash = require("express-flash");
//const expressStatusMonitor = require('express-status-monitor');
const moment = require("moment");

// Require mongoose models once!
require("./app/models");

const fs = require("fs");
const config = require("getconfig");
global.config = config;
config.defaultLocale = process.argv[3];
const i18n = require("./app/utilities/i18n");
const passport = require("./app/utilities/passport");
const routes = require("./app/routes");
const logger = require("./app/utilities/logger");


// FIXME Kids say not cool
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
global.appRoot = path.resolve(__dirname);

const app = express();
app.locals.moment = require('moment');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  next();
});

app.set("port", config.ports[config.defaultLocale] || 3000);
app.set("views", path.join(__dirname, "app/views"));
app.set("view engine", "pug");
app.set("view options", { debug: true });
app.set("trust proxy", "loopback");

var accessLogStream = fs.createWriteStream(__dirname + '/../logs/avnode_'+process.argv[3]+'_errors.log', {flags: 'a'})

app.use(morgan('combined',  { skip: function (req, res) { return res.statusCode < 400 }, "stream": accessLogStream}));
//app.use(expressStatusMonitor());

app.use(compression());
/* app.use(
  sass({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    debug: true,
    outputStyle: "compressed"
  })
); */

app.use(express.static(path.join(__dirname, "public")));
app.use("/storage", express.static(path.join(__dirname, "storage")));
app.use("/warehouse", express.static(path.join(__dirname, "warehouse")));
app.use("/glacier", express.static(path.join(__dirname, "glacier")));
// app.use("/gulp", express.static(path.join(__dirname, "gulp")));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);
app.use(cookieParser());
app.use(flash());

app.use(i18n.init);
app.use(function(req, res, next) {
  if (req.get("host") === "176.9.142.221:8006") {
    res.redirect("https://avnode.net"+ req.originalUrl);
  } else {
    next();
  }
});
app.use(function(req, res, next) {
  // ADD VARS TO JADE
  res.locals.current_url = req.url;
  res.locals.protocol = req.get("host") === "localhost:8006" ? "http" : "https" /*req.protocol*/;
  if (req.headers && req.headers.host) {
    let hostA = req.headers.host.split(".");
    if (config.domain_to_lang[hostA[0]]) hostA.shift();
    res.locals.basehost = hostA.join(".");
  }
  next();
});
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      //autoReconnect: true,
      touchAfter: 24 * 3600 // time period in seconds
    })
  })
);
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});
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
  req.session.current_lang = config.defaultLocale;
  global.setLocale(req.session.current_lang);
  moment.locale(req.session.current_lang);

  if (/auth|login|logout|signup|images|fonts/i.test(path)) {
    return next();
  }

  if (
    !req.user &&
    req.path.indexOf("/admin") === 0 &&
    req.path !== "/admin/api/signup"
  ) {
    req.session.returnTo = req.path.replace("/admin/api/loggeduser", "/");
    res.redirect("/login");
  } else {
    next();
  }
});

// Temporary cors to have redux come in cross origin
/* const cors = require("cors");
var corsOptions = {
  origin: "https://liveperformersmeeting.net",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors()); */
app.use(routes);

/* app.use(function(err, req, res, next) {
  console.error("URL: " + req.headers.host + req.url); // URL of req made
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  next(err);
  //res.status(err.statusCode).send("Internal server error"); // All HTTP requests must have a response, so let's send back an error with its status code and message
}); */

module.exports = app;
