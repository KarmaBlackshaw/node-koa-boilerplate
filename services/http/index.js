const Koa = require('koa')
const app = new Koa()
const cors = require('@koa/cors')
const routes = require('./router')

// Custom Middlewares
const responseTime = require('@middleware/responseTime')
const koaParser = require('@middleware/koaParser')
const errorHandler = require('@middleware/errorHandler')

module.exports = async () => {
  const router = await routes()

  app.proxy = true

  app.use(cors())
  app.use(router.allowedMethods())

  app.use(koaParser())
  app.use(responseTime())
  app.use(errorHandler())

  app.use(router.routes())
  app.listen(process.env.PORT || '4000')

  return app
}
