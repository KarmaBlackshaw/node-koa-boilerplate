const knex = require('knex')
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
  client: process.env.DB_CLIENT || 'mysql',

  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || '',
    port: process.env.DB_PORT || 3306,

    dateStrings: true
  }
})
