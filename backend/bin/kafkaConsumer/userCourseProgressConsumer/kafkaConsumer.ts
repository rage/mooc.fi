require("dotenv-safe").config()
import { prisma } from "../../../generated/prisma-client"
import { Mutex } from "await-semaphore"

import * as Kafka from "node-rdkafka"
import * as winston from "winston"

import { handleMessage } from "./handleMessage"

const config = require("../kafkaConfig")

const mutex = new Mutex()
const TOPIC_NAME = [config.user_course_progress_consumer.topic_name]

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "kafka-consumer-UserCourseProgress" },
  transports: [new winston.transports.Console()],
})

const logCommit = (err, topicPartitions) => {
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
    "enable.auto.commit": "false",
    "partition.assignment.strategy": "roundrobin",
  },
  { "auto.offset.reset": "earliest" },
)
logger.info("Trying to connect")
consumer.connect()

consumer
  .on("ready", () => {
    logger.info("ready")
    consumer.subscribe(TOPIC_NAME)
    consumer.consume()
  })
  .on("data", message =>
    handleMessage(message, mutex, logger, consumer, prisma),
  )
consumer.on("event.error", error => logger.error(error))

consumer.on("event.log", function(log) {
  console.log(log)
})
