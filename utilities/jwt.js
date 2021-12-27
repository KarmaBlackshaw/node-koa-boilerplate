const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))

const SECRET = process.env.APP_KEY

module.exports = {
  sign (payload, options = {}) {
    return jwt.signAsync({ data: payload }, SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      ...options
    })
  },

  verify (token) {
    return jwt.verifyAsync(token, SECRET)
  }
}
