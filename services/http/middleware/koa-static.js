
const serve = require('koa-static')
const mount = require('koa-mount')

module.exports = () => {
  return mount('/public', serve('../public/storage/app/public'))
}
