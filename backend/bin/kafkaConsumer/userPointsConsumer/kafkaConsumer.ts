import { Message as KafkaMessage, LibrdKafkaError } from "node-rdkafka"

import prisma from "../../../prisma"
import knex from "../../../services/knex"
import { Mutex } from "../../lib/await-semaphore"
import { KafkaError } from "../../lib/errors"
import sentryLogger from "../../lib/logger"
import { createKafkaConsumer } from "../common/createKafkaConsumer"
import { handleMessage } from "../common/handleMessage"
import { Message } from "../common/userPoints/interfaces"
import { saveToDatabase } from "../common/userPoints/saveToDB"
import { MessageYupSchema } from "../common/userPoints/validate"
import config from "../kafkaConfig"

const TOPIC_NAME = [config.user_points_consumer.topic_name]

const mutex = new Mutex()

const logger = sentryLogger({ service: "kafka-consumer-user-points" })
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

  const consumerImpl = async (
    error: LibrdKafkaError,
    messages: KafkaMessage[],
  ) => {
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
