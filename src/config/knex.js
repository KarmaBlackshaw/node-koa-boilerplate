const knexMeta = require('@jeash/knex-meta').default

const knex = knexMeta(require('knex'))

module.exports = knex({
  client: process.env.DB_CLIENT || 'mysql',

  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || '',
    port: process.env.DB_PORT || 3306,

    dateStrings: true,

    typeCast (field, next) {
      try {
        if (field.type === 'JSON') {
          const string = field.string()

          return string && JSON.parse(string)
        }

        return next()
      } catch (err) {
        console.log(err)
      }
    }
  }
})
