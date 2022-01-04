// libs
const moment = require('moment')
const Promise = require('bluebird')

// nodejs core
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const readline = require('readline')

// utils
const logger = require('@utilities/logger')

// vars
const midnightTime = moment().endOf('day').format('HH:mm:ss')

const app = {
  async shred  () {
    try {
      const today = moment().format('YYYY.MM.DD')
      const logs = await fs.readdirAsync('logs')

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

        await this.deleteFileIfNotEmpty(`logs/${curr}`)
      })

      console.log('🔥 Burned empty logs')
    } catch (error) {
      logger.error(error)
      throw error
    }
  },

  deleteFileIfNotEmpty: filepath => {
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
  },

  async main () {
    try {
      await this.shred()
      setInterval(async () => {
        const currentTime = moment().format('HH:mm:ss')

        if (currentTime === midnightTime) {
          await this.shred()
        }
      }, 1000)
    } catch (error) {
      logger.error(error)
      throw error
    }
  }
}

app.main()