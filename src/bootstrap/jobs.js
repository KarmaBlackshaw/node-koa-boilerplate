// libs
const Promise = require('bluebird')
const glob = Promise.promisify(require('glob'))

module.exports = async () => {
  const jobs = await glob('src/jobs/*.js', {
    cwd: process.cwd(),
    absolute: true
  })

  jobs.forEach(path => {
    try {
      require(path)
    } catch (error) {
      console.log(error)
      throw new Error(`Error on file ${path}`)
    }
  })
}
