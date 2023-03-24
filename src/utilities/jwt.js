const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))

const env = require('@constants/env')

function sign (payload, _options) {
  const options = Object.assign({
    expiresIn: env.JWT.EXPIRES_IN
  }, _options)

  return jwt.signAsync(
    { data: payload },
    env.JWT.SECRET_KEY,
    options
  )
}

function verify (token) {
  return jwt.verifyAsync(token, env.JWT.SECRET_KEY)
}

module.exports = {
  sign,
  verify
}
