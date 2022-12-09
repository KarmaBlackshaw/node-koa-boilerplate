const logger = require('@config/logger')()

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      console.log(error.stack)

      logger.error(error)

      ctx.status = error.status || 500
      ctx.body = {
        status: ctx.status,
        name: error.name,
        msg: error.message,
        errors: error.body
      }
    }
  }
}
