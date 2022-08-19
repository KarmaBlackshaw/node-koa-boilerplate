const axios = require('axios')

const baseApi = (() => {
  const instance = axios.create()

  return instance
})()

module.exports = {
  baseApi
}
