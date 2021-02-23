import * as Kafka from "node-rdkafka"
import winston from "winston"
import { KafkaError } from "../../lib/errors"
import checkConnectionInInterval from "./connectedChecker"

const logCommit = (logger: winston.Logger) => (
  err: any,
  topicPartitions: any,
) => {
  if (err) {
    logger.error(new KafkaError("Error in commit", err))
  } else {
    logger.info("Committed. topicPartitions:" + JSON.stringify(topicPartitions))
  }
}

export const createKafkaConsumer = (logger: winston.Logger) => {
  const consumerGroup = process.env.KAFKA_CONSUMER_GROUP ?? "kafka"
  logger.info(`Joining consumer group ${consumerGroup}.`)
  const consumer = new Kafka.KafkaConsumer(
    {
      "group.id": consumerGroup,
      "metadata.broker.list": process.env.KAFKA_HOST,
      offset_commit_cb: logCommit(logger),
      "enable.auto.commit": false,
      "partition.assignment.strategy": "roundrobin",
      ...(process.env.KAFKA_DEBUG_CONTEXTS
        ? {
            debug: process.env.KAFKA_DEBUG_CONTEXTS,
          }
        : {}),
    },
    { "auto.offset.reset": "earliest" },
  )

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

  checkConnectionInInterval(consumer)

  return consumer
}
