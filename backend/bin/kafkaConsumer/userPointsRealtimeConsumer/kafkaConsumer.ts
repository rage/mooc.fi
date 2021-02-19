require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import { Mutex } from "../../lib/await-semaphore"
import config from "../kafkaConfig"

import { handleMessage } from "../common/handleMessage"
import { Message } from "../common/userPoints/interfaces"
import { MessageYupSchema } from "../common/userPoints/validate"
import { saveToDatabase } from "../common/userPoints/saveToDB"
import prisma from "../../lib/prisma"
import sentryLogger from "../../lib/logger"
import { createKafkaConsumer } from "../common/kafkaConsumer"
import { LibrdKafkaError } from "node-rdkafka"
import { KafkaError } from "../../lib/errors"
import knex from "../../../services/knex"

const TOPIC_NAME = [config.user_points_realtime_consumer.topic_name]

const mutex = new Mutex()

const logger = sentryLogger({ service: "kafka-consumer-user-points-realtime" })
const consumer = createKafkaConsumer(logger)

consumer.connect()

const context = {
  prisma,
  logger,
  mutex,
  consumer,
  knex,
}

consumer.on("ready", () => {
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

consumer.on("event.error", (error) => {
  logger.error(new KafkaError("Error", error))
  process.exit(-1)
})

consumer.on("event.log", function (log) {
  console.log(log)
})

consumer.on("connection.failure", (err, metrics) => {
  logger.info("Connection failed with " + err)
  logger.info("Metrics: " + JSON.stringify(metrics))
  consumer.connect()
})
