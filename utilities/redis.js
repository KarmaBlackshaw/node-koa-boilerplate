const redis = require('redis')
const bluebird = require('bluebird')

bluebird.promisifyAll(redis.RedisClient.prototype)

module.exports = {
  client: null,
  subscribers: [],
  publisher: null,

  connect () {
    this.client = this.getConnection()
    this.publisher = this.getConnection()
  },

  getNewSubscriber () {
    const newSubscriber = this.getConnection()

    this.subscribers.push(newSubscriber)

    return newSubscriber
  },

  getConnection (num) {
    return redis.createClient({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: process.env.REDIS_DB || num || 0
    })
  },

  emitSocketAdmin (namespace, event, data) {
    return this.publisher.publish(`socket:admin_events:${namespace}:${event}`, JSON.stringify(data))
  },

  emitSocketUser (namespace, event, data) {
    return this.publisher.publish(`socket:user_events:${namespace}:${event}`, JSON.stringify(data))
  }
}
