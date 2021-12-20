const _size = require('lodash/size')

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        status: 'error',
        name: error.name,
        message: error.message,
        ...(_size(error.params) && { params: error.params })
      }
    }
  }
}
