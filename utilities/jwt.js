const secret = 'lnu-archiving-system'
const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))

module.exports = {
  sign (payload) {
    return jwt.signAsync({ data: payload }, secret)
  },

  verify (token) {
    return jwt.verifyAsync(token, secret)
  }
}
