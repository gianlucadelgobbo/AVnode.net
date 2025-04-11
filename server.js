import express from "express";
import compression from "compression";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import moment from "moment";
import "moment-duration-format";

// Import utilities and config
import config from "getconfig";
import i18n from "./app/utilities/i18n.js";
import { passport } from './app/utilities/passport.js';
import routes from "./app/routes/index.js";
import { logger, requestLogger, errorLogger as expressErrorLogger } from './app/utilities/logger.js';

// Initialize Express app
const app = express();
app.locals.moment = moment;

// Gestione delle eccezioni non catturate
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1); // In produzione, esci dopo aver registrato l'errore
});

// Gestione dei rejection non gestiti
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', {
    reason: reason,
    promise: promise,
    message: reason.message || "No message",
    stack: reason.stack || "No stack",
    details: JSON.stringify(reason, null, 2)
  });
  process.exit(1); // In produzione, esci dopo aver registrato l'errore
});

// Pass config to Pug templates
app.use((req, res, next) => {
  res.locals.config = config;
  next();
});

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    res.locals.frontendDomain = "";
    return next(); // Salta in ambienti non production
  }

  const host = req.get('host'); // es. it.admin.avnode.net
  const protocol = req.protocol;

  // Sostituzione flessibile
  const replaceWith = process.env.FRONTEND_PREFIX || ''; // es. "" o "dev."

  // Rimpiazza solo il primo "admin." nel dominio
  let frontendHost = host.replace(/^(([^.]+\.)?)admin\./, `$1${replaceWith}`);

  res.locals.frontendDomain = `${protocol}://${frontendHost}`;
  next();
});

// Set up headers for CORS
/* const allowedOrigins = ["https://avnode.net", "https://dev.avnode.net", "*.avnode.net"];
app.use((req, res, next) => {
  const origin = req.get("origin");
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  next();
}); */
const allowedOrigins = [
  "https://avnode.net",
  "https://by.avnode.net",
  "https://de.avnode.net",
  "https://es.avnode.net",
  "https://fr.avnode.net",
  "https://gr.avnode.net",
  "https://hu.avnode.net",
  "https://it.avnode.net",
  "https://pl.avnode.net",
  "https://pt.avnode.net",
  "https://ru.avnode.net",

  "http://avnode.local:3000",
  "http://by.avnode.local:3000",
  "http://de.avnode.local:3000",
  "http://es.avnode.local:3000",
  "http://fr.avnode.local:3000",
  "http://gr.avnode.local:3000",
  "http://hu.avnode.local:3000",
  "http://it.avnode.local:3000",
  "http://pl.avnode.local:3000",
  "http://pt.avnode.local:3000",
  "http://ru.avnode.local:3000",

  "http://admin.avnode.local:8102",
  "http://by.admin.avnode.local:8102",
  "http://de.admin.avnode.local:8102",
  "http://es.admin.avnode.local:8102",
  "http://fr.admin.avnode.local:8102",
  "http://gr.admin.avnode.local:8102",
  "http://hu.admin.avnode.local:8102",
  "http://it.admin.avnode.local:8102",
  "http://pl.admin.avnode.local:8102",
  "http://pt.admin.avnode.local:8102",
  "http://ru.admin.avnode.local:8102",
  "http://api.admin.avnode.local:8102",
  "http://by.api.admin.avnode.local:8102",
  "http://de.api.admin.avnode.local:8102",
  "http://es.api.admin.avnode.local:8102",
  "http://fr.api.admin.avnode.local:8102",
  "http://gr.api.admin.avnode.local:8102",
  "http://hu.api.admin.avnode.local:8102",
  "http://it.api.admin.avnode.local:8102",
  "http://pl.api.admin.avnode.local:8102",
  "http://pt.api.admin.avnode.local:8102",
  "http://ru.api.admin.avnode.local:8102",

  "https://dev.avnode.net",
  "https://by.dev.avnode.net",
  "https://de.dev.avnode.net",
  "https://es.dev.avnode.net",
  "https://fr.dev.avnode.net",
  "https://gr.dev.avnode.net",
  "https://hu.dev.avnode.net",
  "https://it.dev.avnode.net",
  "https://pl.dev.avnode.net",
  "https://pt.dev.avnode.net",
  "https://ru.dev.avnode.net"
];

function isAllowed(origin) {
  if (!origin) return true; // allow non-browser requests
  const { hostname } = new URL(origin);

  // Allow direct matches
  if (allowedOrigins.includes(origin)) return true;

  // Allow subdomains of avnode.net
  if (hostname.endsWith('.avnode.net')) return true;

  return false;
}

app.use(cors({
  origin: function (origin, callback) {
    if (isAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// View Engine Configuration
app.set("port", config.port || 8102);
app.set("views", path.join(config.appRoot, "app/views"));
app.set("view engine", "pug");
app.set("view options", { debug: process.env.DEBUG });
app.set("trust proxy", "loopback");

// Middleware
app.use(compression());
app.use(express.static(path.join(config.appRoot, "public")));
//app.use("/storage", express.static(path.join(config.appRoot, "storage")));
app.use("/warehouse", express.static(path.join(config.appRoot, "warehouse")));
app.use("/glacier", express.static(path.join(config.appRoot, "glacier")));

app.use(bodyParser.json({ limit: "10gb" }));
app.use(bodyParser.urlencoded({ limit: "10gb", extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(flash());

// Initialize i18n
app.use(i18n.init);

app.use((req, res, next) => {
  //console.log("✅ Setting global.currentRequest:", req.originalUrl);
  global.currentRequest = req;
  next();
});
/* // 🔥 Block access from certain IPs
const blockedIPs = new Set((process.env.BLOCKED_IPS || "").split(","));
app.use((req, res, next) => {
  const host = req.get("host") || req.get("X-Forwarded-Host");
  if (blockedIPs.has(host)) {
    logger.warn(`⛔ Blocked access from IP: ${host}`);
    return res.redirect("https://admin.avnode.net" + req.originalUrl);
  }
  next();
}); */

// Secure Sessions
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      domain: process.env.NODE_ENV === "production" ? ".avnode.net" : ".avnode.local",  // ✅ Share cookie across all subdomains
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",  // Allow cross-subdomain access
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: process.env.MONGODB_NAME,
      touchAfter: 24 * 3600,
    }),
  })
);


app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;

  // ✅ Verifica che `req.get("host")` esista e sia valido
  let host = req.get("host");
  if (!host) {
    console.error(`[ERROR] Host is undefined for request from ${req.ip}`);
    host = process.env.NODE_ENV === "production" ? "admin.avnode.net" : "admin.avnode.local:8102"
  }

  const url = req.originalUrl ? req.originalUrl.split("?")[0] : "/";
  res.locals.host = host;

  const isLocal = host.endsWith("admin.avnode.local:8102") || host.endsWith("api.admin.avnode.local:8102");
  res.locals.isLocal = isLocal;
  console.log("isLocal")
  console.log(isLocal)
  console.log(host)
  res.locals.canonical = (isLocal ? "http" : "https") + "://" + host + url;

  next();
});

app.use((req, res, next) => {
  if (!req.user && req.method === "GET" && !req.session.returnTo) {
    const excludePaths = ["/login", "/signup", "/logout", "/"]; // ✅ Excluded routes
    if (!excludePaths.includes(req.path)) {
      req.session.returnTo = req.originalUrl; // ✅ Save the page user was trying to visit
      //logger.info("Stored returnTo:", req.session.returnTo);
    }
  } else {
    delete req.session.returnTo
  }
  next();
});



app.use((req, res, next) => {

  const host = req.get("host")?.toLowerCase() || "localhost";
  const parts = host.split(".");
  let lang = config.defaultLocale || "en";

  // ✅ Detect API vs Admin
  let isApi = false;
  if (parts.includes("api")) {
    isApi = true; // ✅ Mark request as API
  }

  // ✅ Detect Language from Subdomain
  if (parts.length > 2) {
    const subdomain = parts[0];
    if (config.domain_to_lang[subdomain]) {
      lang = config.domain_to_lang[subdomain]; // ✅ Assign language
    }
  }

  if (req.cookies?.lang && Object.values(config.domain_to_lang).includes(req.cookies.lang)) {
    lang = req.cookies.lang; // ✅ Allow cookie override
  }

  req.session.current_lang = lang; // ✅ Store language in session
  req.isApi = isApi; // ✅ Store API flag in request
  res.locals.isApi = isApi; // ✅ Make available in templates

  // ✅ Localized moment instances (prevent global race conditions)
  req.moment = () => moment().locale(lang);
  res.locals.moment = (date) => moment(date).locale(lang);

  // ✅ i18n Setup
  req.setLocale(lang);
  req.__ = i18n.__.bind(req);
  res.locals.__ = req.__;

  logger.info("⚠️ DEBUG: Setting session language", {
    detectedLang: lang,
    sessionLang: req.session.current_lang,
    momentLang: req.moment().locale(),
    i18nLocale: req.getLocale(),
    isApi: req.isApi, // ✅ Log API status
  });

  next();
});

// 🔥 Admin Access Control
const adminPathRegex = /^\/(admin|adminpro)/;
const excludedRoutes = new Set([
  "/login", "/logout", "/signup", "/admin/api/signup",
  "/warehouse", "/fonts", "/css", "/datetimeentry",
  "/fullcalendar", "/icons", "/images", "/js",
  "/lightgallery", "/organizations", "/webfonts"
]);

app.use((req, res, next) => {
  if (excludedRoutes.has(req.path)) return next();

  if (!req.user && adminPathRegex.test(req.path)) {
    req.session.returnTo = req.originalUrl.includes("/admin/api/loggeduser") ? "/" : req.originalUrl;
    if (req.isApi) {
      return res.status(404).send({
        error: true,
        path: req.originalUrl,    
        "msg": {
          "errors": {
            "login": {
                "message": req.__("Please login to use this tool")
            }
          }
        }
      });
    } else {
      return res.redirect("/login");
    }

  }

  next();
});

// ✅ Winston logs all HTTP requests
app.use(requestLogger); // Aggiungi il logger delle richieste PRIMA delle route
//logger.info("🚀 Debug: server.js loaded");

// Check if routes exist
/* if (!routes) {
  logger.error("❌ ERROR: index.js (routes) is NOT being imported correctly!");
} else {
  logger.info("✅ index.js (routes) is imported successfully.");
} */
// ✅ Load Routes

app.use(routes);

// Log route sources
/* setTimeout(() => {
  logger.info("🛤 All Registered Routes in Express:");
  if (app._router) {
    app._router.stack.forEach((middleware, index) => {
      if (middleware.route) {
        logger.info(`🛤 Route ${index}: ${middleware.route.path}`);
      } else if (middleware.name === "router") {
        logger.info(`🛠 Middleware ${index}: (Router Middleware)`);
      } else {
        logger.info(`🛠 Middleware ${index}: ${middleware.name}`);
      }
    });
  } else {
    console.error("❌ ERROR: app._router is undefined!");
  }
}, 3000); */
// ✅ ExpressWinston Middleware: Captures All Express Errors Automatically
app.use(expressErrorLogger); // Aggiungi il logger degli errori DOPO le route

// Global error handler
app.use((err, req, res, next) => {
  logger.error("🔥 Express Error Handler Caught an Error!", {
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
  });

  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
  }
});

export default app;