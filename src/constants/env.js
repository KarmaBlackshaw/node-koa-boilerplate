/* eslint-disable no-process-env */
require('dotenv').config()

const env = process.env

module.exports = {
  NODE_ENV: env.NODE_ENV,
  CLUSTER_COUNT: env.CLUSTER_COUNT,
  APP: {
    SECRET_KEY: env.APP_SECRET_KEY,
    PORT: env.APP_PORT
  },
  SOCKET: {
    PORT: env.SOCKET_PORT
  },
  DB: {
    HOST: env.DB_HOST,
    USER: env.DB_USER,
    PASS: env.DB_PASS,
    NAME: env.DB_NAME
  },
  REDIS: {
    HOST: env.REDIS_HOST,
    PORT: env.REDIS_PORT
  },
  AWS: {
    ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
    SECRET_KEY_ACCESS: env.AWS_SECRET_KEY_ACCESS,
    REGION: env.AWS_REGION,
    BUCKET: {
      NAME: env.AWS_BUCKET_NAME
    }
  },
  JWT: {
    EXPIRES_IN: env.JWT_EXPIRES_IN,
    SECRET_KEY: env.JWT_SECRET_KEY
  }
}
