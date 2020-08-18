require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import { Mutex } from "../../lib/await-semaphore"

import * as Kafka from "node-rdkafka"
const config = require("../kafkaConfig")

import { handleMessage } from "../common/handleMessage"
import { Message } from "./interfaces"
import { MessageYupSchema } from "./validate"
import { saveToDatabase } from "./saveToDB"
import prismaClient from "../../lib/prisma"
import sentryLogger from "../../lib/logger"

const TOPIC_NAME = [config.user_points_consumer.topic_name]

const mutex = new Mutex()
const prisma = prismaClient()

const logger = sentryLogger({ service: "kafka-consumer-user-points" })

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

consumer.on("ready", () => {
  consumer.subscribe(TOPIC_NAME)
  const consumerImpl = async (error: any, messages: any) => {
    if (error) {
      logger.error("Error while consuming", error)
      process.exit(-1)
    }
    if (messages.length > 0) {
      await handleMessage<Message>({
        kafkaMessage: messages[0],
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
  logger.error(error)
  process.exit(-1)
})

consumer.on("event.log", function (log) {
  console.log(log)
})
