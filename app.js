/**
 * Application starting point
 * Boostrap services here
 */

const cluster = require('cluster')
const cpus = require('os').cpus()

// libs
const chalk = require('chalk')
require('dotenv').config()

// utilities
require('./config/module-alias')(__dirname)

;(async () => {
  try {
    if (cluster.isMaster) {
      await require('@config/redis').start()
      await Promise.all([
        require('@bootstrap/env-check')(),
        require('@bootstrap/jobs')(),
        require('@bootstrap/listeners')()
      ])

      cpus.forEach(() => cluster.fork())

      const socketNetwork = chalk.cyan(`http://localhost:${process.env.SOCKET_PORT}`)
      console.log(`Socket running at: \t${socketNetwork}`)
    } else {
      await require('@config/redis').start()
      await Promise.all([
        require('@bootstrap/websocket')(),
        require('@bootstrap/http')()
      ])

      console.info(`App running on port ${process.env.APP_PORT} | WID ${process.pid}`)
    }
  } catch (error) {
    console.log(`[Application Error]: ${error}`)
    process.exit(1)
  }
})()
