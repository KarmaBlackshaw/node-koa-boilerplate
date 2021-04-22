const { verify } = require('../../../utilities/jwt')

module.exports = ({ except } = {}) => {
  return async (ctx, next) => {
    console.log(ctx._matchedRouteName)
    if (Array.isArray(except) && except.includes(ctx._matchedRouteName)) {
      ctx.user = {}
      return next()
    }

    const token = ctx.request.headers.authorization

    if (!token) {
      ctx.throw(401)
    }

    const splitToken = token.split(' ')
    if (!splitToken || splitToken.length !== 2) {
      ctx.throw(401)
    }

    const verification = await verify(splitToken[1], process.env.APP_KEY)

    ctx.user = verification

    return next()
  }
}
