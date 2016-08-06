'use strict';

var logger = require('winston');
var config = require('config');
var logLevel = process.env.LOG_LEVEL || 'info';

if (config.loggly && !logger.transports.Loggly) {
  var Loggly = require('winston-loggly').Loggly;

  logger.add(Loggly, config.loggly);
}

logger.level = logLevel;

if (process.env.LOG_STREAM) {
  logger.add(logger.transports.File, {
      filename: process.env.LOG_STREAM,
      level: logLevel
    }
  );
}

module.exports.changeLogLevel = function (newLogLevel) {
  logger.level = newLogLevel;
};

logger.args = function args(msg, params) {
  logger.info(msg, params[0]);
};


module.exports.logger = logger;