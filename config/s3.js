const env = require('@config/env')

const AWS = require('aws-sdk')

const S3 = new AWS.S3()

AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_KEY_ACCESS,
  region: env.AWS_REGION
})

S3.config.update({ credentials: AWS.config.credentials })

module.exports = S3
