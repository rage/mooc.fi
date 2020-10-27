require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import { Mutex } from "../../lib/await-semaphore"

import { handleMessage } from "../common/handleMessage"
import { Message } from "../common/userCourseProgress/interfaces"
import {
  MessageYupSchema,
  handleNullProgress,
} from "../common/userCourseProgress/validate"
import { saveToDatabase } from "../common/userCourseProgress/saveToDB"
import prismaClient from "../../lib/prisma"
import sentryLogger from "../../lib/logger"
import config from "../kafkaConfig"
import { createKafkaConsumer } from "../common/kafkaConsumer"
import { KafkaError } from "../../lib/errors"
import { LibrdKafkaError, Message as KafkaMessage } from "node-rdkafka"

const prisma = prismaClient()
const mutex = new Mutex()
const TOPIC_NAME = [config.user_course_progress_consumer.topic_name]

const logger = sentryLogger({ service: "kafka-consumer-UserCourseProgress" })
const consumer = createKafkaConsumer(logger)

consumer.connect()

consumer.on("ready", () => {
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
      await handleMessage<Message>({
        kafkaMessage: message,
        mutex,
        logger,
        consumer,
        prisma,
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

consumer.on("event.error", (error) => {
  logger.error(new KafkaError("Error", error))
  process.exit(-1)
})

consumer.on("event.log", function (log) {
  console.log(log)
})
