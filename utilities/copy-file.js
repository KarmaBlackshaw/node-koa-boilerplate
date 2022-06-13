/**

USAGE:

const copyFile = require('@copy-file')

*/

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = Promise.promisifyAll(require('path'))

// config
const env = require('@config/env')

// libs
const AWS = require('aws-sdk')

const S3 = new AWS.S3()

AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_KEY_ACCESS,
  region: env.AWS_REGION
})

S3.config.update({ credentials: AWS.config.credentials })

const copyFile = async (file, basePath, name = '') => {
  let params
  let dest
  let image
  let exPath = path.extname(file.name).toLowerCase()

  if (exPath === '.jpeg') {
    exPath = '.jpg'
  }

  if (env.NODE_ENV === 'development') {
    dest = env.STATIC_ASSET_PATH
    name = name || Math.floor((new Date()).getTime() / 1000)
    name += exPath

    await fs.copyFileAsync(file.path, path.join(dest, basePath, name))
    return path.join(basePath, name)
  } else {
    name = name || Math.floor((new Date()).getTime() / 1000)
    name += exPath
    basePath = basePath.split('/')[1]
    image = `${basePath}/${name}`
    name = name.toLowerCase()

    params = {
      Bucket: env.AWS_BUCKET_NAME,
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

module.exports = copyFile
