// libs
const Promise = require('bluebird')
const koaRouter = require('koa-router')
const minimatch = require('minimatch')

// node core
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

// instances
const router = koaRouter()

const exclude = [
  '_*',
  '.*'
]

module.exports = async () => {
  const files = await fs.readdirAsync(path.join(__dirname, 'handlers'))

  files.forEach(file => {
    const isExcluded = exclude.some(glob => !!minimatch(file, glob))

    if (isExcluded) {
      return
    }

    try {
      router.use(require(`./handlers/${file}`).routes())
    } catch (err) {
      console.log(err)
      throw new Error(`Error on http/handlers/${file}`)
    }
  })

  return router
}
