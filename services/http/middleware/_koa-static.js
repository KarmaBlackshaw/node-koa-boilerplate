
const serve = require('koa-static')
const mount = require('koa-mount')

const path = require('path')

module.exports = () => {
  const publicPath = path.join(process.cwd(), 'storage', 'app', 'public')

  return mount('/public', serve(publicPath))
}
