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
require('./utilities/module-alias')(__dirname)

if (cluster.isMaster) {
  require('@utilities/knex').connect()
  require('@utilities/redis').connect()
  require('@bootstrap/jobs')()
  require('@bootstrap/listeners')()

  cpus.forEach(() => cluster.fork())

  const socketNetwork = chalk.cyan(`http://localhost:${process.env.SOCKET_PORT}`)
  console.log(`Socket running at: \t${socketNetwork}`)
} else {
  require('@utilities/knex').connect()
  require('@utilities/redis').connect()
  require('@bootstrap/websocket')()
  require('@bootstrap/http')()
    .then(() => console.info(`App running on port ${process.env.APP_PORT || 4000} | WID ${process.pid}`))
    .catch(console.error)
}
