const router = require('koa-router')()
const sample = require('@store/sample')

module.exports = router
  .prefix('/sample')

  .get('/', async (ctx, next) => {
    ctx.body = await sample.index(ctx.request.query)
  })
