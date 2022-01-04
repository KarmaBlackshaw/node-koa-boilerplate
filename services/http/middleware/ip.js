module.exports = () => {
  return async (ctx, next) => {
    ctx.request.ip = ctx.request.ip.replace(new RegExp(':f*', 'g'), '')
    return next()
  }
}
