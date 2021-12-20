// libs
const Promise = require('bluebird')
const koaRouter = require('koa-router')

// node core
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

// instances
const router = koaRouter()

module.exports = async () => {
  const files = await fs.readdirAsync(path.join(__dirname, 'handlers'))

  files.forEach(file => {
    try {
      router.use(require(`./handlers/${file}`).routes())
    } catch (err) {
      console.log(err)
      throw new Error(`Error on http/handlers/${file}`)
    }
  })

  return router
}
