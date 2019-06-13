require("dotenv-safe").config()
import { prisma } from "../../generated/prisma-client"
import { Mutex } from "await-semaphore"

import * as Kafka from "node-rdkafka"
import * as winston from "winston"

import { handleMessage } from "./handleMessage"

const mutex = new Mutex()

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "kafka-consumer" },
  transports: [new winston.transports.Console()],
})

const logCommit = (err, topicPartitions) => {
  if (err) {
    logger.error("Error in commit:" + err)
  } else {
    logger.info("Committed. topicPartitions:" + topicPartitions)
  }
}

const message_cb = message => {
  handleMessage(message, mutex, logger, consumer, prisma)
}

const consumer = new Kafka.KafkaConsumer(
  {
    "group.id": "kafka",
    "metadata.broker.list": process.env.KAFKA_HOST,
    offset_commit_cb: logCommit,
    "enable.auto.commit": "false",
    "partition.assignment.strategy": "roundrobin",
  },
  {},
)

consumer.connect()

consumer
  .on("ready", () => {
    consumer.subscribe([process.env.KAFKA_TOPIC])
    consumer.consume()
  })
  .on("data", message_cb)
