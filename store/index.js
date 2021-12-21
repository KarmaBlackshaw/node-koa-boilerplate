const redis = require('@utilities/redis')
const knex = require('@utilities/knex')
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
    this.knex = knex.connect()

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
