
const Koa = require('koa')
const koaRouter = require('koa-router')
const cors = require('@koa/cors')
const morgan = require('koa-morgan')
const Promise = require('bluebird')
const glob = Promise.promisify(require('glob'))

// middlewares
const koaStatic = require('@middleware/koa-static')

async function getRoutes () {
  const router = koaRouter()
  const routePaths = await glob('src/resources/**/route.js', {
    cwd: process.cwd(),
    absolute: true
  })

  routePaths.forEach(routePath => {
    const route = require(routePath)({
      router: koaRouter()
    })

    router.use(route.routes())
  })

  return router
}

async function getMiddlewares () {
  const middlewares = await glob('src/middleware/app-*.js', {
    cwd: process.cwd(),
    absolute: true
  })

  return middlewares.map(path => require(path))
}

module.exports = async () => {
  const router = await getRoutes()
  const middlewares = await getMiddlewares()

  const app = new Koa()

  app.proxy = true

  /**
   * Middlewares
   */
  app.use(cors())
  app.use(morgan('dev'))
  app.use(router.allowedMethods())
  middlewares.forEach(middleware => app.use(middleware()))
  app.use(koaStatic('/public', '/storage/app/public'))

  /**
   * Routes
   */
  app.use(router.routes())

  app.listen(process.env.APP_PORT)

  return app
}
