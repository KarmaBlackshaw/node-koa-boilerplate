const Joi = require('joi')
require('dotenv').config()
const { v4: uuidv4 } = require('uuid')

const env = {}

const schema = Joi
  .object({
    /**
     * Database schema
     */
    DB_HOST: Joi.string()
      .required()
      .default('localhost'),
    DB_USER: Joi.string()
      .required()
      .default('root'),
    DB_PASS: Joi.string()
      .optional()
      .allow(''),
    DB_NAME: Joi.string()
      .required(),

    /**
     * Node environment
     */
    NODE_ENV: Joi.string()
      .optional()
      .default('development'),

    APP_SECRET_KEY: Joi.string()
      .guid()
      .required()
      .default(uuidv4()),
    APP_PORT: Joi.number()
      .required(),

    SOCKET_PORT: Joi.number()
      .required(),

    STATIC_ASSET_PATH: Joi.string()
      .required()
      .default('/storage/app'),

    /**
     * Redis config
     */
    REDIS_HOST: Joi.string()
      .optional()
      .allow('')
      .default('localhost'),
    REDIS_PORT: Joi.number()
      .optional()
      .allow('')
      .default(6379),

    /**
     * AWS config
     */
    AWS_ACCESS_KEY_ID: Joi.string()
      .optional()
      .allow(''),
    AWS_SECRET_KEY_ACCESS: Joi.string()
      .optional()
      .allow(''),
    AWS_REGION: Joi.string()
      .optional()
      .allow(''),
    AWS_BUCKET_NAME: Joi.string()
      .optional()
      .allow(''),

    JWT_EXPIRES_IN: Joi.string()
      .optional()
      .allow(''),
    JWT_SECRET_KEY: Joi.string()
      .required()
      .default(uuidv4()),

    CLUSTER_COUNT: Joi.number()
      .optional()
      .allow('')
      .default(1),

    STORAGE_TYPE: Joi.string()
      .optional()
      .default('local')
  })
  .options({ allowUnknown: true })

Object.defineProperty(env, 'validate', {
  async value () {
    try {
      // eslint-disable-next-line no-process-env
      const data = await schema.validateAsync(process.env)

      for (const key in data) {
        Object.defineProperty(env, key, {
          value: data[key],
          writable: false,
          enumerable: true,
          configurable: false
        })
      }

      return data
    } catch (error) {
      console.log(`[Env Validation]: ${error.message}`)
      throw error.message
    }
  },
  writable: false,
  configurable: false,
  enumerable: false
})

Object.defineProperty(env, 'schema', {
  get: () => schema.describe().keys,
  configurable: false,
  enumerable: false
})

module.exports = env
