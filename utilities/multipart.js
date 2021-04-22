const koaBody = require('koa-body')

module.exports = koaBody({
  multipart: true
})
