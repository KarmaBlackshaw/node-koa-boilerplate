const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const koaRouter = require('koa-router')
const router = koaRouter()

module.exports = async () => {
  const files = await fs.readdirAsync(`${__dirname}/handlers/`)

  for (let i = 0; i < files.length; i++) {
    try {
      router.use(require(`./handlers/${files[i]}`).routes())
    } catch (err) {
      throw new Error(err)
    }
  }

  return router
}
