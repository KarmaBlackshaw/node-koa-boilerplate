const _size = require('lodash/size')
const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next()
      if (ctx.body) {
        const data = isObject(ctx.body) ? ctx.body : { data: ctx.body }
        ctx.body = { status: 'success', ...data }
      }
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
