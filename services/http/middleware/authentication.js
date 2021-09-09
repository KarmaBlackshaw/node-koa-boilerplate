/**

const authentication = require('@middleware/authentication')

.use(authentication())

 */

const JWT = require('@utilities/jwt')

module.exports = () => {
  return async (ctx, next) => {
    if (ctx._matchedRouteName === 'unauth') {
      return next()
    }

    try {
      const bearerHeader = ctx.request.headers.authorization
      const token = String(bearerHeader).split(' ')[1]
      const verifiedToken = await JWT.verify(token)

      ctx.user = verifiedToken.data || verifiedToken
      return next()
    } catch (error) {
      ctx.throw(401)
    }
  }
}
