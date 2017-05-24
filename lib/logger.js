/**
 * logger.js is a log configuration module for winston and morgan loggers
 *
 * Winston is logger used to log data based on levels(info, error, warn, etc)
 * Morgan is logger used to log only HTTP traffic data
 *
 * Winston logging Syntax:
 * var logger = require('./lib/logger')
 *
 * // Information logging
 * logger.log('info', "127.0.0.1 - there's no place like home")
 * // OR
 * logger.info('info testing')
 *
 * // Warning logging
 * logger.log('warn', "127.0.0.1 - there's no place like home")
 * // OR
 * logger.warn('warn testing')
 *
 * // Error Logging
 * logger.log('error', "127.0.0.1 - there's no place like home")
 * // OR
 * logger.error('error testing')
 *
 * Ref: http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
 */
var winston = require('winston')
winston.emitErrs = true


// Logger Configuration for log using winston
winston.loggers.add('winstonLogger', {
  transports: [
    new winston.transports.File({ // To log only errors
      name: 'error-file',
      level: 'error',
      filename: './logs/error.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.File({ // To all level logs Information
      name: 'info-file',
      filename: './logs/app.log',
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({ // To log to console
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ]
})

// Logger Configuration for log using morgan
// This will log HTTP Request Information
winston.loggers.add('morganLogger', {
  transports: [
    new winston.transports.File({ 
      name: 'morgan-file',
      filename: './logs/server.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    })
  ]
})

var morganLogger = winston.loggers.get('morganLogger')

module.exports = winston.loggers.get('winstonLogger')
module.exports.stream = {
  write: function (message, encoding) {
    morganLogger.info(message)
  }
}
