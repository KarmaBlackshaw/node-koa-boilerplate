/**
 * Application starting point
 * Boostrap services here
 */

const cluster = require('cluster')

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

    if (cluster.isMaster) {
      await Promise.all([
        require('@bootstrap/jobs')(),
        require('@bootstrap/listeners')()
      ])

      Array.from({ length: env.CLUSTER_COUNT }, () => cluster.fork())
    } else {
      await Promise.all([
        require('@bootstrap/websocket')(),
        require('@bootstrap/http')()
      ])

      const socketNetwork = chalk.cyan(`http://localhost:${env.SOCKET_PORT}`)
      console.log(`Socket running at: \t${socketNetwork}`)
      console.log(`App running on port ${env.APP_PORT} | WID ${process.pid}`)
    }
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})()
