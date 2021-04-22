const router = require('koa-router')()

module.exports = router
  .prefix('/sample')

  .get('/', async (ctx, next) => {
    ctx.body = 'Hello World'
  })
