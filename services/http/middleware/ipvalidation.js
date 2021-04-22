const login = require('../../../store/login')

/**
 * Verify ip, via header, body or query param
 *
 * @param  {Object}   ctx  context object from koa
 * @param  {Function} next next middleware
 * @return {Promise}
 */

module.exports = () => {
  return async (ctx, next) => {
    const ip = ctx.request.ip.replace(/^.*:/, '')

    const test = await login.isBlockedIp(ip)

    if (test.length) {
      ctx.throw(418)
    }

    return next()
  }
}
