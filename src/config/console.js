// libs
const path = require('path')
const chalk = require('chalk')

// constants
const CWD = process.cwd()

// vars
const methods = [
  {
    name: 'debug',
    prefix: chalk.blue('[DEBUG]')
  },
  {
    name: 'warn',
    prefix: chalk.yellow('[WARN]')
  },
  {
    name: 'error',
    prefix: chalk.red('[ERROR]')
  },
  {
    name: 'deprecate',
    prefix: chalk.red('[DEPRECATED]')
  },
  {
    name: 'raw'
  },
  {
    name: 'log'
  }
]

methods.forEach(method => {
  const originalLoggingMethod = console[method.name] || console.log

  console[method.name] = (...otherArguments) => {
    const originalPrepareStackTrace = Error.prepareStackTrace
    Error.prepareStackTrace = (_, stack) => stack
    const callee = new Error().stack[1]
    Error.prepareStackTrace = originalPrepareStackTrace

    const filename = path.relative(CWD, callee.getFileName())
    const source = chalk.cyan.underline(`${filename}:${callee.getLineNumber()}:`)
    const sourceAndPrefix = method.name === 'raw'
      ? ''
      : [source, method.prefix].join(' ').trim()

    originalLoggingMethod(sourceAndPrefix, ...otherArguments)
  }
})
