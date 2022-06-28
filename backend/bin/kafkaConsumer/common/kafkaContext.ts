import { Knex } from "knex"
import { KafkaConsumer } from "node-rdkafka"
import { Logger } from "winston"

import { PrismaClient } from "@prisma/client"

import { Mutex } from "../../lib/await-semaphore"

export interface KafkaContext {
  prisma: PrismaClient
  logger: Logger
  consumer: KafkaConsumer
  mutex: Mutex
  knex: Knex
  topic_name: string
}
