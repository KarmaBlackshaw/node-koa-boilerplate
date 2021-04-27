const redis = require('../utilities/redis')
const { flatten } = require('../utilities/helpers')

module.exports = {
  knex: undefined,
  redis,
  /**
   * Kick start all connections
   *
   * @return {Void}
   */

  start () {
    // todo: transfer this to different file
    this.knex = require('knex')({
      client: process.env.DB_CLIENT || 'mysql',
      connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || '',
        port: process.env.DB_PORT || 3306,

        // timezone: '+00:00',
        dateStrings: true,
        typeCast (field, next) {
          try {
            if (field.type === 'BIT' && field.length === 1) {
              const bytes = field.buffer()
              return bytes ? (bytes[0] === 1) : null
            }

            return next()
          } catch (err) {
            console.log(err)
          }
        }
      }
    })

    redis.connect()
  },

  /**
   * Store cache
   *
   * @return {Promise}
   */
  async cache (key, params) {
    return this.redis.client.hmsetAsync(key, flatten(params))
  },

  /**
   * Finds stale cache with key if it does not exist then execute callback
   * and store result
   *
   * @return {Promise} stale Returns stale cache or fresh result
   */
  async read (key, callback) {
    let result = await this.redis.client.hgetallAsync(key)
    let cbResult = null

    if (!result) {
      cbResult = await callback()
    }

    if (cbResult) {
      this.cache(key, cbResult)
      result = cbResult
    }

    return result
  }
}
