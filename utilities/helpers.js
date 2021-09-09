// core modules
const path = require('path')

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const { promisify } = require('util')
const copyFile = promisify(fs.copyFile)

const AWS = require('aws-sdk')
const S3 = new AWS.S3()

// libraries
const _last = require('lodash/last')
const _toLower = require('lodash/toLower')
const _isNil = require('lodash/isNil')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY_ACCESS,
  region: process.env.AWS_REGION
})

S3.config.update({ credentials: AWS.config.credentials })

const toArray = item => Array.isArray(item) ? item : [item]
const toArrayCustom = x => _isNil(x) ? [] : toArray(x)

module.exports = {
  toArray,

  arrayParamsWrapper: (query, key) => toArrayCustom(query[`${key}[]`] || query[key]).map(_toLower),

  getKey: (key, obj) => obj[key] === undefined ? obj.default : obj[key],

  safeLower: str => String(str).toLowerCase(),

  isNil: x => ['null', null, 'undefined', undefined].includes(x),

  fileExtension: name => _last(name.split('.')),

  toDecimal: number => new Intl.NumberFormat('en-US', { style: 'decimal' }).format(number),

  btoa: str => Buffer.from(str).toString('base64'),

  atob: base64 => Buffer.from(base64, 'base64').toString(),

  isPOJO: obj => Object.prototype.toString.call(obj) === '[object Object]',

  parseDate: date => {
    date = date ? date.replace(/-/g, '/') : date

    return new Date(date)
  },

  parsify (str, def, showError = true) {
    if ([null, undefined, 'null', 'undefined'].includes(str)) {
      return def
    }

    const constructorName = str.constructor.name
    if (constructorName === 'Array' || constructorName === 'Object') {
      return JSON.parse(JSON.stringify(str))
    }

    try {
      return JSON.parse(str)
    } catch (error) {
      showError && console.log(new Error(`Invalid JSON Format. Received ${str}`).stack)
      return def
    }
  },

  async copyFile (file, basePath, name = '') {
    let params
    let dest
    let image
    let exPath = path.extname(file.name).toLowerCase()

    if (exPath === '.jpeg') {
      exPath = '.jpg'
    }

    if (process.env.NODE_ENV === 'development') {
      dest = process.env.STATIC_ASSET_PATH
      name = name || Math.floor((new Date()).getTime() / 1000)
      name += exPath

      await copyFile(file.path, path.join(dest, basePath, name))
      return path.join(basePath, name)
    } else {
      name = name || Math.floor((new Date()).getTime() / 1000)
      name += exPath
      basePath = basePath.split('/')[1]
      image = `${basePath}/${name}`
      name = name.toLowerCase()

      params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fs.createReadStream(file.path),
        Key: image,
        ACL: 'public-read'
      }

      await S3.upload(params, (err, data) => {
        console.log('S3 upload error')
        console.log(err, data)
      }).promise()

      return `/${image}`
    }
  }
}
