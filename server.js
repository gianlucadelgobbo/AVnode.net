import express from "express";
import compression from "compression";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import moment from "moment";
import fs from "fs";
import { fileURLToPath } from "url";

// Import utilities and config
import config from "getconfig";
import i18n from "./app/utilities/i18n.js";
import { passport } from './app/utilities/passport.js';
import morgan from "morgan";
import { info, debugLog, error } from './app/utilities/logger.js';

import routes from "./app/routes/index.js";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global Config
global.config = config;
config.defaultLocale = process.argv[3];
global.appRoot = __dirname;

// Load models early (but models are now handled in index.js before server start)
//import "./app/models/index.js";

// Initialize Express app
const app = express();
app.locals.moment = moment;

// Set up headers for CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  next();
});

// View Engine Configuration
app.set("port", config.ports[config.defaultLocale] || 3000);
app.set("views", path.join(__dirname, "app/views"));
app.set("view engine", "pug");
app.set("view options", { debug: true });
app.set("trust proxy", "loopback");

// Logging Configuration
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../logs/avnode_" + process.argv[3] + "_errors.log"),
  { flags: "a" }
);

app.use(morgan("combined", { skip: (req, res) => res.statusCode < 400, stream: accessLogStream }));

// Middleware
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use("/storage", express.static(path.join(__dirname, "storage")));
app.use("/warehouse", express.static(path.join(__dirname, "warehouse")));
app.use("/glacier", express.static(path.join(__dirname, "glacier")));

app.use(bodyParser.json({ limit: "10gb" }));
app.use(bodyParser.urlencoded({ limit: "10gb", extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(flash());

// Initialize i18n
app.use(i18n.init);

// Redirect if accessed from old IP address
app.use((req, res, next) => {
  if (req.get("host") === "176.9.142.221:8006") {
    res.redirect("https://avnode.net" + req.originalUrl);
  } else {
    next();
  }
});

// Session Management
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600,
    }),
  })
);

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

// FIXME Kids say not cool
/*
app.use(function(req, res, next) {
  // ADD VARS TO JADE
  res.locals.current_url = req.url;
  res.locals.protocol = req.get("host") === "localhost:8006" ? "http" : "https";
  if (req.headers && req.headers.host) {
    let hostA = req.headers.host.split(".");
    if (config.domain_to_lang[hostA[0]]) hostA.shift();
    res.locals.basehost = hostA.join(".");
  }
  next();
});
 */
// end fixme


// Passport Authentication
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
// ✅ Debugging - Check if session & user exist
/* app.use((req, res, next) => {
  console.log("🔍 DEBUG: Session ID:", req.sessionID);
  console.log("🔍 DEBUG: Session Data:", req.session);
  console.log("🔍 DEBUG: Logged-in User:", req.user);
  res.locals.session = req.session;
  next();
}); */

// Routes
app.use(routes);

// Error Handling Middleware
// Enhanced Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error Middleware Triggered");
  console.error("URL:", req.method, req.headers.host + req.url);
  console.error("Error:", err.message);

  // 🛑 Print stack trace to find the source file
  if (err.stack) {
    console.error("Stack Trace:\n", err.stack);
  }

  // Log error to `debugLog` (so it's also stored in logs)
  debugLog("🔥 Error Middleware Triggered");
  debugLog("URL:", req.method, req.headers.host + req.url);
  debugLog("Error:", err.message);
  debugLog("Stack Trace:\n", err.stack);

  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send("Internal server error");
});




export default app;