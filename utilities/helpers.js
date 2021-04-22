
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const { v5: uuidv5 } = require('uuid')
const _last = require('lodash/last')

module.exports = {
  getKey: (key, obj) => obj[key] === undefined ? obj.default : obj[key],

  safeLower: str => String(str).toLowerCase(),

  toArray: item => Array.isArray(item) ? item : [item],

  isNil: x => ['null', null, 'undefined', undefined].includes(x),

  fileExtension: name => _last(name.split('.')),

  toDecimal: number => new Intl.NumberFormat('en-US', { style: 'decimal' }).format(number),

  async copyFile ({ file }) {
    try {
      const fileExtension = this.fileExtension(file.name)
      const hash = uuidv5(file.name + file.path, process.env.SECRET_KEY)
      const filename = `${hash}.${fileExtension}`

      await fs.copyFileAsync(file.path, `assets/uploads/${filename}`)

      return filename
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
}
