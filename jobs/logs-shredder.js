// libs
const moment = require('moment')
const Promise = require('bluebird')

// nodejs core
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const readline = require('readline')

// utils
const logger = require('@config/logger')

// vars
const midnightTime = moment().endOf('day').format('HH:mm:ss')

async function shred () {
  try {
    const today = moment().format('YYYY.MM.DD')
    const logs = await fs.readdirAsync('./storage/logs')

    logs.forEach(async curr => {
      const ext = path.extname(curr)

      /**
         * Exclude non-log files
         */
      if (ext !== '.log') {
        return
      }

      /**
         * Skip logs for today
         */
      if (curr.includes(today)) {
        return
      }

      await deleteFileIfNotEmpty(`./storage/logs/${curr}`)
    })

    console.log('🔥 Burned empty logs')
  } catch (error) {
    logger.error(error)
    throw error
  }
}

function deleteFileIfNotEmpty (filepath) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filepath),
    crlfDelay: Infinity
  })

  let hasLength = 0

  rl.on('line', line => {
    if (line.length && !hasLength) {
      hasLength = 1
      rl.close()
    }
  })

  rl.on('close', async () => {
    try {
      if (!hasLength) {
        await fs.unlinkAsync(filepath)
      }
    } catch (error) {
      logger.error(error)
      throw error
    }
  })
}

async function main () {
  try {
    await shred()

    setInterval(async () => {
      const currentTime = moment().format('HH:mm:ss')

      if (currentTime === midnightTime) {
        await shred()
      }
    }, 1000)
  } catch (error) {
    logger.error(error)
    throw error
  }
}

main()
