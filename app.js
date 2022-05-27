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
      await require('@bootstrap/env-check')()
      await require('@config/redis').connect()
      await require('@bootstrap/jobs')()
      await require('@bootstrap/listeners')()

      cpus.forEach(() => cluster.fork())

      const socketNetwork = chalk.cyan(`http://localhost:${process.env.SOCKET_PORT}`)
      console.log(`Socket running at: \t${socketNetwork}`)
    } else {
      await require('@config/redis').connect()
      await require('@bootstrap/websocket')()
      await require('@bootstrap/http')()

      console.info(`App running on port ${process.env.APP_PORT} | WID ${process.pid}`)
    }
  } catch (error) {
    console.log(`[Application Error]: ${error}`)
    process.exit(1)
  }
})()
