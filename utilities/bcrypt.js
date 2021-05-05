const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcryptjs'))

module.exports = {
  verify: ({ password, hash }) => {
    return bcrypt.compareAsync(password, hash)
  },

  hash: async (password, rounds = 2) => {
    const salt = await bcrypt.genSaltAsync(rounds, 2)
    return bcrypt.hashAsync(password, salt)
  }
}
