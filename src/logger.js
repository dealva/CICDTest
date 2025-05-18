const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure the logs directory exists
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json() // Log as JSON for Logstash compatibility
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, 'access.log') }), // Main log file
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }), // Errors only
  ],
});

module.exports = logger;
