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
  require('@store').start()
  require('@bootstrap/jobs')()
  require('@bootstrap/listeners')()

  cpus.forEach(() => cluster.fork())

  const network = chalk.cyan(`http://localhost:${process.env.SOCKET_PORT}`)
  console.log(`Socket running at: \t${network}`)
} else {
  require('@store').start()
  require('@services')()
    .then(() => console.info(`App running on port ${process.env.APP_PORT || 4000} | WID ${process.pid}`))
    .catch(console.error)
}
