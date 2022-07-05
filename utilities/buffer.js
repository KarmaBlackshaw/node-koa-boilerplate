function toString (str) {
  return Buffer.from(str, 'base64').toString()
}

function toBase64 (str) {
  return Buffer.from(str).toString('base64')
}

module.exports = {
  toString,
  toBase64
}
