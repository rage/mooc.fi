import * as redis from "redis"
import * as winston from "winston"
import { promisify } from "util"

const REDIS_URL = process.env.REDIS_URL ?? "redis://127.0.0.1:7001"
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
const GENERATE_NEXUS = process.env.GENERATE_NEXUS

const redisClient = !GENERATE_NEXUS
  ? redis.createClient({
      url: REDIS_URL,
      password: REDIS_PASSWORD,
    })
  : null

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "redis" },
  transports: [new winston.transports.Console()],
})

redisClient?.on("error", (err: any) => {
  logger.error("Redis error: " + err)
})

export const getAsync = redisClient
  ? promisify(redisClient?.get).bind(redisClient)
  : async (_: any) => Promise.reject() // this doesn't actually get run ever, but

export async function redisify<T>(
  fn: ((...props: any[]) => Promise<T> | T) | Promise<T>,
  options: { prefix: string; expireTime: number; key: string; params?: any },
) {
  const { prefix, expireTime, key, params } = options

  if (!redisClient?.connected) {
    return fn instanceof Promise ? fn : fn(...params)
  }
  const prefixedKey = `${prefix}:${key}`

  return await getAsync(prefixedKey)
    .then(async (res: any) => {
      if (res) {
        logger.info("Cache hit")
        return await JSON.parse(res)
      }
      logger.info("Cache miss")

      const value = fn instanceof Promise ? await fn : await fn(...params)

      redisClient?.set(prefixedKey, JSON.stringify(value))
      redisClient?.expire(prefixedKey, expireTime)

      return value
    })
    .catch(() => (fn instanceof Promise ? fn : fn(...params)))
}

export const publisher = !GENERATE_NEXUS
  ? redis.createClient({
      url: REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    })
  : null

export const subscriber = !GENERATE_NEXUS
  ? redis.createClient({
      url: REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    })
  : null

export const invalidate = (prefix: string, key: string) => {
  if (!redisClient?.connected) {
    return
  }

  redisClient.del(`${prefix}:${key}`)
}

export default redisClient
