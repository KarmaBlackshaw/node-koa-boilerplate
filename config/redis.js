const redis = require('redis')

module.exports = {
  client: null,
  publisher: null,
  subscriber: null,

  async start () {
    this.client = await this.connect()

    this.publisher = await this.duplicate()
    this.subscriber = await this.duplicate()
  },

  async duplicate () {
    const client = this.client.duplicate()

    await client.connect()

    return client
  },

  async connect () {
    if (this.client) {
      console.log('A client is already registered. Use `duplicate` instead')
      return this.client
    }

    const client = redis.createClient({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: process.env.REDIS_DB || 0
    })

    await client.connect()

    client.on('error', e => console.log('Redis instance: ', e.stack))

    return client
  },

  emitSocketAdmin (namespace, event, data) {
    return this.publisher.publish(
      `socket:admin_events:${namespace}:${event}`,
      JSON.stringify(data)
    )
  },

  emitSocketUser (namespace, event, data) {
    return this.publisher.publish(
      `socket:user_events:${namespace}:${event}`,
      JSON.stringify(data)
    )
  }
}
