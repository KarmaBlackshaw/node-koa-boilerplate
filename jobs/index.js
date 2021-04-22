const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

module.exports = async () => {
  const files = await fs.readdirAsync(`${__dirname}/tasks`)

  try {
    for (let i = 0; i < files.length; i++) {
      require(`./tasks/${files[i]}`)
    }
  } catch (error) {
    throw new Error(error)
  }
}
