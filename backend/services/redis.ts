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

const _logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "redis" },
  transports: [new winston.transports.Console()],
})

// @ts-ignore: not used for now
let connected = false

redisClient?.on("error", (err: any) => {
  _logger.error("Redis error: " + err)
})
redisClient?.on("ready", () => {
  _logger.info("Redis connected")
  connected = true
})
redisClient?.connect()

const isPromise = <T>(value: any): value is Promise<T> => {
  return value && typeof value.then === "function"
}
const isAsync = <T>(
  fn: (...props: any[]) => Promise<T> | T,
): fn is (...props: any[]) => Promise<T> => {
  return (
    fn && typeof fn === "function" && fn.constructor.name === "AsyncFunction"
  )
}

export async function redisify<T>(
  fn: ((...props: any[]) => Promise<T> | T) | Promise<T>,
  options: {
    prefix: string
    expireTime: number
    key: string
    params?: any
  },
  client: typeof redisClient = redisClient,
  logger: winston.Logger = _logger,
) {
  const { prefix, expireTime, key, params } = options

  const resolveValue = async () =>
    isPromise(fn)
      ? await fn
      : isAsync(fn)
      ? params
        ? await fn(...params)
        : await fn()
      : params
      ? fn(...params)
      : fn()

  if (params && isPromise(fn)) {
    logger.warn(`Prefix ${prefix}: params ignored with a promise`)
  }

  if (!client) {
    return await resolveValue()
  }

  const prefixedKey = `${prefix}:${key}`
  let value: T | undefined
  let resolveSuccess = false

  try {
    const res = await client?.get(prefixedKey)

    if (res) {
      logger.info(`Cache hit: ${prefix}`)
      return JSON.parse(res)
    }
    logger.info(`Cache miss: ${prefix}`)

    value = await resolveValue()
    resolveSuccess = true

    await client?.set(prefixedKey, JSON.stringify(value), {
      EX: expireTime,
    })

    return value
  } catch (e1) {
    try {
      if (!resolveSuccess) {
        return await resolveValue()
      }
      return value
    } catch (e2) {
      logger.error(
        `Could not resolve value for ${prefixedKey}; error: `,
        e2 instanceof Error ? e2.message : e2,
      )
    }
  }
}

export const invalidate = async (prefix: string | string[], key: string) => {
  if (Array.isArray(prefix)) {
    for (const p of prefix) {
      await invalidate(p, key)
    }
    return
  }

  await redisClient?.del(`${prefix}:${key}`)
}

export default redisClient
