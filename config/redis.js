const redis = require('redis')

module.exports = {
  publisher: null,

  async connect () {
    this.publisher = await this.createInstance()
  },

  async createInstance () {
    const client = redis.createClient({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: process.env.REDIS_DB || 0
    })

    await client.connect()

    client.on('error', e => console.log('Subscriber: ', e.stack))

    return client
  },

  emitSocketAdmin (namespace, event, data) {
    return this.publisher.publish(`socket:admin_events:${namespace}:${event}`, JSON.stringify(data))
  },

  emitSocketUser (namespace, event, data) {
    return this.publisher.publish(`socket:user_events:${namespace}:${event}`, JSON.stringify(data))
  }
}
