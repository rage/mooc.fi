import { PrismaClient } from '../../node_modules/@prisma/client' // eh
import * as redis from 'redis'

export interface Settings {
  prisma: PrismaClient
  redisClient?: redis.RedisClient
}
