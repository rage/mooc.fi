import { LibrdKafkaError, Message as KafkaMessage } from "node-rdkafka"

import prisma from "../../../prisma"
import knex from "../../../services/knex"
import { Mutex } from "../../lib/await-semaphore"
import { KafkaError } from "../../lib/errors"
import sentryLogger from "../../lib/logger"
import { createKafkaConsumer } from "../common/createKafkaConsumer"
import { handleMessage } from "../common/handleMessage"
import { handledRecently, setHandledRecently } from "../common/messageHashCache"
import { Message } from "../common/userCourseProgress/interfaces"
import { saveToDatabase } from "../common/userCourseProgress/saveToDB"
import {
  handleNullProgress,
  MessageYupSchema,
} from "../common/userCourseProgress/validate"
import config from "../kafkaConfig"

const mutex = new Mutex()
const TOPIC_NAME = [config.user_course_progress_realtime_consumer.topic_name]

const logger = sentryLogger({
  service: "kafka-consumer-UserCourseProgress-realtime",
})
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
      const message = handleNullProgress(messages[0])
      const messageString = message?.value?.toString("utf8") ?? ""
      if (!handledRecently(messageString)) {
        await handleMessage<Message>({
          context,
          kafkaMessage: message,
          MessageYupSchema,
          saveToDatabase,
        })
        setHandledRecently(messageString)
      } else {
        logger.info("Skipping message because it was already handled recently.")
      }

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
