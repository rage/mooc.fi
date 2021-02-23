import * as Kafka from "node-rdkafka"
import { ConsumerGlobalConfig } from "node-rdkafka"
import winston from "winston"
import { KafkaError } from "../../lib/errors"

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
  const globalConfig: ConsumerGlobalConfig = {
    "group.id": consumerGroup,
    "metadata.broker.list": process.env.KAFKA_HOST,
    offset_commit_cb: logCommit(logger),
    "enable.auto.commit": false,
    "partition.assignment.strategy": "roundrobin",
  }
  if (process.env.KAFKA_DEBUG_CONTEXTS) {
    globalConfig["debug"] = process.env.KAFKA_DEBUG_CONTEXTS
  }
  return new Kafka.KafkaConsumer(globalConfig, {
    "auto.offset.reset": "earliest",
  })
}
