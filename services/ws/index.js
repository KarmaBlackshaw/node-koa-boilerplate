// external libraries
const Promise = require('bluebird')
const socket = require('socket.io')

// nodejs libraries
const fs = Promise.promisifyAll(require('fs'))

const io = socket(process.env.SOCKET_PORT || 4001, { 'transports': ['websocket', 'polling'] })

// store
const { redis } = require('@store')

module.exports = async () => {
  try {
    const sub = redis.getNewSubscriber()
    const namespaces = {}
    const files = await fs.readdirAsync(`${__dirname}/namespaces/`)

    for (let i = 0; i < files.length; i++) {
      const curr = files[i]
      const namespace = curr.split('.')[0]

      namespaces[namespace] = require(`./namespaces/${curr}`)(io, namespace)
    }

    sub.psubscribe('socket:user_events:*')
    sub.on('pmessage', (pmessage, channel, message) => {
      const chan = channel.split(':')

      if (chan.length < 4) {
        return
      }

      if (chan[2] && namespaces[chan[2]]) {
        namespaces[chan[2]].emit(chan[3], message)
      }
    })
  } catch (err) {
    throw new Error(err)
  }
}
