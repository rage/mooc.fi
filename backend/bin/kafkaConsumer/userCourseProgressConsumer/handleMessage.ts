import { Message } from "./interfaces"
import { saveToDatabase } from "./saveToDB"
import { Prisma } from "../../../generated/prisma-client"
import { MessageYupSchema } from "./validate"
import { Logger } from "winston"
import { KafkaConsumer, ConsumerStreamMessage } from "node-rdkafka"
import { Mutex } from "../../lib/await-semaphore"

const config = require("../kafkaConfig")

let commitCounter = 0

const commitInterval = config.commit_interval

export const handleMessage = async (
  kafkaMessage: ConsumerStreamMessage,
  mutex: Mutex,
  logger: Logger,
  consumer: KafkaConsumer,
  prisma: Prisma,
) => {
  //Going to mutex
  const release = await mutex.acquire()
  //logger.info(kafkaMessage)
  logger.info("Handling message")
  let message: Message
  try {
    message = JSON.parse(kafkaMessage.value.toString("utf8"))
  } catch (e) {
    logger.error("invalid message", e)
    await commit(kafkaMessage, consumer)
    release()
    return
  }

  try {
    await MessageYupSchema.validate(message)
  } catch (error) {
    logger.error("JSON VALIDATE FAILED: " + error, { message })
    await commit(kafkaMessage, consumer)
    release()
    return
  }

  try {
    if (!(await saveToDatabase(message, prisma, logger))) {
      logger.error("Could not save event to database")
    }
  } catch (error) {
    logger.error("Could not save event to database:", error)
  }
  await commit(kafkaMessage, consumer)
  //Releasing mutex
  release()
}

const commit = async (message: any, consumer: KafkaConsumer) => {
  if (commitCounter >= commitInterval) {
    await consumer.commitMessage(message)
    commitCounter = 0
  }
  commitCounter++
}
