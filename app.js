/**
 * Application starting point
 * Boostrap services here
 */

const cluster = require('cluster')
const cpus = require('os').cpus().length
require('dotenv').config()
require('module-alias/register')

if (cluster.isMaster) {
  require('./store').start()
  require('./jobs')()
  require('./listeners')()
  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }
} else {
  require('./store').start()
  require('./services')()
    .then(() => console.info(`Services loaded | Listening on port ${process.env.PORT || 4000} | ID ${process.pid}`))
    .catch(console.error)
}
