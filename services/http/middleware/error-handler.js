const logger = require('@config/logger')

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      logger.error(error)
      ctx.status = error.status || 500
      ctx.body = {
        name: error.name,
        message: error.message,
        params: error.params
      }
    }
  }
}
