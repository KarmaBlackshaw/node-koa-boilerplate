/**

USAGE:

const btoa = require('@helpers/btoa')

*/

const btoa = str => {
  return Buffer.from(str).toString('base64')
}

module.exports = btoa
