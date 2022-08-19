const SimpleNodeLogger = require('simple-node-logger')

module.exports = _options => {
  const options = Object.assign({
    logDirectory: './storage/logs',
    fileNamePattern: '<DATE>.log',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
  }, _options)

  return SimpleNodeLogger.createRollingFileLogger(options)
}
