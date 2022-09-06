const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcryptjs'))

function verify ({ password, hash }) {
  return bcrypt.compareAsync(password, hash)
}

async function hash (password, rounds = 2) {
  const salt = await bcrypt.genSaltAsync(rounds, 2)
  return bcrypt.hashAsync(password, salt)
}

module.exports = {
  verify,
  hash
}
