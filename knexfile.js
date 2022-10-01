/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require('dotenv').config()

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || '',
      port: process.env.DB_PORT || 3306,

      dateStrings: true
    },
    migrations: {
      tableName: 'migrations',
      stub: 'database/stubs/table-foreign.js',
      directory: 'database/migrations'
    }
  }
}
