/**
 * Boostrap services here
 */

module.exports = async () => {
  // register event system
  await require('./ws')()
  await require('./http')()
  // require('./tcp').start()
}
