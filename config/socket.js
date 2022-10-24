// libs
const { Server } = require('socket.io')
const _capitalize = require('lodash/capitalize')

// config
const redis = require('@config/redis')

class Socket {
  constructor () {
    this.client = null
  }

  get namespaces () {
    return new Set([
      'badugi'
    ])
  }

  async start () {
    this.client = new Server(process.env.SOCKET_PORT, {
      transports: ['websocket', 'polling'],
      rejectUnauthorized: false
    })

    this.namespaces.forEach(namespace => {
      this[`ns${_capitalize(namespace)}`] = this.client.of(namespace)
    })

    await this.listenToRedis()
  }

  async listenToRedis () {
    const sub = await redis.duplicate()

    sub.pSubscribe('socket:*', (message, channel) => {
      const channelArray = channel.split(':')

      if (channelArray.length < 3) {
        return
      }

      const namespace = channelArray[1]
      const event = channelArray[2]

      if (this.namespaces.has(namespace)) {
        this[`ns${_capitalize(namespace)}`].emit(event, message)
      }
    })
  }
}

module.exports = new Socket()
