require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import { Mutex } from "../../lib/await-semaphore"
import config from "../kafkaConfig"

import { handleMessage } from "../common/handleMessage"
import { Message } from "../common/userPoints/interfaces"
import { MessageYupSchema } from "../common/userPoints/validate"
import { saveToDatabase } from "../common/userPoints/saveToDB"
import prisma from "../../../prisma"
import sentryLogger from "../../lib/logger"
import { createKafkaConsumer } from "../common/createKafkaConsumer"
import { LibrdKafkaError } from "node-rdkafka"
import { KafkaError } from "../../lib/errors"
import knex from "../../../services/knex"

const TOPIC_NAME = [config.user_points_realtime_consumer.topic_name]

const mutex = new Mutex()

const logger = sentryLogger({ service: "kafka-consumer-user-points-realtime" })
const consumer = createKafkaConsumer({ logger, prisma })

consumer.connect()

const context = {
  prisma,
  logger,
  mutex,
  consumer,
  knex,
  topic_name: TOPIC_NAME[0],
}

consumer.on("ready", () => {
  logger.info("Ready to consume")
  consumer.subscribe(TOPIC_NAME)
  const consumerImpl = async (error: LibrdKafkaError, messages: any) => {
    if (error) {
      logger.error(new KafkaError("Error while consuming", error))
      process.exit(-1)
    }
    if (messages.length > 0) {
      await handleMessage<Message>({
        context,
        kafkaMessage: messages[0],
        MessageYupSchema,
        saveToDatabase,
      })
      setImmediate(() => {
        consumer.consume(1, consumerImpl)
      })
    } else {
      setTimeout(() => {
        consumer.consume(1, consumerImpl)
      }, 10)
    }
  }
  consumer.consume(1, consumerImpl)
})
