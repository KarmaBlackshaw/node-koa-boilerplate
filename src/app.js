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

module.exports = (async () => {
  try {
    await require('@config/redis').start()
    await require('@config/socket').start()

    await require('@bootstrap/jobs')()

    const server = await require('@bootstrap/http')()

    console.log(`Socket running at: \t${chalk.cyan(`http://localhost:${process.env.SOCKET_PORT}`)}`)
    console.log(`App running at: \t\t${chalk.cyan(`http://localhost:${process.env.APP_PORT}`)}`)

    return {
      server
    }
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})()