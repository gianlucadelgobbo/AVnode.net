import winston from 'winston';
import path from 'path';
import fs from 'fs';
import config from 'getconfig';
import DailyRotateFile from 'winston-daily-rotate-file';
import expressWinston from 'express-winston';

// 🔥 Ensure log directory exists
const logDir = path.join(config.appRoot, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 🔥 Environment Config
const isDev = process.env.NODE_ENV === 'development';
const isDebug = process.env.DEBUG;
console.log("process.env.DEBUG")
console.log(process.env.DEBUG)
const logLevel = isDebug ? 'debug' : isDev ? 'info' : 'warn';

// 🔥 Stack Trace Filtering (Keeps Console Logs Readable)
const filterStackTrace = (stack) => {
  if (!stack) return null;
  const relevantLines = stack.split('\n').filter(line => !line.includes('node_modules'));
  if (relevantLines.length > 0) {
    const match = relevantLines[0].match(/at .* \((.*):(\d+):\d+\)/);
    if (match) return `File: ${path.relative(config.appRoot, match[1])}, Line: ${match[2]}`;
  }
  return null;
};

// 🔥 Log Format for Files (Structured JSON)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// 🔥 Log Format for Console (Deep Debugging)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let logMessage = `${timestamp} [${level}]: ${formatMessage(message)}`;
    
    // Include additional metadata
    if (Object.keys(meta).length) {
      //logMessage += `\n${formatObject(meta)}`;
    }

    // Include filtered stack trace
    const filteredStack = filterStackTrace(stack);
    if (filteredStack) {
      logMessage += `\n${filteredStack}`;
    }

    return logMessage;
  })
);

// 🔥 Helper Functions to Format Logs
function formatObject(obj) {
  return JSON.stringify(obj, null, 2); // Pretty-print objects
}

function formatMessage(message) {
  return typeof message === "object" ? JSON.stringify(message, null, 2) : message;
}

// 🔥 Main Logger
const logger = winston.createLogger({
  level: logLevel,
  format: fileFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'avnode_error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'avnode_combined.log') }),
    new DailyRotateFile({
      filename: path.join(logDir, 'avnode_application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '14d',
    }),
  ],
});

// 🔥 Add Console Logging in Development & Debug Mode (Preserves Debug Depth)
if (isDev || isDebug) {
  logger.add(new winston.transports.Console({ format: consoleFormat }));
}

// 🔥 Express Request Logger (Middleware)
const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  format: fileFormat,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}} - Status: {{res.statusCode}} - Response Time: {{res.responseTime}}ms",
  expressFormat: true,
  requestWhitelist: ["headers", "body", "query"],
  responseWhitelist: ["body"],
});

// 🔥 Express Error Logger (Middleware)
const expressErrorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      let logMessage = `${timestamp} [${level}]: ${message}`;
      if (stack) logMessage += `\n🔥 Stack Trace:\n${stack}`;
      return logMessage;
    })
  ),
});

// 🔥 Debug Logger (Fully Compatible with `debug` package)
const debugLogger = winston.createLogger({
  level: 'debug',
  format: consoleFormat,
  transports: [new winston.transports.Console()],
});

// 🔥 Debug Function (Now Fully Works Like `debug`)
const debug = (...args) => {
  if (isDebug) {
    debugLogger.debug(args.join(" "));
  }
};

// 🔥 Handle Logger Errors
logger.on('error', (err) => {
  console.error('🔥 Winston Logger Error:', err);
});

// 🔥 Export Everything (Maintains Your Existing Imports)
export { logger, requestLogger, expressErrorLogger as errorLogger, debug };
