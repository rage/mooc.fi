import * as redis from "redis"
import * as winston from "winston"
import { promisify } from "util"

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:7001"

const redisClient = redis.createClient({ url: REDIS_URL })

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "redis" },
  transports: [new winston.transports.Console()],
})

redisClient.on("error", err => logger.error("Redis error: " + err))

const getAsync = promisify(redisClient.get).bind(redisClient)

export async function redisify<T>(
  fn: ((props: any) => Promise<T>) | Promise<T>,
  options: { prefix: string; expireTime: number; key: string },
) {
  const { prefix, expireTime, key } = options

  if (!redisClient || (redisClient && !redisClient.connected)) {
    return fn
  }

  const prefixedKey = `${prefix}:${key}`

  return await getAsync(prefixedKey)
    .then(async res => {
      if (res) {
        return await JSON.parse(res)
      }

      const value = await fn

      redisClient.setex(prefixedKey, expireTime, JSON.stringify(value))

      return Promise.resolve(value)
    })
    .catch(() => fn)
}

export default redisClient
