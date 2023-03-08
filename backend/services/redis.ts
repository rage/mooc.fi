import * as redis from "redis"
import * as winston from "winston"

import { isTest, NEXUS_REFLECTION, REDIS_PASSWORD, REDIS_URL } from "../config"
import { BaseContext } from "../context"
import { isNullOrUndefined } from "../util/isNullOrUndefined"

const _logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "redis" },
  transports: [new winston.transports.Console()],
})

let redisClient: ReturnType<typeof redis.createClient> | undefined

export const redisReconnectStrategy =
  (redisName = "Redis", logger: winston.Logger = _logger) =>
  (retriesOrError: number | Error) => {
    if (retriesOrError instanceof Error) {
      logger.error(`${redisName} reconnection failed`, retriesOrError)
      process.exit(-1)
    }
    const retries = retriesOrError
    const nextDelay = Math.min(2 ** retries * 20, 30000)
    logger.info(
      `${redisName} connection attempt: ${retries}, next attempt in: ${nextDelay}ms`,
    )
    return nextDelay
  }

const getRedisClient = (): typeof redisClient => {
  if (redisClient) {
    return redisClient
  }
  if (NEXUS_REFLECTION || isTest) {
    return
  }

  const client = redis.createClient({
    url: REDIS_URL,
    password: REDIS_PASSWORD,
    socket: {
      reconnectStrategy: redisReconnectStrategy(),
    },
  })

  client.on("error", (err: any) => {
    _logger.error(`Redis error`, err)
  })
  client.on("ready", () => {
    _logger.info(`Redis connected`)
  })
  client?.connect()

  redisClient = client

  return client
}

const isPromise = <T>(value: any): value is Promise<T> => {
  return value && typeof value.then === "function"
}
// @ts-ignore: not used for now
const isAsync = <T>(
  fn: (...props: any[]) => Promise<T> | T,
): fn is (...props: any[]) => Promise<T> => {
  return (
    fn && typeof fn === "function" && fn.constructor.name === "AsyncFunction"
  )
}

interface RedisifyOptions {
  prefix: string
  expireTime: number
  key: string
  params?: any
  disableResolveError?: boolean
}

type RedisifyContext = Partial<BaseContext> & { client?: typeof redisClient }

export async function redisify<T>(
  fn: ((...args: any[]) => Promise<T> | T) | Promise<T>,
  options: RedisifyOptions,
  ctx: RedisifyContext = {},
) {
  const { prefix, expireTime, key, params } = options
  const { logger = _logger, client = redisClient } = ctx

  const resolveValue = async () => {
    if (isPromise(fn)) {
      return fn
    }
    if (params) {
      return fn(...params)
    }
    return fn()
  }

  if (params && isPromise(fn)) {
    logger.warn(`Prefix ${prefix}: params ignored with a promise`)
  }

  const prefixedKey = `${prefix}:${key}`
  let value: T | undefined = undefined
  let resolveSuccess = false

  try {
    const res = await client?.get(prefixedKey)

    if (res) {
      logger.info(`Cache hit: ${prefix}`)
      try {
        console.log("----RES---- trying to parse", res)
        return JSON.parse(res)
      } catch (e) {
        logger.warn(`Cache hit but failed to parse result: ${prefix}`)
        throw e
      }
    }
    logger.info(`Cache miss: ${prefix}`)

    value = await resolveValue()
    resolveSuccess = true
  } catch (e) {
    logger.warn(
      attachError(`Cache miss but failed to resolve value: ${prefix}`, e),
    )
  }

  if (!resolveSuccess) {
    try {
      value = await resolveValue()
    } catch (e) {
      logger.warn(
        attachError(
          `Cache miss but failed to resolve value twice, giving up: ${prefix}`,
          e,
        ),
      )
      return
    }
  }

  try {
    if (typeof value === "undefined") {
      await client?.del(prefixedKey)
    } else {
      await client?.set(prefixedKey, JSON.stringify(value), {
        EX: expireTime,
      })
    }

    return value
  } catch (e) {
    logger.warn(
      attachError(`Resolved value but failed to set cache: ${prefix}`, e),
    )
    return value
  }
}

const convertError = (err: unknown) => {
  if (isNullOrUndefined(err) || err instanceof Error) {
    return err
  }

  return new Error(String(err))
}

const attachError = (msg: string, err: unknown) => {
  const e = convertError(err)
  if (e) {
    msg += `; error: ${e.message}`
  }
  return msg
}

export const invalidate = async (prefix: string, key: string) => {
  redisClient?.del(`${prefix}:${key}`)
}

export default getRedisClient()
