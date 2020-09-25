import * as Kafka from "node-rdkafka"
import winston from "winston"
import { KafkaError } from "../../lib/errors"

const logCommit = (logger: winston.Logger) => (
  err: any,
  topicPartitions: any,
) => {
  if (err) {
    logger.error(new KafkaError("Error in commit", err))
  } else {
    logger.info("Committed. topicPartitions:" + topicPartitions)
  }
}

export const createKafkaConsumer = (logger: winston.Logger) =>
  new Kafka.KafkaConsumer(
    {
      "group.id": "kafka",
      "metadata.broker.list": process.env.KAFKA_HOST,
      offset_commit_cb: logCommit(logger),
      "enable.auto.commit": false,
      "partition.assignment.strategy": "roundrobin",
    },
    { "auto.offset.reset": "earliest" },
  )
