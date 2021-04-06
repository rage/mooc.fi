import { PrismaClient } from "@prisma/client"
import { KafkaConsumer } from "node-rdkafka"
import { Logger } from "winston"
import { Mutex } from "../../lib/await-semaphore"
import { Knex } from "knex"

export interface KafkaContext {
  prisma: PrismaClient
  logger: Logger
  consumer: KafkaConsumer
  mutex: Mutex
  knex: Knex
}
