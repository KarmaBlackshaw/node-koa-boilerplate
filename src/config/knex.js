const knexMeta = require('@jeash/knex-meta').default

const knex = knexMeta(require('knex'))

// constants
const env = require('@constants/env')

module.exports = knex({
  client: env.DB.CLIENT || 'mysql',

  connection: {
    host: env.DB.HOST || '127.0.0.1',
    user: env.DB.USER || 'root',
    password: env.DB.PASS || '',
    database: env.DB.NAME || '',
    port: env.DB.PORT || 3306,

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
