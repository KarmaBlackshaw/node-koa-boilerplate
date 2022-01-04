/**

USAGE:

const getKey = require('@helpers/get-key')

*/
const _isNil = require('lodash/isNil')

const getKey = (key, obj) => {
  return _isNil(obj[key]) ? obj.default : obj[key]
}

module.exports = getKey
