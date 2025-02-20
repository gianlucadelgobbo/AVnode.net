import winston from 'winston';
import path from 'path';
import fs from 'fs';
import config from 'getconfig';
import DailyRotateFile from 'winston-daily-rotate-file';
import expressWinston from 'express-winston';

// Directory dei log
const logDir = path.join(config.appRoot, '../logs');

// Crea la directory dei log se non esiste
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configurazione dell'ambiente
const isDev = process.env.NODE_ENV === 'development';
const isDebug = process.env.DEBUG === 'true';
const logLevel = isDebug ? 'debug' : isDev ? 'info' : 'warn';

// Funzione per filtrare lo stack trace
const filterStackTrace = (stack) => {
  if (!stack) return null;

  const stackLines = stack.split('\n');
  // Filtra le righe che NON contengono "node_modules"
  const relevantLines = stackLines.filter(line => !line.includes('node_modules'));

  if (relevantLines.length > 0) {
    // Prendi la prima riga rilevante
    const relevantLine = relevantLines[0];
    const match = relevantLine.match(/at .* \((.*):(\d+):\d+\)/);
    if (match) {
      const file = path.relative(config.appRoot, match[1]); // Percorso relativo del file
      const line = match[2]; // Numero della riga
      return `File: ${file}, Line: ${line}`;
    }
  }

  // Se non trova righe rilevanti, restituisci null
  return null;
};

// Formato per i file di log (JSON completo)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Formato per la console (leggibile e colorato)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let logMessage = `${timestamp} [${level}]: ${formatMessage(message)}`;
    
    // Format additional metadata (like objects)
    const metaData = Object.keys(meta).length ? `\n${formatObject(meta)}` : "";
    
    // Format stack trace
    const filteredStack = filterStackTrace(stack);
    if (filteredStack) {
      logMessage += `\n${filteredStack}`;
    }
    //logMessage += `\n${metaData}`;

    return logMessage;
  })
);

// Helper function to format objects properly
function formatObject(obj) {
  return JSON.stringify(obj, null, 2); // Pretty-print objects
}

// Ensure message isn't just an object
function formatMessage(message) {
  return typeof message === "object" ? JSON.stringify(message, null, 2) : message;
}

// Creazione del logger principale
const logger = winston.createLogger({
  level: logLevel,
  format: fileFormat, // Usa il formato JSON per i file
  transports: [
    // Log degli errori in un file separato
    new winston.transports.File({
      filename: path.join(logDir, 'avnode_error.log'),
      level: 'error',
    }),
    // Log generale in un file combinato
    new winston.transports.File({
      filename: path.join(logDir, 'avnode_combined.log'),
    }),
    // Rotazione giornaliera dei log
    new DailyRotateFile({
      filename: path.join(logDir, 'avnode_application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m', // Dimensione massima del file
      maxFiles: '14000d', // Conserva i log per 14 giorni
    }),
  ],
});

// Aggiungi il trasporto della console in sviluppo
if (isDev || isDebug) {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat, // Usa il formato leggibile per la console
    })
  );
}

// Middleware per il logging delle richieste HTTP
const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  format: fileFormat, // Usa il formato JSON per le richieste
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}} - Status: {{res.statusCode}} - Response Time: {{res.responseTime}}ms",
  expressFormat: true,
  colorize: false,
  requestWhitelist: ["headers", "body", "query"],
  responseWhitelist: ["body"],
});

// Middleware per il logging degli errori HTTP
const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      let logMessage = `${timestamp} [${level}]: ${message}`;
      //const filteredStack = filterStackTrace(stack);
      if (stack) {
        logMessage += `\n🔥 Stack Trace:\n${stack}`;
        //logMessage += `\n${filteredStack}`;
      }
      console.log("stoczzo")
      return logMessage;
    })
  ),
});

// Gestione degli errori di Winston
logger.on('error', (err) => {
  logger.error('🔥 Winston Logger Error:', err);
});

// Esporta il logger e i middleware
export { logger, requestLogger, errorLogger };