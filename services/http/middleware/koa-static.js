
const serve = require('koa-static')
const mount = require('koa-mount')

const path = require('path')

module.exports = (endpoint, dir) => {
  const publicPath = path.join(process.cwd(), dir)

  return mount(endpoint, serve(publicPath))
}
