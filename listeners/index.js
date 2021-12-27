// libs
const Promise = require('bluebird')
const minimatch = require('minimatch')

const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

const exclude = [
  '_*',
  '.*'
]

module.exports = async () => {
  const files = await fs.readdirAsync(path.join(__dirname, 'items'))

  files.forEach(file => {
    try {
      const isExcluded = exclude.some(glob => !!minimatch(file, glob))

      if (isExcluded) {
        return
      }

      require(path.join(__dirname, 'items', file))()
    } catch (error) {
      throw new Error(`Error on file jobs/items/${file}`)
    }
  })
}
