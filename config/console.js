const path = require('path')
const chalk = require('chalk')

const methods = ['debug', 'log', 'warn', 'error']
methods.forEach(methodName => {
  const originalLoggingMethod = console[methodName]

  console[methodName] = (firstArgument, ...otherArguments) => {
    const originalPrepareStackTrace = Error.prepareStackTrace
    Error.prepareStackTrace = (_, stack) => stack
    const callee = new Error().stack[1]
    Error.prepareStackTrace = originalPrepareStackTrace
    const relativeFileName = path.relative(process.cwd(), callee.getFileName())
    const prefix = chalk.cyan.underline(`${relativeFileName}:${callee.getLineNumber()}:`)

    if (typeof firstArgument === 'string') {
      originalLoggingMethod(prefix + ' ' + firstArgument, ...otherArguments)
    } else {
      originalLoggingMethod(prefix, firstArgument, ...otherArguments)
    }
  }
})
