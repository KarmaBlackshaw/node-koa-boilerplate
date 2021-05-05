// libraries
const Promise = require('bluebird')
const _last = require('lodash/last')

// core modules
const fs = Promise.promisifyAll(require('fs'))
const { promisify } = require('util')
const path = require('path')
const copyFile = promisify(fs.copyFile)

const AWS = require('aws-sdk')
const S3 = new AWS.S3()

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY_ACCESS,
  region: process.env.AWS_REGION
})

S3.config.update({ credentials: AWS.config.credentials })

module.exports = {
  getKey: (key, obj) => obj[key] === undefined ? obj.default : obj[key],

  safeLower: str => String(str).toLowerCase(),

  toArray: item => Array.isArray(item) ? item : [item],

  isNil: x => ['null', null, 'undefined', undefined].includes(x),

  fileExtension: name => _last(name.split('.')),

  toDecimal: number => new Intl.NumberFormat('en-US', { style: 'decimal' }).format(number),

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
