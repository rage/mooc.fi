import { Message } from "./interfaces"
import { saveToDatabase } from "./saveToDB"
import { PrismaClient } from "@prisma/client"
import { MessageYupSchema } from "./validate"
import { Mutex } from "../../lib/await-semaphore"
import { Logger } from "winston"
import { KafkaConsumer, Message as KafkaMessage } from "node-rdkafka"

const config = require("../kafkaConfig.json")

let commitCounter = 0
const commitInterval = config.commit_interval
export const handleMessage = async (
  kafkaMessage: KafkaMessage,
  mutex: Mutex,
  logger: Logger,
  consumer: KafkaConsumer,
  prisma: PrismaClient,
) => {
  //Going to mutex
  const release = await mutex.acquire()
  logger.info(kafkaMessage)
  let message: Message
  try {
    message = JSON.parse(kafkaMessage?.value?.toString("utf8") ?? "")
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
    logger.info("Saving. Timestamp " + message.timestamp)
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
