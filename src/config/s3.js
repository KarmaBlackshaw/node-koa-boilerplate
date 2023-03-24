const AWS = require('aws-sdk')

// constants
const env = require('@constants/env')

const S3 = new AWS.S3()

AWS.config.update({
  accessKeyId: env.AWS.ACCESS_KEY_ID,
  secretAccessKey: env.AWS.SECRET_KEY_ACCESS,
  region: env.AWS.REGION
})

module.exports = S3
