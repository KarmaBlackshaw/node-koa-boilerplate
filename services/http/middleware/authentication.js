// utilities
const JWT = require('@utilities/jwt')

module.exports = ({ except } = {}) => {
  return async (ctx, next) => {
    if (Array.isArray(except) && except.includes(ctx._matchedRouteName)) {
      return next()
    }

    try {
      const bearerHeader = ctx.request.headers.authorization
      const token = String(bearerHeader).split(' ')[1]
      ctx.user = await JWT.verify(token)

      return next()
    } catch (error) {
      throw new Error(error)
    }
  }
}
