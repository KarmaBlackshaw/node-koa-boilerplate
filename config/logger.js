const SimpleNodeLogger = require('simple-node-logger')

module.exports = SimpleNodeLogger.createRollingFileLogger({
  logDirectory: './storage/logs',
  fileNamePattern: '<DATE>.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
})
