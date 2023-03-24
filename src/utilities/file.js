// libs
const Promise = require('bluebird')
const _ = require('lodash')

// node core
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

// utilities
const {
  makeUniq,
  removeDuplicateSlash,
  joinPaths
} = require('@utilities/helpers')

// config
const s3 = require('@config/s3')

// constants
const env = require('@constants/env')

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
    const options = _.defaults(config, {
      destination: env.STATIC_ASSET_PATH
    })

    const directory = removeDuplicateSlash(joinPaths(options.destination))

    if (!directoryExists(directory)) {
      await fs.mkdirAsync(directory, { recursive: true })
    }

    const extension = _.toLower(path.extname(file.name))

    const name = _.toLower(`${makeUniq()}${extension}`)

    const fileDirectory = removeDuplicateSlash(joinPaths(directory, name))

    await fs.copyFileAsync(file.path, fileDirectory)

    return name
  } catch (error) {
    console.log(error)
    throw error
  }
}

const storeBucket = async (file, config = {}) => {
  const options = _.defaults({
    bucket_name: env.AWS.BUCKET_NAME
  }, config)

  const extension = _.toLower(path.extname(file.name))

  const name = _.toLower(`${makeUniq()}${extension}`)

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
  return env.STORAGE_TYPE === 'local'
    ? storeLocal(file, config)
    : storeBucket(file, config)
}

module.exports = {
  removeDuplicateSlash,
  joinPaths,
  directoryExists,
  store
}
