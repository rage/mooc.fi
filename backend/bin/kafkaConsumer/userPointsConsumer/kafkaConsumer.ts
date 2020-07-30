require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import { Mutex } from "../../lib/await-semaphore"

import * as Kafka from "node-rdkafka"
import * as winston from "winston"
const config = require("../kafkaConfig")

import { handleMessage } from "./handleMessage"
import prismaClient from "../../lib/prisma"

const TOPIC_NAME = [config.user_points_consumer.topic_name]

const mutex = new Mutex()
const prisma = prismaClient()

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "kafka-consumer-user-points" },
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
    "group.id": "kafka-beta",
    "metadata.broker.list": process.env.KAFKA_HOST,
    offset_commit_cb: logCommit,
    "enable.auto.commit": false,
    "partition.assignment.strategy": "roundrobin",
  },
  { "auto.offset.reset": "earliest" },
)

consumer.connect()

consumer.on("ready", () => {
  consumer.subscribe(TOPIC_NAME)
  const consumerImpl = async (error: any, messages: any) => {
    if (error) {
      logger.error("Error while consuming", error)
      process.exit(-1)
    }
    if (messages.length > 0) {
      await handleMessage(messages[0], mutex, logger, consumer, prisma)
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
  logger.error(error)
  process.exit(-1)
})

consumer.on("event.log", function (log) {
  console.log(log)
})
