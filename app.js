/**
 * Application starting point
 * Boostrap services here
 */

// libs
const chalk = require('chalk')

// config
require('./config/module-alias')
require('@config/console')
const env = require('@config/env')

;(async () => {
  try {
    await env.validate()
    await require('@config/redis').start()
    await require('@config/socket').start()

    await Promise.all([
      require('@bootstrap/jobs')(),
      require('@bootstrap/listeners')(),
      require('@bootstrap/http')()
    ])

    console.log(`Socket running at: \t${chalk.cyan(`http://localhost:${env.SOCKET_PORT}`)}`)
    console.log(`App running at: \t${chalk.cyan(`http://localhost:${env.APP_PORT}`)}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})()
