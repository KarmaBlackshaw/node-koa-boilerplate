class Socket {
  constructor (io, ns) {
    this.conn = io.of(`/${ns}`)
  }

  /**
   * [emit description]
   * @param  {[type]} event   [description]
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  emit (event, message) {
    this.conn.emit(event, message)
  }
}

module.exports = Socket
