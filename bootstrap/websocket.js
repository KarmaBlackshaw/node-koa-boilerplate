// libs
const Promise = require('bluebird')
const { Server } = require('socket.io')
const minimatch = require('minimatch')
const _kebabCase = require('lodash/kebabCase')

const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

const redis = require('@config/redis')
const env = require('@config/env')

const getNamespaces = async io => {
  const dir = [__dirname, '..', 'services', 'ws']

  const files = await fs.readdirAsync(path.join(...dir))

  const exclude = ['_*', '.*', '*.md']

  const namespaces = {}
  files.forEach(file => {
    const isExcluded = exclude.some(glob => !!minimatch(file, glob))

    if (isExcluded) {
      return
    }

    const namespace = _kebabCase(file.split('.')[0])

    const ioInstance = io.of(namespace)

    namespaces[namespace] = require(path.join(...dir, file))(ioInstance)
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

    const sub = await redis.duplicate()

    sub.pSubscribe('socket:user_events:*', (message, channel) => {
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

    io.listen(env.SOCKET_PORT)
  } catch (err) {
    console.log(err)
    throw err
  }
}
