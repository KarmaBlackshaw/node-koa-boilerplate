
const Koa = require('koa')
const koaRouter = require('koa-router')
const cors = require('@koa/cors')
const morgan = require('koa-morgan')
const Promise = require('bluebird')
const glob = Promise.promisify(require('glob'))

const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

// middlewares
const koaStatic = require('@middleware/koa-static')

// instances
const app = new Koa()

async function getRoutes () {
  const router = koaRouter()
  const routePaths = await glob('src/modules/**/route.js', {
    cwd: process.cwd(),
    absolute: true
  })

  routePaths.forEach(routePath => {
    const route = require(routePath)({
      router: koaRouter()
    })

    console.log(route)

    router.use(route.routes())
  })

  return router
}

async function getMiddlewares () {
  const dir = [process.cwd(), '/src/middleware']
  const files = await fs.readdirAsync(path.join(...dir))

  return files
    .filter(file => {
      return (/^app-/).test(file)
    })
    .map(file => {
      return require(path.join(...dir, file))
    })
}

module.exports = async () => {
  const router = await getRoutes()
  const middlewares = await getMiddlewares()

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
