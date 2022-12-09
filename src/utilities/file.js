// libs
const Promise = require('bluebird')
const _toLower = require('lodash/toLower')
const _defaults = require('lodash/defaults')

// node core
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

// utilities
const {
  makeUniq,
  removeDuplicateSlash,
  joinPaths
} = require('@utilities/string')

// config
const s3 = require('@config/s3')

const directoryExists = directory => {
  try {
    fs.accessSync(directory, fs.constants.F_OK)
    return true
  } catch (error) {
    return false
  }
}

const storeLocal = async (file, config = {}) => {
  try {
    const options = _defaults(config, {
      destination: process.env.STATIC_ASSET_PATH
    })

    const directory = removeDuplicateSlash(joinPaths(options.destination))

    if (!directoryExists(directory)) {
      await fs.mkdirAsync(directory, { recursive: true })
    }

    const extension = (() => {
      const ext = _toLower(path.extname(file.name))

      return ext === '.jpeg' ? '.jpg' : ext
    })()

    const name = _toLower(`${makeUniq()}${extension}`)

    const fileDirectory = removeDuplicateSlash(joinPaths(directory, name))

    await fs.copyFileAsync(file.path, fileDirectory)

    return name
  } catch (error) {
    console.log(error)
    throw error
  }
}

const storeBucket = async (file, config = {}) => {
  const options = _defaults({
    bucket_name: process.env.AWS_BUCKET_NAME
  }, config)

  const extension = (() => {
    const ext = _toLower(path.extname(file.name))

    return ext === '.jpeg' ? '.jpg' : ext
  })()

  const name = _toLower(`${makeUniq()}${extension}`)

  const params = {
    Bucket: options.bucket_name,
    Body: fs.createReadStream(file.path),
    Key: name,
    ACL: 'public-read'
  }

  await s3.upload(params, (err, data) => {
    console.log('S3 upload error')
    console.log(err, data)
  }).promise()

  return name
}

const store = (file, config = {}) => {
  return process.env.STORAGE_TYPE === 'local'
    ? storeLocal(file, config)
    : storeBucket(file, config)
}

module.exports = {
  removeDuplicateSlash,
  joinPaths,
  directoryExists,
  store
}