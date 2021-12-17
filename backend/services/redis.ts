import * as redis from "redis"
import * as winston from "winston"

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

let connected = false

redisClient?.on("error", (err: any) => {
  logger.error("Redis error: " + err)
})
redisClient?.on("ready", () => {
  logger.info("Redis connected")
  connected = true
})
redisClient?.connect()

const isPromise = <T>(value: any): value is Promise<T> => {
  return value && typeof value.then === "function"
}
export async function redisify<T>(
  fn: ((...props: any[]) => Promise<T> | T) | Promise<T>,
  options: {
    prefix: string
    expireTime: number
    key: string
    params?: any
  },
) {
  const resolveValue = async () =>
    isPromise(fn) ? await fn : params ? fn(...params) : fn()

  const { prefix, expireTime, key, params } = options

  if (!connected) {
    return resolveValue()
  }

  const prefixedKey = `${prefix}:${key}`
  try {
    const res = await redisClient?.get(prefixedKey)

    if (res) {
      logger.info(`Cache hit: ${prefix}`)
      return JSON.parse(res)
    }
    logger.info(`Cache miss: ${prefix}`)

    const value = await resolveValue()

    redisClient?.set(prefixedKey, JSON.stringify(value), {
      EX: expireTime,
    })

    return value
  } catch {
    return resolveValue()
  }
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

export const invalidate = async (prefix: string, key: string) => {
  redisClient?.del(`${prefix}:${key}`)
}

publisher?.connect()
subscriber?.connect()

export default redisClient
