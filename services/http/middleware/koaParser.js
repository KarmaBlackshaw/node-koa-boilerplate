
const bodyParser = require('koa-bodyparser')
const formidable = require('koa2-formidable')

module.exports = () => {
  return async (ctx, next) => {
    const cType = ctx.request.header['content-type']
    let origin = ctx.request.header.origin ? ctx.request.header.origin : ''
    if (origin) {
      origin = origin.replace('http://', '').split(':')[0]
    }

    if (!cType && (!origin || process.env.HOST_ORIGIN.indexOf(origin) === -1)) {
      ctx.request.header['content-type'] = 'application/json; charset=utf-8'
      ctx.request.header['content-encoding'] = 'gzip'
    }

    const req = ctx.is('application/json')
      ? bodyParser({ enableTypes: ['json', 'text'], jsonLimit: '200mb', formLimit: '200mmb', textLimit: '20mb' })
      : formidable({})

    try {
      await req(ctx, next)
    } catch (err) {
      console.log(err)
    }
  }
}
