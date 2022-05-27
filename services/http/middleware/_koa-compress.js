
const compress = require('koa-compress')

module.exports = () => compress({
  filter: contentType => /text/i.test(contentType),
  threshold: 2048,
  gzip: {
    flush: require('zlib').constants.Z_SYNC_FLUSH
  },
  deflate: {
    flush: require('zlib').constants.Z_SYNC_FLUSH
  },
  br: false // disable brotli
})
