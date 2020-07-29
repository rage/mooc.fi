import { PrismaClient } from "@prisma/client"
import * as redis from "redis"

export interface Settings {
  prisma: PrismaClient
  redisClient?: redis.RedisClient
}
