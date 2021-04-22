const Socket = require('../socket')

class Sample extends Socket {
  constructor (io, name) {
    super(io, name)

    this.conn.on('connection', () => {})
  }
}

module.exports = (io, ns) => {
  return new Sample(io, ns)
}
