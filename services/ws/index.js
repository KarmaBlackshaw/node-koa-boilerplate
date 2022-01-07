// external libraries
const Promise = require('bluebird')
const { Server } = require('socket.io')
const minimatch = require('minimatch')
const _kebabCase = require('lodash/kebabCase')

// node core
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

// store
const store = require('@store')

const getNamespaces = async io => {
  const files = await fs.readdirAsync(path.join(__dirname, 'namespaces'))

  const exclude = ['_*', '.*']

  const namespaces = {}
  files.forEach(file => {
    const isExcluded = exclude.some(glob => !!minimatch(file, glob))

    if (isExcluded) {
      return
    }

    const namespace = _kebabCase(file.split('.')[0])

    const ioInstance = io.of(namespace)

    namespaces[namespace] = require(path.join(__dirname, 'namespaces', file))(ioInstance)
  })

  return namespaces
}

module.exports = async () => {
  try {
    const io = new Server({
      transports: ['websocket', 'polling'],
      rejectUnauthorized: false
    })

    const namespaces = await getNamespaces(io)

    const sub = store.redis.getNewSubscriber()
    sub.psubscribe('socket:user_events:*')
    sub.on('pmessage', (_, channel, message) => {
      const channelArray = channel.split(':')

      if (channelArray.length < 4) {
        return
      }

      const namespace = channelArray[2]
      const event = channelArray[3]

      if (namespaces[namespace]) {
        namespaces[namespace].emit(event, message)
      }
    })

    io.listen(process.env.SOCKET_PORT)
  } catch (err) {
    throw err
  }
}
