const _isNil = require('lodash/isNil')

function getKey (key, obj) {
  return _isNil(obj[key]) ? obj.default : obj[key]
}

module.exports = {
  getKey
}
