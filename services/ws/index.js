const io = require('socket.io')(process.env.SOCKET_PORT || 4001)
const redisAdapter = require('socket.io-redis')
const fs = require('fs')
const path = require('path')

io.adapter(redisAdapter({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined
}))

module.exports = async () => {
  return new Promise((resolve, reject) => {
    fs.readdir(`${__dirname}/namespaces`, (err, items) => {
      if (err) {
        reject(err)
      }

      try {
        for (let i = 0; i < items.length; i++) {
          if (items[i] === path.basename(__filename) ||
            path.extname(items[i]) !== '.js') {
            continue
          }

          require(`./namespaces/${items[i]}`)(io)
        }
      } catch (err) {
        reject(err)
      }
    })

    resolve(io)
  })
}
