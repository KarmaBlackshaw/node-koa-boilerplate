function makeUniq () {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function removeDuplicateSlash (str) {
  return str.replace(/\/+/g, '/')
}

function joinPaths (...paths) {
  return paths.join('/')
}

function isValidJson (payload) {
  try {
    JSON.parse(payload)
    return true
  } catch (error) {
    return false
  }
}

function getKey (key, obj) {
  return Object.hasOwnProperty.call(obj, key) ? obj.default : obj[key]
}

module.exports = {
  makeUniq,
  joinPaths,
  removeDuplicateSlash,
  isValidJson,
  getKey
}
