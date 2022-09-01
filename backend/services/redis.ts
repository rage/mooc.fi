import * as redis from "redis"
import * as winston from "winston"

import { isTest, NEXUS_REFLECTION, REDIS_PASSWORD, REDIS_URL } from "../config"
import { isAsync, isPromise } from "../util"

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
  (redisName: string = "Redis", logger: winston.Logger = _logger) =>
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

/**
 *
 * @param fn Function (can be async) or a promise to be cached
 * @param options
 * @param options.prefix Prefix to be used in the redis cache key
 * @param options.expireTime Time in **seconds** to expire the cache
 * @param options.key Key to be used in the redis cache key
 * @param [options.params] Parameters to be passed to the function (ignored if a promise is given)
 * @param ctx
 * @param [ctx.client = redisClient] Redis client to be used
 * @param [ctx.logger = _logger] Winston logger to be used
 * @returns
 */
export async function redisify<T>(
  fn: ((...props: any[]) => Promise<T> | T) | Promise<T>,
  options: {
    prefix: string
    expireTime: number
    key: string
    params?: any
  },
  ctx: {
    client?: typeof redisClient
    logger?: winston.Logger
  } = {},
): Promise<T | undefined> {
  const { prefix, expireTime, key, params } = options
  const { logger = _logger, client = redisClient } = ctx

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
      return
    }
  }
}

export const invalidate = async (prefix: string, key: string) => {
  redisClient?.del(`${prefix}:${key}`)
}

export default getRedisClient()
