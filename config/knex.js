const knex = require('knex')
const env = require('@config/env')
const knexMeta = require('@jeash/knex-meta')

const utils = [
  knexMeta.metaDate,
  knexMeta.metaFilter,
  knexMeta.metaPage,
  knexMeta.metaSort,
  knexMeta.meta,
  knexMeta.bulkUpdate,
  knexMeta.jsonObject,
  knexMeta.metaUpdate,
  knexMeta.metaInsert
]

utils.forEach(extension => {
  knex.QueryBuilder.extend(extension.name, extension)
})

module.exports = knex({
  client: env.DB_CLIENT || 'mysql',

  connection: {
    host: env.DB_HOST || '127.0.0.1',
    user: env.DB_USER || 'root',
    password: env.DB_PASS || '',
    database: env.DB_NAME || '',
    port: env.DB_PORT || 3306,

    dateStrings: true
  }
})
