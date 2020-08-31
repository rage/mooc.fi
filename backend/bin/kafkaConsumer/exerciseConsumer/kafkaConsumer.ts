require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

import { Mutex } from "../../lib/await-semaphore"

import prismaClient from "../../lib/prisma"
import sentryLogger from "../../lib/logger"

import { handleMessage } from "../common/handleMessage"
import { Message } from "./interfaces"
import { MessageYupSchema } from "./validate"
import { saveToDatabase } from "./saveToDB"
import config from "../kafkaConfig"
import { createKafkaConsumer } from "../common/kafkaConsumer"
import { KafkaError } from "../../lib/errors"

const TOPIC_NAME = [config.exercise_consumer.topic_name]

const mutex = new Mutex()
const prisma = prismaClient()

const logger = sentryLogger({ service: "kafka-consumer-exercise" })

const consumer = createKafkaConsumer(logger)

consumer.connect()

consumer
  .on("ready", () => {
    consumer.subscribe(TOPIC_NAME)
    consumer.consume()
  })
  .on("data", (message) =>
    handleMessage<Message>({
      kafkaMessage: message,
      mutex,
      logger,
      consumer,
      prisma,
      MessageYupSchema,
      saveToDatabase,
    }),
  )
consumer.on("event.error", (error) => {
  logger.error(new KafkaError("Error", error))
  throw error
})

consumer.on("event.log", function (log) {
  console.log(log)
})
