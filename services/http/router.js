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

  for (let i = 0; i < files.length; i++) {
    const curr = files[i]
    try {
      router.use(require(`./handlers/${files[i]}`).routes())
    } catch (err) {
      throw new Error(`Error on file ${curr}`)
    }
  }

  return router
}
