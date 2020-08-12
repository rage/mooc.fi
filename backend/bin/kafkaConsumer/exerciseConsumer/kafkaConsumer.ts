require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

import { Mutex } from "../../lib/await-semaphore"

import * as Kafka from "node-rdkafka"
import * as winston from "winston"
import prismaClient from "../../lib/prisma"

import { handleMessage } from "../common/handleMessage"
import { Message } from "./interfaces"
import { MessageYupSchema } from "./validate"
import { saveToDatabase } from "./saveToDB"

const config = require("../kafkaConfig.json")
const TOPIC_NAME = [config.exercise_consumer.topic_name]

const mutex = new Mutex()
const prisma = prismaClient()

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "kafka-consumer-exercise" },
  transports: [new winston.transports.Console()],
})

const logCommit = (err: any, topicPartitions: any) => {
  if (err) {
    logger.error("Error in commit:" + err)
  } else {
    logger.info("Committed. topicPartitions:" + topicPartitions)
  }
}

const consumer = new Kafka.KafkaConsumer(
  {
    "group.id": "kafka",
    "metadata.broker.list": process.env.KAFKA_HOST,
    offset_commit_cb: logCommit,
    "enable.auto.commit": false,
    "partition.assignment.strategy": "roundrobin",
  },
  { "auto.offset.reset": "earliest" },
)

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
  logger.error(error)
  throw error
})

consumer.on("event.log", function (log) {
  console.log(log)
})
