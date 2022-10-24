const net = require('net')

async function getFree () {
  return new Promise(resolve => {
    const srv = net.createServer()
    srv.listen(0, () => {
      const port = srv.address().port
      srv.close(() => resolve(port))
    })
  })
}

module.exports = {
  getFree
}
