const AWS = require('aws-sdk')

const S3 = new AWS.S3()

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY_ACCESS,
  region: process.env.AWS_REGION
})

S3.config.update({ credentials: AWS.config.credentials })

module.exports = S3
