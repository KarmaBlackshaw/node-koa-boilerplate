/**
 * Application starting point
 * Boostrap services here
 */

const cluster = require('cluster')
const cpus = require('os').cpus()

// libs
const colors = require('colors')

// config
require('./config/module-alias')(__dirname)
const env = require('@config/env')

function startRedis () {
  return env.REDIS_ENABLED &&
    require('@config/redis').start()
}

function startSocket () {
  return env.SOCKET_ENABLED &&
    require('@bootstrap/websocket')()
}

;(async () => {
  try {
    await env.validate()
    await startRedis()

    if (cluster.isMaster) {
      await Promise.all([
        require('@bootstrap/jobs')(),
        require('@bootstrap/listeners')()
      ])

      Array.from({ length: env.CLUSTER_COUNT || cpus.length }, () => cluster.fork())

      const socketNetwork = colors.cyan(`http://localhost:${env.SOCKET_PORT}`)
      console.log(`Socket running at: \t${socketNetwork}`)
    } else {
      await Promise.all([
        startSocket(),
        require('@bootstrap/http')()
      ])

      console.info(`App running on port ${env.APP_PORT} | WID ${process.pid}`)
    }
  } catch (error) {
    console.log(`[Application Error]: ${error}`)
    process.exit(1)
  }
})()
