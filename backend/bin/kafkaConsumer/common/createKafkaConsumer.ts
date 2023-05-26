import * as Kafka from "node-rdkafka"
import { ConsumerGlobalConfig } from "node-rdkafka"
import { v4 } from "uuid"
import winston from "winston"

import type { PrismaClient } from "@prisma/client"

import {
  KAFKA_CONSUMER_GROUP,
  KAFKA_DEBUG_CONTEXTS,
  KAFKA_HOST,
  KAFKA_TOP_OF_THE_QUEUE,
} from "../../../config"
import { KafkaError } from "../../../lib/errors"
import { attachPrismaEvents } from "../../../util/prismaLogger"
import checkConnectionInInterval from "./connectedChecker"

const logCommit =
  (logger: winston.Logger) =>
  (err: any, topicPartitions: Kafka.TopicPartition[]) => {
    if (err) {
      logger.error(new KafkaError("Error in commit", err))
    } else {
      logger.info(
        "Committed. topicPartitions:" + JSON.stringify(topicPartitions),
      )
    }
  }

interface CreateKafkaConsumerArgs {
  logger: winston.Logger
  prisma?: PrismaClient
}

export const createKafkaConsumer = ({
  logger,
  prisma,
}: CreateKafkaConsumerArgs) => {
  let consumerGroup = KAFKA_CONSUMER_GROUP ?? "kafka"
  if (KAFKA_TOP_OF_THE_QUEUE) {
    consumerGroup = v4()
  }
  logger.info(`Joining consumer group ${consumerGroup}.`)

  const globalConfig: ConsumerGlobalConfig = {
    "group.id": consumerGroup,
    "metadata.broker.list": KAFKA_HOST,
    offset_commit_cb: logCommit(logger),
    "enable.auto.commit": false,
    "partition.assignment.strategy": "roundrobin",
  }
  if (KAFKA_DEBUG_CONTEXTS) {
    globalConfig["debug"] = KAFKA_DEBUG_CONTEXTS
  }

  const consumer = new Kafka.KafkaConsumer(globalConfig, {
    "auto.offset.reset": KAFKA_TOP_OF_THE_QUEUE ? "latest" : "earliest",
  })

  consumer.on("event.error", (error) => {
    logger.error(new KafkaError("Error", error))
    process.exit(-1)
  })

  consumer.on("event.log", function (log) {
    logger.info(log)
  })

  consumer.on("connection.failure", (err, metrics) => {
    logger.info("Connection failed with " + err.message)
    logger.info("Metrics: " + JSON.stringify(metrics))
    consumer.connect()
  })

  checkConnectionInInterval(consumer)

  if (prisma) {
    attachPrismaEvents({
      logger,
      prisma,
    })
  }
  return consumer
}
