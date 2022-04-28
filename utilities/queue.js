/**

USAGE:

const queue = new Queue({
  sleep: 0,
  concurrent: 1
})

queue.push(async () => {
  await sleep(1000)
  console.log('Hello')
})

queue.push(async () => {
  await sleep(1000)
  console.log('World')
})

queue.push(async () => {
  await sleep(1000)
  console.log('Of')
})

queue.push(async () => {
  await sleep(1000)
  console.log('Wonders')
})

*/

const Promise = require('bluebird')
const sleep = time => new Promise(resolve => setTimeout(resolve, time))

function Queue (conf = {}) {
  const config = {
    sleep: conf.sleep || 500,
    concurrent: conf.concurrent || 1
  }

  const list = []
  const status = {
    ongoing: false
  }

  const next = async () => {
    if (list.length) {
      try {
        status.ongoing = true

        const concurrentFns = list
          .splice(0, config.concurrent)
          .map(fn => fn())

        await Promise.all(concurrentFns)
      } catch (error) {
        status.ongoing = false
        throw error
      } finally {
        await sleep(config.sleep)
        next()
      }
    } else {
      status.ongoing = false
    }
  }

  this.push = function (item) {
    list.push(item)

    if (!status.ongoing) {
      next()
    }
  }

  return this
}

module.exports = Queue
