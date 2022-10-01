const redis = require('redis')

class Redis {
  constructor () {
    this.client = null
    this.publisher = null
    this.subscriber = null
  }

  async start () {
    this.client = await this.connect()
    this.publisher = await this.duplicate()
  }

  async connect () {
    if (this.client) {
      console.log('A client is already registered. Use `duplicate` instead')
      return this.client
    }

    const instance = redis.createClient({
      url: `redis://@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })

    await instance.connect()

    instance.on('error', e => console.log('Redis instance: ', e.stack))

    return instance
  }

  async subscribe (url, handler) {
    const sub = await this.duplicate()

    sub.subscribe(url, handler)
  }

  async duplicate () {
    const instance = this.client.duplicate()

    await instance.connect()

    return instance
  }

  emit (namespace, event, data) {
    return this.publisher.publish(
      `${namespace}:${event}`,
      JSON.stringify(data)
    )
  }
}

module.exports = new Redis()
