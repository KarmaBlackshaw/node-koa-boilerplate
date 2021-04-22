const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

module.exports = async () => {
  try {
    const files = await fs.readdirAsync(__dirname)
    const listeners = {}

    for (let i = 0; i < files.length; i++) {
      const curr = files[i]

      if (curr === 'index.js') continue

      listeners[curr.replace('-', '_')] = require(`./${curr}`)()
    }

    return listeners
  } catch (error) {
    throw new Error(error)
  }
}
