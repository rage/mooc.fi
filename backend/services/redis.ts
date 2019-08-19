import * as redis from "redis"
import * as winston from "winston"
import * as bluebird from "bluebird"

bluebird.promisifyAll(redis)

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

export default redisClient
