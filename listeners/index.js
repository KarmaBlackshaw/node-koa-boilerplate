const Promise = require('bluebird')

const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

module.exports = async () => {
  const files = await fs.readdirAsync(path.join(__dirname, 'items'))

  files.forEach(file => {
    try {
      require(path.join(__dirname, 'items', file))()
    } catch (error) {
      throw new Error(`Error on file listeners/items/${file}`)
    }
  })
}
