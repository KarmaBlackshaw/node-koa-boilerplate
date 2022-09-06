function makeUniq () {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function removeDuplicateSlash (str) {
  return str.replace(/\/+/g, '/')
}

function joinPaths (...paths) {
  return paths.join('/')
}

module.exports = {
  makeUniq,
  joinPaths,
  removeDuplicateSlash
}
