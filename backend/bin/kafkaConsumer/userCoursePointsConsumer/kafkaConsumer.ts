import { Message as KafkaMessage, LibrdKafkaError } from "node-rdkafka"

import { Mutex } from "../../../lib/await-semaphore"
import { KafkaError } from "../../../lib/errors"
import sentryLogger from "../../../lib/logger"
import prisma from "../../../prisma"
import knex from "../../../services/knex"
import { createKafkaConsumer } from "../common/createKafkaConsumer"
import { handleMessage } from "../common/handleMessage"
import { KafkaContext } from "../common/kafkaContext"
import { handledRecently, setHandledRecently } from "../common/messageHashCache"
import { saveToDatabase } from "../common/userCoursePoints/saveToDB"
import { MessageYupSchema } from "../common/userCoursePoints/validate"
import config from "../kafkaConfig"

const TOPIC_NAME = [config.user_course_points_consumer.topic_name]

const mutex = new Mutex()

const logger = sentryLogger({ service: "kafka-consumer-user-course-points" })
const consumer = createKafkaConsumer({ logger, prisma })

consumer.connect()

const context: KafkaContext = {
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
      const messageString = messages[0]?.value?.toString("utf8") ?? ""
      if (!handledRecently(messageString)) {
        await handleMessage({
          context,
          kafkaMessage: messages[0],
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
