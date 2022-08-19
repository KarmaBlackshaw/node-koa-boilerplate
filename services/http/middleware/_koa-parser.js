const bodyParser = require('koa-bodyparser')
const formidable = require('koa2-formidable')

module.exports = () => {
  return async (ctx, next) => {
    const contentType = ctx.request.header['content-type']
    const originHeader = ctx.request.header.origin
    const origin = String(originHeader).replace('http://', '').split(':')[0]

    if (!contentType && !origin) {
      ctx.request.header['content-type'] = 'application/json; charset=utf-8'
      ctx.request.header['content-encoding'] = 'gzip'
    }

    const req = ctx.is('application/json')
      ? bodyParser({
        enableTypes: ['json', 'text'],
        jsonLimit: '200mb',
        formLimit: '200mb',
        textLimit: '20mb'
      })
      : formidable({})

    try {
      await req(ctx, next)
    } catch (err) {
      throw err
    }
  }
}
