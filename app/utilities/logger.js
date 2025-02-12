import winston from "winston";
import expressWinston from "express-winston";
import path from "path";
import config from "getconfig";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = path.join(config.appRoot, "../logs");

// Determina il livello di logging
const isDev = process.env.NODE_ENV === "development";
const isDebug = process.env.DEBUG === "true";
const logLevel = isDebug ? "debug" : isDev ? "info" : "warn";

// Configurazione principale del logger
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(logDir, "combined.log") }),
    new DailyRotateFile({
      filename: path.join(logDir, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "10m", // Limita ogni file a 10MB
      maxFiles: "14d", // Mantieni i log degli ultimi 14 giorni
    }),
  ],
});

// In sviluppo, logghiamo anche in console con colori
if (isDev || isDebug) {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

// Middleware per loggare tutte le richieste HTTP
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "access.log") }),
  ],
  format: winston.format.json(),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}} - Status: {{res.statusCode}} - {{res.responseTime}}ms",
  expressFormat: true,
  colorize: false,
});

// Middleware per catturare errori e salvarli su `error.log`
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "error.log") }),
  ],
  format: winston.format.json(),
});

export { logger, requestLogger, errorLogger };
