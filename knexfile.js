/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require('./src/config/module-alias')

const env = require('@constants/env')

module.exports = {
  client: 'mysql',
  connection: {
    host: env.DB.HOST,
    user: env.DB.USER,
    password: env.DB.PASS,
    database: env.DB.NAME,
    port: env.DB.PORT,

    dateStrings: true
  },
  migrations: {
    tableName: 'migrations',
    stub: 'src/database/stubs/table-foreign.js',
    directory: 'src/database/migrations'
  }
}
