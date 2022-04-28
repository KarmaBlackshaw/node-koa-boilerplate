// libs
const Promise = require('bluebird')
const minimatch = require('minimatch')

const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

const exclude = [
  '_*',
  '.*',
  '*.md'
]

module.exports = async () => {
  const files = await fs.readdirAsync(path.join(__dirname, '..', 'listeners'))

  files.forEach(file => {
    try {
      const isExcluded = exclude.some(glob => !!minimatch(file, glob))

      if (isExcluded) {
        return
      }

      require(path.join(__dirname, '..', 'listeners', file))()
    } catch (error) {
      console.log(error)
      throw new Error(`Error on file listeners/${file}`)
    }
  })
}
