/**

USAGE:

const pipe = require('@utilities/pipe')

*/

const pipe = (initial, fns) => {
  return fns.reduce((v, f) => f(v), initial)
}

module.exports = pipe
