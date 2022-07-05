
const Koa = require('koa')
const koaRouter = require('koa-router')
const cors = require('@koa/cors')
const Promise = require('bluebird')
const minimatch = require('minimatch')

const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

// instances
const app = new Koa()

// helpers
async function getRoutes () {
  const exclude = [
    '_*',
    '.*',
    'index.js'
  ]

  const router = koaRouter()

  const dir = [process.cwd(), 'services', 'http', 'handlers']
  const files = await fs.readdirAsync(path.join(...dir))

  files.forEach(file => {
    const isExcluded = exclude.some(glob => !!minimatch(file, glob))

    if (isExcluded) {
      return
    }

    try {
      const endpoint = require(path.join(...dir, file))({
        router: koaRouter()
      })

      router.use(endpoint.routes())
    } catch (err) {
      console.log(err)
      throw new Error(`Failed on http/handlers/${file}`)
    }
  })

  return router
}

async function getMiddlewares () {
  const dir = [process.cwd(), 'services', 'http', 'middleware']
  const files = await fs.readdirAsync(path.join(...dir))

  return files
    .filter(file => {
      return (/^_/).test(file)
    })
    .map(file => {
      return require(path.join(...dir, file))
    })
}

module.exports = async () => {
  const router = await getRoutes()
  const middlewares = await getMiddlewares()

  app.proxy = true

  app.use(cors())
  app.use(router.allowedMethods())

  middlewares.forEach(middleware => {
    app.use(middleware())
  })

  app.use(router.routes())

  app.listen(process.env.APP_PORT || '4000')

  return app
}
