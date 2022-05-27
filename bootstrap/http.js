
const Koa = require('koa')
const koaRouter = require('koa-router')
const cors = require('@koa/cors')
const Promise = require('bluebird')
const minimatch = require('minimatch')

// Custom Middlewares
const responseTime = require('@middleware/response-time')
const koaParser = require('@middleware/koa-parser')
const errorHandler = require('@middleware/error-handler')
const ip = require('@middleware/ip')
const compress = require('@middleware/compress')
const koaStatic = require('@middleware/koa-static')

const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

// constants
const ROOT = path.join(__dirname, '..')

// instances
const app = new Koa()

// helpers
async function routes () {
  const exclude = [
    '_*',
    '.*',
    'index.js'
  ]

  const router = koaRouter()

  const dir = [ROOT, 'services', 'http', 'handlers']
  const files = await fs.readdirAsync(path.join(...dir))

  files.forEach(file => {
    const isExcluded = exclude.some(glob => !!minimatch(file, glob))

    if (isExcluded) {
      return
    }

    try {
      router.use(require(path.join(...dir, file)).routes())
    } catch (err) {
      console.log(err)
      throw new Error(`Failed on http/handlers/${file}`)
    }
  })

  return router
}

module.exports = async () => {
  const router = await routes()

  app.proxy = true

  app.use(cors())
  app.use(router.allowedMethods())

  app.use(koaStatic(ROOT))
  app.use(koaParser())
  app.use(ip())
  app.use(compress())
  app.use(responseTime())
  app.use(errorHandler())

  app.use(router.routes())
  app.listen(process.env.APP_PORT || '4000')

  return app
}
