/**

USAGE:

const parsify = require('@helpers/parsify')

*/
const _isObject = require('lodash/isObject')

const parsify = (payload, def) => {
  if (['null', 'undefined'].includes(String(payload))) {
    return def
  }

  if (_isObject(payload)) {
    return JSON.parse(JSON.stringify(payload))
  }

  try {
    return JSON.parse(payload)
  } catch (error) {
    if (def) {
      return def
    }

    throw error
  }
}

module.exports = parsify
