import * as redis from "redis"
import * as winston from "winston"
import { promisify } from "util"

const REDIS_URL = process.env.REDIS_URL ?? "redis://127.0.0.1:7001"
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
const NEXUS_REFLECTION = process.env.NEXUS_REFLECTION
const TEST = process.env.NODE_ENV === "test"

const redisClient =
  !NEXUS_REFLECTION && !TEST
    ? redis.createClient({
        url: REDIS_URL,
        password: REDIS_PASSWORD,
      })
    : undefined

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "redis" },
  transports: [new winston.transports.Console()],
})

redisClient?.on("ready", () => logger.info("Redis client connected"))
redisClient?.on("error", (err: any) => {
  logger.error("Redis error: " + err)
})

export const getAsync = redisClient
  ? promisify(redisClient?.get).bind(redisClient)
  : async (_: any) => Promise.reject() // this doesn't actually get run ever, but

export async function redisify<T>(
  fn: ((...props: any[]) => Promise<T> | T) | Promise<T>,
  options: {
    prefix: string
    expireTime: number
    key: string
    params?: any
  },
) {
  const { prefix, expireTime, key, params } = options

  if (!redisClient?.connected) {
    return fn instanceof Promise ? fn : params ? fn(...params) : fn()
  }
  const prefixedKey = `${prefix}:${key}`

  return await getAsync(prefixedKey)
    .then(async (res: any) => {
      if (res) {
        logger.info(`Cache hit: ${prefix}`)
        return await JSON.parse(res)
      }
      logger.info(`Cache miss: ${prefix}`)

      const value =
        fn instanceof Promise
          ? await fn
          : params
          ? await fn(...params)
          : await fn()

      redisClient?.set(prefixedKey, JSON.stringify(value))
      redisClient?.expire(prefixedKey, expireTime)

      return value
    })
    .catch(() => {
      return fn instanceof Promise ? fn : params ? fn(...params) : fn()
    })
}

export const publisher =
  !NEXUS_REFLECTION && !TEST
    ? redis.createClient({
        url: REDIS_URL,
        password: process.env.REDIS_PASSWORD,
      })
    : null

export const subscriber =
  !NEXUS_REFLECTION && !TEST
    ? redis.createClient({
        url: REDIS_URL,
        password: process.env.REDIS_PASSWORD,
      })
    : null

publisher?.on("error", (err: any) => {
  logger.error("Redis publisher error: " + err)
})

subscriber?.on("error", (err: any) => {
  logger.error("Redis subscriber error: " + err)
})

export const invalidate = (prefix: string | string[], key: string) => {
  if (!redisClient?.connected) {
    return
  }

  if (Array.isArray(prefix)) {
    prefix.forEach((p) => invalidate(p, key))
  } else {
    redisClient.del(`${prefix}:${key}`)
  }
}

export default redisClient
