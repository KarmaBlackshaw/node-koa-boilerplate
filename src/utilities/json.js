function isValidJson (payload) {
  try {
    JSON.parse(payload)
    return true
  } catch (error) {
    return false
  }
}

module.exports = {
  isValidJson
}
