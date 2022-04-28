const SimpleNodeLogger = require('simple-node-logger')

const log = SimpleNodeLogger.createRollingFileLogger({
  logDirectory: './storage/logs',
  fileNamePattern: '<DATE>.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
})

module.exports = log
