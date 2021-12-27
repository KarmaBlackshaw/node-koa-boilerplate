const redis = require('@utilities/redis')
const knex = require('@utilities/knex')

module.exports = {
  knex: undefined,

  redis,

  start () {
    this.knex = knex.connect()

    redis.connect()
  }
}
