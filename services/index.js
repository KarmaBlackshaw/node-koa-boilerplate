/**
 * Boostrap services here
 */

module.exports = async () => {
  await require('./ws')()
  await require('./http')()
}
