import { PrismaClient } from "@prisma/client"
import { KafkaConsumer } from "node-rdkafka"
import { Logger } from "winston"
import { Mutex } from "../../lib/await-semaphore"

export interface KafkaContext {
  prisma: PrismaClient
  logger: Logger
  consumer: KafkaConsumer
  mutex: Mutex
}
