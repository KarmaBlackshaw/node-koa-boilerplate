/**
 * Application starting point
 * Boostrap services here
 */

// libs
const chalk = require('chalk')

// config
require('./config/module-alias')
require('@config/console')
require('dotenv').config()

;(async () => {
  try {
    await require('@config/redis').start()
    await require('@config/socket').start()

    await Promise.all([
      require('@bootstrap/jobs')(),
      require('@bootstrap/listeners')(),
      require('@bootstrap/http')()
    ])

    console.log(`Socket running at: \t${chalk.cyan(`http://localhost:${process.env.SOCKET_PORT}`)}`)
    console.log(`App running at: \t${chalk.cyan(`http://localhost:${process.env.APP_PORT}`)}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})()
