import parseJSON from "json-parse-even-better-errors"
import { createClient } from "redis"
import * as winston from "winston"

import {
  isTest,
  NEXUS_REFLECTION,
  REDIS_DB,
  REDIS_PASSWORD,
  REDIS_URL,
} from "../config"
import { BaseContext } from "../context"
import { isDefined, isPromise } from "../util"
import { withCacheTimeout } from "./cacheTimeout"

const _logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "redis" },
  transports: [new winston.transports.Console()],
})

type RedisClient = ReturnType<typeof createClient>
let redisClient: RedisClient | undefined
let redisSubscriberClient: RedisClient | undefined

export const redisReconnectStrategy =
  (redisName = "Redis", logger: winston.Logger = _logger) =>
  (retriesOrError: number | Error) => {
    if (retriesOrError instanceof Error) {
      logger.error(`${redisName} reconnection failed`, retriesOrError)
      process.exit(-1)
    }
    const retries = retriesOrError
    const nextDelay = Math.min(2 ** retries * 20, 3000)
    logger.info(
      `${redisName} connection attempt: ${retries}, next attempt in: ${nextDelay}ms`,
    )
    return nextDelay
  }

const getRedisClient = (): RedisClient | undefined => {
  if (redisClient) {
    return redisClient
  }
  if (NEXUS_REFLECTION ?? isTest) {
    return
  }

  let url = REDIS_URL?.trim() || "redis://127.0.0.1:6379"
  if (url && !url.startsWith("redis://") && !url.startsWith("rediss://")) {
    url = `redis://${url}`
  }
  if (url && !url.includes(":") && !url.includes("/")) {
    url = `${url}:6379`
  }

  const client = createClient({
    url,
    password: REDIS_PASSWORD,
    database: REDIS_DB,
    disableOfflineQueue: true,
    socket: {
      reconnectStrategy: redisReconnectStrategy(),
    },
  })

  client.on("error", (err: any) => {
    _logger.error(`Redis error`, err)
  })
  client.on("ready", () => {
    _logger.info(`Redis connected to: ${url}`)
  })

  client.connect().catch((err: any) => {
    _logger.error(`Redis connection failed`, err)
  })

  redisClient = client
  return client
}

export const initializeRedis = async (): Promise<void> => {
  _logger.info("Initializing Redis")
  try {
    const client = getRedisClient()
    if (client && !client.isOpen) {
      try {
        await client.connect()
        _logger.info("Redis connection established")
      } catch (err: any) {
        _logger.warn(`Redis connection failed, will retry automatically`, err)
      }
    }
  } catch (err: any) {
    _logger.warn(`Redis initialization error, continuing without cache`, err)
  }
}

const getRedisSubscriberClient = (): RedisClient | undefined => {
  if (redisSubscriberClient) {
    return redisSubscriberClient
  }
  if (NEXUS_REFLECTION ?? isTest) {
    return
  }

  const mainClient = getRedisClient()
  if (!mainClient?.isOpen) {
    return
  }

  let url = REDIS_URL?.trim() || "redis://127.0.0.1:6379"
  if (url && !url.startsWith("redis://") && !url.startsWith("rediss://")) {
    url = `redis://${url}`
  }
  if (url && !url.includes(":") && !url.includes("/")) {
    url = `${url}:6379`
  }

  const subscriber = createClient({
    url,
    password: REDIS_PASSWORD,
    database: REDIS_DB,
    socket: {
      reconnectStrategy: redisReconnectStrategy("Redis Subscriber"),
    },
  })

  subscriber.on("error", (err: any) => {
    _logger.error(`Redis subscriber error`, err)
  })
  subscriber.on("ready", () => {
    _logger.info(`Redis subscriber connected to: ${url}`)
  })

  redisSubscriberClient = subscriber
  return redisSubscriberClient
}

export { getRedisSubscriberClient }

interface RedisifyOptions {
  prefix: string
  expireTime: number
  key: string
  params?: any
  retry?: boolean
  throwOnError?: boolean
}

type RedisifyContext = Partial<BaseContext> & { client?: typeof redisClient }

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
  fn: ((...args: any[]) => Promise<T> | T) | Promise<T>,
  options: RedisifyOptions,
  ctx: RedisifyContext = {},
) {
  const {
    prefix,
    expireTime,
    key,
    params,
    retry = true,
    throwOnError = false,
  } = options
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
  let value: T | undefined
  let resolveSuccess = false

  if (!isTest && !client?.isReady) {
    logger.debug(`Redis not ready, skipping cache for: ${prefix}`)
    value = await resolveValue()
    return value
  }

  try {
    const res = await cacheGet(prefixedKey, { client, logger })

    if (res) {
      logger.info(`Cache hit: ${prefix}`)
      try {
        return parseJSON(res) as T
      } catch (e) {
        logger.warn(`Cache hit but failed to parse result: ${prefix}`)
        throw convertError(e)
      }
    }
    logger.info(`Cache miss: ${prefix}`)

    value = await resolveValue()
    resolveSuccess = true
  } catch (e) {
    logger.warn(
      attachError(`Cache miss but failed to resolve value: ${prefix}`, e),
    )

    if (!resolveSuccess) {
      if (retry) {
        try {
          value = await resolveValue()
        } catch (e2) {
          if (throwOnError && !value) {
            throw convertError(e2)
          }
          logger.warn(
            attachError(
              `Cache miss but failed to resolve value twice, giving up: ${prefix}`,
              e2,
            ),
          )
          return
        }
      } else {
        throw convertError(e)
      }
    }
  }

  if (typeof value !== "undefined") {
    await cacheSet(prefixedKey, JSON.stringify(value), expireTime, {
      client,
      logger,
    })
  }
  return value
}

const convertError = (err: unknown) => {
  if (!isDefined(err) || err instanceof Error) {
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

interface CacheOptions {
  client?: RedisClient
  logger?: winston.Logger
}

/**
 * Guarded Redis access for request paths: skips when Redis isn't ready, bounds
 * each command with {@link withCacheTimeout}, and never throws. Failures are
 * logged and read as a miss (`null`) or a no-op.
 */
const guarded = async <T>(
  description: string,
  run: (client: RedisClient) => Promise<T>,
  { client = getRedisClient(), logger = _logger }: CacheOptions,
): Promise<T | null> => {
  if (!client?.isReady) {
    return null
  }
  try {
    return await withCacheTimeout(() => run(client))
  } catch (e) {
    logger.warn(attachError(`Cache ${description} failed`, e))
    return null
  }
}

export const isCacheReady = () => Boolean(getRedisClient()?.isReady)

export const cacheGet = (key: string, options: CacheOptions = {}) =>
  guarded(`read of ${key}`, (client) => client.get(key), options)

export const cacheSet = async (
  key: string,
  value: string,
  ttlSeconds: number,
  options: CacheOptions = {},
) => {
  await guarded(
    `write of ${key}`,
    (client) => client.set(key, value, { EX: ttlSeconds }),
    options,
  )
}

export const cacheDel = async (key: string, options: CacheOptions = {}) => {
  await guarded(`delete of ${key}`, (client) => client.del(key), options)
}

export const cacheIncr = (key: string, options: CacheOptions = {}) =>
  guarded(`increment of ${key}`, (client) => client.incr(key), options)

/** Deletes a cached value; never throws, so callers can await it mid-write. */
export const invalidate = (prefix: string, key: string) =>
  cacheDel(`${prefix}:${key}`)

export default getRedisClient
