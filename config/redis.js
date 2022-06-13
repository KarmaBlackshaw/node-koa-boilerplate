const redis = require('redis')
const env = require('@config/env')

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
      url: `redis://@${env.REDIS_HOST}:${env.REDIS_PORT}`
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
