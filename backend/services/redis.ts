import parseJSON from "json-parse-even-better-errors"
import { createSentinel } from "redis"
import * as winston from "winston"

import {
  isTest,
  NEXUS_REFLECTION,
  REDIS_DB,
  REDIS_PASSWORD,
  REDIS_SENTINEL_MASTER_NAME,
  REDIS_SENTINELS,
} from "../config"
import { BaseContext } from "../context"
import { isDefined, isPromise } from "../util"

const _logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "redis" },
  transports: [new winston.transports.Console()],
})

let redisClient: ReturnType<typeof createSentinel> | undefined

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

const getRedisClient = (): ReturnType<typeof createSentinel> | undefined => {
  if (redisClient) {
    return redisClient
  }
  if (NEXUS_REFLECTION || isTest) {
    return
  }

  const sentinels = REDIS_SENTINELS?.split(",").map((sentinel: string) => {
    const [host, port] = sentinel.trim().split(":")
    return { host, port: parseInt(port) ?? 26379 }
  })

  const client = createSentinel({
    name: REDIS_SENTINEL_MASTER_NAME!,
    sentinelRootNodes: sentinels ?? [],
    nodeClientOptions: {
      password: REDIS_PASSWORD,
      database: REDIS_DB,
      socket: {
        reconnectStrategy: redisReconnectStrategy(),
      },
    },
  })

  client.on("error", (err: any) => {
    _logger.error(`Redis Sentinel error`, err)
  })
  client.on("ready", () => {
    _logger.info(
      `Redis Sentinel connected to master: ${REDIS_SENTINEL_MASTER_NAME}`,
    )
  })

  // Connect the Sentinel client
  client.connect().catch((err: any) => {
    _logger.error(`Redis Sentinel connection failed`, err)
  })

  redisClient = client
  return client
}

interface RedisifyOptions {
  prefix: string
  expireTime: number
  key: string
  params?: any
  disableResolveError?: boolean
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

  // If Redis client is not connected, skip cache entirely (unless in test mode)
  if (!isTest && (!client || !client.isOpen)) {
    logger.info(`Redis not connected, skipping cache for: ${prefix}`)
    value = await resolveValue()
    return value
  }

  try {
    const res = client ? await client.get(prefixedKey) : undefined

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

  try {
    if (client) {
      if (typeof value === "undefined") {
        await client.del(prefixedKey)
      } else {
        await client.set(prefixedKey, JSON.stringify(value), {
          EX: expireTime,
        })
      }
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

export const invalidate = async (prefix: string, key: string) => {
  await redisClient?.del(`${prefix}:${key}`)
}

export default getRedisClient
