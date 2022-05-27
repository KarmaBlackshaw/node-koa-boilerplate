
const serve = require('koa-static')
const mount = require('koa-mount')

const path = require('path')

module.exports = root => {
  const publicPath = path.join(root, 'storage', 'app', 'public')
  return mount('/public', serve(publicPath))
}
