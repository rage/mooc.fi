import * as redis from 'redis'
import * as winston from 'winston'
import { promisify } from 'util'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'redis' },
  transports: [new winston.transports.Console()],
})

export const getAsync = (redisClient: redis.RedisClient) =>
  redisClient
    ? promisify(redisClient?.get).bind(redisClient)
    : async (_: any) => Promise.reject() // this doesn't actually get run ever, but

export async function redisify<T>(
  fn: ((...props: any[]) => Promise<T> | T) | Promise<T>,
  options: {
    prefix: string
    expireTime: number
    key: string
    params?: any
    redisClient?: redis.RedisClient
  }
) {
  const { prefix, expireTime, key, params, redisClient } = options

  if (!redisClient?.connected) {
    return fn instanceof Promise ? fn : fn(...params)
  }
  const prefixedKey = `${prefix}:${key}`

  return await getAsync(redisClient)(prefixedKey)
    .then(async (res: any) => {
      if (res) {
        logger.info('Cache hit')
        return await JSON.parse(res)
      }
      logger.info('Cache miss')

      const value = fn instanceof Promise ? await fn : await fn(...params)

      redisClient?.set(prefixedKey, JSON.stringify(value))
      redisClient?.expire(prefixedKey, expireTime)

      return value
    })
    .catch(() => (fn instanceof Promise ? fn : fn(...params)))
}
