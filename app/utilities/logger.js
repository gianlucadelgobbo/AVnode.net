import debug from 'debug';

/**
 * Create debug loggers for different levels.
 */
const info = debug('avnode');
const debugLog = debug('avnode.debug');
const error = debug('avnode.error');

/**
 * Enhanced error logging with filename, line number, and stack trace.
 * @param {Error} err - The error object.
 * @param {string} context - Description of where the error occurred.
 */
export function logError(err, context = "Unknown Context") {
  const errorLocation = getErrorLocation();
  const logMessage = `
🔥 ERROR LOG (${new Date().toISOString()})
📌 Context: ${context}
📁 File: ${errorLocation.file} (Line: ${errorLocation.line})
💥 Message: ${err.message}
🔍 Stack Trace:
${err.stack}
-------------------------------------
  `;

  error(logMessage);
}

/**
 * Extract filename and line number from the error stack trace.
 * @returns {Object} - { file: string, line: string }
 */
function getErrorLocation() {
  const stack = new Error().stack.split("\n").slice(2);
  const relevantLine = stack.find(line => line.includes("file://")) || stack[0];

  const match = relevantLine.match(/(file:\/\/\/[^:]+):(\d+):(\d+)/);
  if (match) {
    return { file: match[1], line: match[2] };
  }
  return { file: "Unknown File", line: "???" };
}

export { info, debugLog, error };
