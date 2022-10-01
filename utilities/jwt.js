const Promise = require('bluebird')
const jwt = Promise.promisifyAll(require('jsonwebtoken'))

function sign (payload, _options) {
  const options = Object.assign({
    expiresIn: process.env.JWT_EXPIRES_IN
  }, _options)

  return jwt.signAsync(
    { data: payload },
    process.env.JWT_SECRET_KEY,
    options
  )
}

function verify (token) {
  return jwt.verifyAsync(token, process.env.JWT_SECRET_KEY)
}

module.exports = {
  sign,
  verify
}
