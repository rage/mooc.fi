import * as redis from "redis"
import * as winston from "winston"
import { promisify } from "util"

const REDIS_URL = process.env.REDIS_URL ?? "redis://127.0.0.1:7001"
const REDIS_PASSWORD = process.env.REDIS_PASSWORD

const redisClient = redis.createClient({
  url: REDIS_URL,
  password: REDIS_PASSWORD,
})

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "redis" },
  transports: [new winston.transports.Console()],
})

redisClient.on("error", (err: any) => logger.error("Redis error: " + err))

export const getAsync = promisify(redisClient.get).bind(redisClient)

export async function redisify<T>(
  fn: ((...props: any[]) => Promise<T> | T) | Promise<T>,
  options: { prefix: string; expireTime: number; key: string; params?: any },
) {
  const { prefix, expireTime, key, params } = options

  if (!redisClient || (redisClient && !redisClient.connected)) {
    return fn instanceof Promise ? fn : fn(...params)
  }
  const prefixedKey = `${prefix}:${key}`

  return await getAsync(prefixedKey)
    .then(async res => {
      if (res) {
        return await JSON.parse(res)
      }

      const value = fn instanceof Promise ? await fn : await fn(...params)

      redisClient.set(prefixedKey, JSON.stringify(value))
      redisClient.expire(prefixedKey, expireTime)

      return value
    })
    .catch(() => (fn instanceof Promise ? fn : fn(...params)))
}

export const publisher = redis.createClient({
  url: REDIS_URL,
  password: process.env.REDIS_PASSWORD,
})

export const subscriber = redis.createClient({
  url: REDIS_URL,
  password: process.env.REDIS_PASSWORD,
})

export default redisClient
