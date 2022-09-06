const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))

// config
const env = require('@config/env')

function sign (payload, options = {}) {
  return jwt.signAsync({ data: payload }, env.JWT_SECRET_KEY, {
    expiresIn: env.JWT_EXPIRES_IN,
    ...options
  })
}

function verify (token) {
  return jwt.verifyAsync(token, env.JWT_SECRET_KEY)
}

module.exports = {
  sign,
  verify
}
